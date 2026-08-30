import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeChartImage } from '@/lib/anthropic/analyzer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const timeframe = (formData.get('timeframe') as string) || '1h';
    const tickerGuess = (formData.get('tickerGuess') as string) || '';
    const demoMode = formData.get('demo') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No chart image provided' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Convert file to base64 for Claude Vision API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const mediaType = file.type || 'image/png';

    // 1. Run Claude Sonnet Vision analysis
    const analysisResult = await analyzeChartImage({
      imageBase64: base64Data,
      mediaType,
      timeframe,
      tickerGuess,
    });

    let uploadId: string | null = null;
    let analysisId: string | null = null;
    let publicImageUrl: string = '';

    // If user is authenticated, persist to Supabase Storage & Database
    if (user) {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      // Upload image to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('chart-images')
        .upload(fileName, buffer, {
          contentType: mediaType,
          upsert: true,
        });

      const storagePath = storageData?.path || fileName;

      // Get signed URL for viewing
      const { data: signedData } = await supabase.storage
        .from('chart-images')
        .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 days

      publicImageUrl = signedData?.signedUrl || '';

      // Insert record into chart_uploads table
      const { data: uploadRecord, error: uploadError } = await supabase
        .from('chart_uploads')
        .insert({
          user_id: user.id,
          storage_path: storagePath,
          ticker_guess: analysisResult.ticker_guess || tickerGuess || null,
          timeframe: timeframe,
        })
        .select()
        .single();

      if (uploadError) {
        console.error('Error inserting chart_upload:', uploadError);
      }

      uploadId = uploadRecord?.id || null;

      if (uploadId) {
        // Insert record into chart_analyses table
        const { data: analysisRecord, error: analysisDbError } = await supabase
          .from('chart_analyses')
          .insert({
            upload_id: uploadId,
            user_id: user.id,
            trend_summary: analysisResult.trend_summary,
            demand_zones: analysisResult.demand_zones,
            supply_zones: analysisResult.supply_zones,
            confidence: analysisResult.confidence,
            raw_model_response: analysisResult,
          })
          .select()
          .single();

        if (analysisDbError) {
          console.error('Error inserting chart_analysis:', analysisDbError);
        }

        analysisId = analysisRecord?.id || null;
      }
    } else {
      // In guest/demo mode, generate transient data URL
      publicImageUrl = `data:${mediaType};base64,${base64Data}`;
      analysisId = 'demo-' + Date.now();
      uploadId = 'demo-upload-' + Date.now();
    }

    return NextResponse.json({
      success: true,
      analysisId,
      uploadId,
      imageUrl: publicImageUrl,
      analysis: analysisResult,
      authenticated: !!user,
    });
  } catch (error: any) {
    console.error('Error in analyze-chart route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing chart' },
      { status: 500 }
    );
  }
}
