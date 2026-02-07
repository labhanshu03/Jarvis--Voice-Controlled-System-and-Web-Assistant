"use client";
import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoEyeSharp, IoEyeOff } from 'react-icons/io5';
import axios from 'axios';
import { userDataContext } from '@/context/UserContext';
import bg from '@/assets/authBg.png';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const context = useContext(userDataContext);

    // Fallback if context is null
    const { serverUrl, setUserData } = context || { serverUrl: '', setUserData: () => { } };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signin`, { name, email, password });
            console.log(result.data);
            setUserData(result.data);
            setLoading(false);
            router.push('/');
        } catch (error: any) {
            console.log(error);
            setErr(error.response?.data?.message || 'An error occurred');
            setLoading(false);
            setUserData(null);
        }
    };

    return (
        <div className='w-full h-screen bg-cover flex justify-center items-center relative'>
            <div className='absolute inset-0 -z-10'>
                <Image
                    src={bg}
                    alt='Background'
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            <form onSubmit={handleSignIn} className='w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]'>
                <h1 className='text-white text-[30px] font-semibold'>Sign In to <span className='text-blue-400'>Resume Optimizer</span></h1>

                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                    className='w-[80%] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
                />

                <div className='w-[80%] h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='password'
                        className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
                    />
                    {!showPassword && <IoEyeSharp className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' onClick={() => setShowPassword(true)} />}
                    {showPassword && <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' onClick={() => setShowPassword(false)} />}
                </div>
                {err.length > 0 && <p className='text-[17px] text-red-500'>{err}</p>}
                <button
                    className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px]'
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
                <div
                    className='text-white text-[18px] cursor-pointer'
                >
                    Want to create a new account? <Link href='/signup'><span className='text-blue-400'>Sign Up</span></Link>
                </div>
            </form>
        </div>
    );
}
