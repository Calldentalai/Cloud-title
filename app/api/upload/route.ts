import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Check if Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // Upload to Vercel Blob
        const blob = await put(filename, file, {
          access: 'public',
        });

        return NextResponse.json({
          success: true,
          url: blob.url,
          filename: file.name,
          size: file.size,
          type: file.type,
        });
      } catch (blobError) {
        console.error('Vercel Blob upload failed, falling back to base64:', blobError);
        // Fall through to base64 fallback
      }
    }

    // Fallback: Convert to base64 data URL (for local dev or if Blob fails)
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
