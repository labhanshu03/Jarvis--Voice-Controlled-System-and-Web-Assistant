"use client";
import React, { useContext, useRef, useState, useEffect } from 'react';
import { userDataContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RiImageAddLine } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import Card from '@/components/Card';

// Import images
import image1 from "@/assets/image1.png";
import image2 from "@/assets/image2.jpg";
import image3 from "@/assets/image3.png";
import image4 from "@/assets/image4.png";
import image5 from "@/assets/image5.png";
import image6 from "@/assets/image6.jpeg";
import image7 from "@/assets/image7.jpeg";

export default function Customize() {
    const context = useContext(userDataContext);
    const {
        serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage
    } = context || {
        selectedImage: null,
        setSelectedImage: () => { },
        setBackendImage: () => { },
        setFrontendImage: () => { },
        frontendImage: null
    };

    const inputImage = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files[0] + " jkl;j");
            const file = e.target.files[0];
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
            <IoMdArrowRoundBack
                onClick={() => router.push("/")}
                className='cursor-pointer absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] z-10'
            />

            <h1 className='text-white text-[30px] mb-[30px] text-center mt-12 lg:mt-0'>Select your <span className="text-blue-200 ">Assistant Image</span> </h1>

            <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />

                <div
                    className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4 cursor-pointer hover:border-white flex items-center justify-center relative ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
                    onClick={() => {
                        inputImage.current?.click();
                        setSelectedImage("input");
                    }}
                >
                    {!frontendImage && <RiImageAddLine className="text-white w-[25px] h-[25px] " />}
                    {frontendImage && (
                        <Image
                            src={frontendImage}
                            alt="Uploaded"
                            fill
                            className='object-cover'
                        />
                    )}
                </div>
            </div>

            <input
                type="file"
                accept="image/*"
                hidden
                ref={inputImage}
                onChange={handleImage}
            />

            {selectedImage && (
                <button
                    className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[20px] cursor-pointer"
                    onClick={() => router.push("/customize2")}
                >
                    Next
                </button>
            )}
        </div>
    )
}
