import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  
  const isLocal = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1';
  const forwardedHost = request.headers.get('x-forwarded-host');
  const origin = isLocal
    ? requestUrl.origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : requestUrl.origin;

  // Handle OAuth provider errors (e.g. provider disabled, user cancelled, access denied)
  if (error || errorDescription) {
    const rawMessage = errorDescription || error || 'OAuth authentication failed';
    const cleanMessage = rawMessage.includes('unsupported_provider') || rawMessage.includes('external provider')
      ? 'Google OAuth provider is not enabled in your Supabase project. Please enable Google Auth in your Supabase Dashboard or use email / 1-Click Demo Login.'
      : rawMessage;
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(cleanMessage)}`);
  }

  if (code) {
    const supabase = createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`);
  }

  // If no code and no error was provided
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('No authorization code provided')}`);
}


