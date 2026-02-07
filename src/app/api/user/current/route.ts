import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/token';

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 400 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 400 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "get current user error" }, { status: 400 });
    }
}
