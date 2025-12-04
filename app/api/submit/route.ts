import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.callreceptionist.com/webhook/cloud-title-onboarding';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Forward to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }

    const result = await response.json().catch(() => ({ success: true }));

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error forwarding to webhook:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit form',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
