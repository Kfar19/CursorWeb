import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Demo test endpoint is working',
    demoPassword: 'demo2025',
    timestamp: new Date().toISOString()
  });
} 