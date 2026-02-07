"use client";
import React, { useContext } from 'react';
import { userDataContext } from '@/context/UserContext';
import Image from 'next/image';

interface CardProps {
    image: any; // Can be StaticImageData or string
}

export default function Card({ image }: CardProps) {
    const context = useContext(userDataContext);
    const {
        serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage
    } = context || { selectedImage: null, setSelectedImage: () => { }, setBackendImage: () => { }, setFrontendImage: () => { } };

    return (
        <div
            className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4 cursor-pointer hover:border-white relative ${selectedImage === image ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
            onClick={() => {
                setSelectedImage(image);
                setBackendImage(null);
                setFrontendImage(null);
            }}
        >
            <Image
                src={image}
                alt="Assistant Avatar"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 70px, 150px"
            />
        </div>
    )
}
