import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    try {
        console.log("Testing DB connection...");
        await connectDb();
        console.log("DB Connected. State:", mongoose.connection.readyState);

        try {
            const userCount = await User.countDocuments();
            return NextResponse.json({
                status: "success",
                message: "Connected to DB",
                userCount: userCount,
                connectionState: mongoose.connection.readyState,
                host: mongoose.connection.host
            }, { status: 200 });
        } catch (dbError: any) {
            console.error("Query Validation Error:", dbError);
            return NextResponse.json({
                status: "error",
                message: "Connected but query user failed",
                error: dbError.message
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Connection Error:", error);
        return NextResponse.json({
            status: "error",
            message: "Failed to connect to DB",
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
