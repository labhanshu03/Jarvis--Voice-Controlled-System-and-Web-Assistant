import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/token';
import uploadOnCloudinary from '@/lib/cloudinary';

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

        const formData = await req.formData();
        const assistantName = formData.get('assistantName') as string;
        const imageUrl = formData.get('imageUrl') as string;
        const assistantImageFile = formData.get('assistantImage') as File | null;

        let assistantImage;

        if (assistantImageFile && assistantImageFile.size > 0) {
            const bytes = await assistantImageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await uploadOnCloudinary(buffer, assistantImageFile.name);
            if (uploadResult) {
                assistantImage = uploadResult;
            } else {
                return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
            }
        } else {
            assistantImage = imageUrl;
        }

        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { assistantName, assistantImage },
            { new: true }
        ).select("-password");

        return NextResponse.json(user, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: `update error ${error.message}` }, { status: 500 });
    }
}
