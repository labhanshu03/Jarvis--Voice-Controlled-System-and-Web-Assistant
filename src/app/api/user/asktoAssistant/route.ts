import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/token';
import { geminiResponse } from '@/lib/gemini';
import moment from 'moment';

export async function POST(req: NextRequest) {
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

        const body = await req.json();
        const { command } = body;

        const user = await User.findById(decoded.userId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        user.history.push(command);
        await user.save();

        const userName = user.name;
        const assistantName = user.assistantName;

        const result = await geminiResponse(command, assistantName, userName);

        if (!result) {
            return NextResponse.json({ response: "AI Service Unavailable" }, { status: 503 });
        }

        const jsonMatch = result.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            return NextResponse.json({ response: "sorry i don't understand" }, { status: 400 });
        }

        const gemResult = JSON.parse(jsonMatch[0]);
        const type = gemResult.type;

        switch (type) {
            case "get-date":
                return NextResponse.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });
            case "get-time":
                return NextResponse.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current time is ${moment().format("hh:mmA")}`
                });
            case "get-day":
                return NextResponse.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("dddd")}`
                });
            case "get-month":
                return NextResponse.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("MMMM")}`
                });
            case "google-search":
            case "youtube-play":
            case "general":
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
            case "youtube-search":
                return NextResponse.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response
                });
            default:
                return NextResponse.json({ response: "I didn't understand that command" }, { status: 400 });
        }

    } catch (error: any) {
        return NextResponse.json({ response: "ask assistant error" }, { status: 500 });
    }
}
