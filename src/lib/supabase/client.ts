import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xokarwrqmeyqguwcezee.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva2Fyd3JxbWV5cWd1d2NlemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NjEzMDQsImV4cCI6MjEwMjUzNzMwNH0.wZsPrTIp3mQAPX4OMk5ukGK01iGpmprNEbYFfV6Yp-o';

export function createClient() {
  if (typeof window === 'undefined') {
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  if (!client) {
    client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return client;
}

