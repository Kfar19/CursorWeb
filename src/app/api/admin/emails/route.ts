import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Basic security check - you might want to add proper authentication
    const authHeader = request.headers.get('authorization');
    
    // For now, we'll just check if the request comes from localhost
    // In production, you should implement proper authentication
    const host = request.headers.get('host') || '';
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const emailFile = path.join(process.cwd(), 'data', 'emails', 'research-emails.json');
    
    if (!fs.existsSync(emailFile)) {
      return NextResponse.json({ emails: [] });
    }

    const fileContent = fs.readFileSync(emailFile, 'utf-8');
    const emails = JSON.parse(fileContent);

    // Sort by timestamp (newest first)
    emails.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ emails });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
} 