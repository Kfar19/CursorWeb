import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { email, fileName } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate work email (basic check)
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (personalDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Please use a work email address' },
        { status: 400 }
      );
    }

    // Create emails directory if it doesn't exist
    const emailsDir = path.join(process.cwd(), 'data', 'emails');
    if (!fs.existsSync(emailsDir)) {
      fs.mkdirSync(emailsDir, { recursive: true });
    }

    // Save email to file
    const emailData = {
      email,
      fileName,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    const emailFile = path.join(emailsDir, 'research-emails.json');
    
    // Read existing emails or create new array
    let emails = [];
    if (fs.existsSync(emailFile)) {
      const fileContent = fs.readFileSync(emailFile, 'utf-8');
      emails = JSON.parse(fileContent);
    }

    // Add new email
    emails.push(emailData);

    // Write back to file
    fs.writeFileSync(emailFile, JSON.stringify(emails, null, 2));

    // Log to console for development
    console.log('📧 Email collected:', emailData);

    return NextResponse.json(
      { success: true, message: 'Email collected successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error collecting email:', error);
    return NextResponse.json(
      { error: 'Failed to collect email' },
      { status: 500 }
    );
  }
} 