import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import generateToken from '@/lib/token';

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const body = await req.json();
        const { name, email, password } = body;

        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return NextResponse.json({ message: "email already exists!" }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters! " }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, password: hashedPassword, email
        });

        const token = generateToken(user._id.toString());

        const response = NextResponse.json(user, { status: 201 });

        response.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ message: `sign up error ${error.message}` }, { status: 500 });
    }
}
