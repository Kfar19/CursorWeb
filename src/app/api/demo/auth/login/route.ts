import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Demo password - you can change this to whatever you want
const DEMO_PASSWORD = 'demo2025';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Validate password
    if (password === DEMO_PASSWORD) {
      // Create JWT token for demo access
      const token = jwt.sign(
        { 
          access: 'demo',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60) // 2 hours for demo
        },
        JWT_SECRET
      );

      return NextResponse.json({
        success: true,
        token,
        message: 'Demo access granted'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid demo password' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 