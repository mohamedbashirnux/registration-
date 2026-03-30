import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Check if username already exists
    const existingUser = await User.findOne({ username: body.username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }
    
    const user = new User(body);
    await user.save();
    
    const userResponse: any = user.toObject();
    delete userResponse.password;
    
    return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await User.deleteMany({});
    return NextResponse.json({ success: true, message: 'All users deleted' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete users' },
      { status: 500 }
    );
  }
}
