import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface EmailData {
  email: string;
  timestamp: string;
  fileName?: string;
  source?: string;
  name?: string;
  company?: string;
  message?: string;
}

export async function GET() {
  try {
    // Note: Authentication is now handled on the frontend
    // The admin page has its own login system

    const emailFile = path.join(process.cwd(), 'data', 'emails', 'research-emails.json');
    
    if (!fs.existsSync(emailFile)) {
      return NextResponse.json({ emails: [] });
    }

    const fileContent = fs.readFileSync(emailFile, 'utf-8');
    const emails: EmailData[] = JSON.parse(fileContent);

    // Sort by timestamp (newest first)
    emails.sort((a: EmailData, b: EmailData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ emails });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
} 