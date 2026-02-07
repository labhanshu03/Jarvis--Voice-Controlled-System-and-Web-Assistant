import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json({ message: "logout Successfull" }, { status: 200 });

        response.cookies.set('token', '', {
            httpOnly: true,
            maxAge: 0,
            path: '/'
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ message: `logout error ${error.message}` }, { status: 500 });
    }
}
