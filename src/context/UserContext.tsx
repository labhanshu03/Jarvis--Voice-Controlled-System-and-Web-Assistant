"use client";
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface UserData {
    [key: string]: any;
}

interface UserContextType {
    serverUrl: string;
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
    frontendImage: any;
    setFrontendImage: React.Dispatch<React.SetStateAction<any>>;
    backendImage: any;
    setBackendImage: React.Dispatch<React.SetStateAction<any>>;
    selectedImage: any;
    setSelectedImage: React.Dispatch<React.SetStateAction<any>>;
    getGeminiResponse: (command: string) => Promise<any>;
    loading: boolean;
}

export const userDataContext = createContext<UserContextType | null>(null);

export default function UserContext({ children }: { children: ReactNode }) {
    const serverUrl = '';
    const [userData, setUserData] = useState<UserData | null>(null);
    const [frontendImage, setFrontendImage] = useState<any>(null);
    const [backendImage, setBackendImage] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`);
            setUserData(result.data);
            console.log(result.data);
        } catch (error: any) {
            // Ignore 400/401 errors which mean simply "not logged in"
            if (error.response && (error.response.status === 400 || error.response.status === 401)) {
                setUserData(null);
            } else {
                console.log("Error fetching current user:", error);
                setUserData(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const getGeminiResponse = async (command: string) => {
        try {
            console.log('isfasd');
            const result = await axios.post(`${serverUrl}/api/user/asktoAssistant`, { command });
            return result.data;
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        handleCurrentUser();
    }, []);

    const value: UserContextType = {
        serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse,
        loading
    };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
}
