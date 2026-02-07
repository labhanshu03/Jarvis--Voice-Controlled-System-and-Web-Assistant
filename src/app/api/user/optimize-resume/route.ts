import { NextRequest, NextResponse } from 'next/server';
import { optimizeResumeWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { jobDescription, resume } = body;

        if (!jobDescription || !resume) {
            return NextResponse.json({
                message: "Both job description and resume are required"
            }, { status: 400 });
        }

        const result = await optimizeResumeWithGemini(jobDescription, resume);

        // Parse the JSON string result
        let gemResult;
        try {
            gemResult = JSON.parse(result);
        } catch (parseError) {
            return NextResponse.json({
                message: "Failed to parse Gemini response"
            }, { status: 400 });
        }

        return NextResponse.json({
            optimizedResume: gemResult.optimizedResume,
            questions: gemResult.questions
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "Error optimizing resume"
        }, { status: 500 });
    }
}
