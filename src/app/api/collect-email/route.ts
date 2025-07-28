import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, company, message, source, fileName } = body;

    // Validate required fields
    if (!email || !source) {
      return NextResponse.json(
        { error: 'Email and source are required' },
        { status: 400 }
      );
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const emailData = {
      email,
      fileName: fileName || null,
      source,
      name: name || '',
      company: company || '',
      message: message || '',
      timestamp: new Date().toISOString(),
      userAgent,
      ip
    };

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data', 'emails');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const emailFile = path.join(dataDir, 'research-emails.json');
    
    // Read existing emails or create empty array
    let emails = [];
    if (fs.existsSync(emailFile)) {
      const fileContent = fs.readFileSync(emailFile, 'utf-8');
      emails = JSON.parse(fileContent);
    }

    // Add new email
    emails.unshift(emailData);

    // Write back to file
    fs.writeFileSync(emailFile, JSON.stringify(emails, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Email collected successfully' 
    });

  } catch (error) {
    console.error('Error collecting email:', error);
    return NextResponse.json(
      { error: 'Failed to collect email' },
      { status: 500 }
    );
  }
} 