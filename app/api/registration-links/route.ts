import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RegistrationLink from '@/lib/models/RegistrationLink';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { seminarId } = await request.json();
    
    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const link = new RegistrationLink({
      seminarId,
      token,
      expiresAt
    });
    
    await link.save();
    
    return NextResponse.json({ success: true, data: link }, { status: 201 });
  } catch (error) {
    console.error('Error creating registration link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create registration link' },
      { status: 500 }
    );
  }
}