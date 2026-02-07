import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import generateToken from '@/lib/token';

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const body = await req.json();
        const { email, password } = body;

        console.log("Signin attempt for:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return NextResponse.json({ message: "email doesn't exists!" }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user:", email);
            return NextResponse.json({ message: `incorrect password` }, { status: 400 });
        }

        console.log("User authenticated:", email);
        const token = generateToken(user._id.toString());

        const response = NextResponse.json(user, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        return response;

    } catch (error: any) {
        console.error("Signin error:", error);
        return NextResponse.json({ message: `login error ${error.message}` }, { status: 500 });
    }
}
