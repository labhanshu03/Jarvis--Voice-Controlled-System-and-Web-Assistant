"use client";
import React, { useState, useContext, useEffect } from 'react';
import { userDataContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Customize2() {
    const context = useContext(userDataContext);
    const { serverUrl, userData, backendImage, selectedImage, setUserData } = context || {
        serverUrl: '',
        userData: null,
        backendImage: null,
        selectedImage: null,
        setUserData: () => { }
    };

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [assistantName, setAssistantName] = useState("");

    useEffect(() => {
        if (userData?.assistantName) {
            setAssistantName(userData.assistantName);
        }
    }, [userData]);

    const handleUpdateAssistant = async () => {
        setLoading(true);

        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);

            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else if (typeof selectedImage === 'string') {
                // Logic for static images - might differ if selectedImage is an imported object from next/image
                // In Customize.tsx, we pass imported images. 
                // If selectedImage is an object (Next.js image import), we might need to handle it.
                // The backend likely expects a URL string or a file.
                // If it's a static import, we might need its .src property.
                // let's check what 'selectedImage' actually is.
                // In Card.tsx, we set it to the checked image.
                // If it's a static import, it has a .src property.
                const imageUrl = (selectedImage as any).src || selectedImage;
                formData.append("imageUrl", imageUrl);
            } else if (selectedImage && (selectedImage as any).src) {
                formData.append("imageUrl", (selectedImage as any).src);
            } else {
                // Fallback
                formData.append("imageUrl", selectedImage);
            }

            const result = await axios.post(`${serverUrl}/api/user/update`, formData);
            console.log(result.data);
            setUserData(result.data);
            setLoading(false);
            router.push("/");
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <div className='w-full h-screen bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
            <IoMdArrowRoundBack
                onClick={() => router.push("/customize")}
                className='cursor-pointer absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]'
            />
            <h1 className='text-white mb-[40px] text-[30px] text-center'>Enter your <span className='text-blue-200' >Assistant Name</span></h1>

            <input
                type="text"
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                placeholder='eg. shifra'
                className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
            />

            {assistantName && (
                <button
                    className="min-w-[300px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[20px] cursor-pointer"
                    disabled={loading}
                    onClick={handleUpdateAssistant}
                >
                    {!loading ? "Finally create your assistant" : "Loading..."}
                </button>
            )}
        </div>
    )
}
