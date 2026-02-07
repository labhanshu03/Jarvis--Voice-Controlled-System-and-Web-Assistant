"use client";
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { userDataContext } from '@/context/UserContext';

// Define structure for question/answer
interface QuestionAnswer {
    question: string;
    answer: string;
}

// Component for QuestionAnswerCard
function QuestionAnswerCard({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className='bg-white/5 rounded-lg p-4 border border-white/20'>
            <div
                className='flex justify-between items-center cursor-pointer'
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className='text-white font-medium text-lg'>
                    {index}. {question}
                </h3>
                <span className='text-white text-xl'>
                    {isExpanded ? '−' : '+'}
                </span>
            </div>

            {isExpanded && (
                <div className='mt-4 pt-4 border-t border-white/20'>
                    <p className='text-gray-200 leading-relaxed whitespace-pre-wrap'>
                        {answer}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function ResumeOptimization() {
    const context = useContext(userDataContext);
    const { userData, serverUrl, setUserData } = context || { userData: null, serverUrl: '', setUserData: () => { } };

    const router = useRouter();
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ optimizedResume: string; questions: QuestionAnswer[] } | null>(null);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(70);
    const [showTimer, setShowTimer] = useState(false);

    // Protected route check
    useEffect(() => {
        // If context isn't loaded yet, this might flash. 
        // In a real app, should handle loading state of auth.
        // For now, assuming if userData is null after initial load, redirect.
        // Using a timeout to allow context to load is one way, or better, 
        // add loading state to context.
    }, [userData, router]);

    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/logout`, {});
            setUserData(null);
            router.push('/signin');
        } catch (error) {
            console.error('Logout error:', error);
            setUserData(null);
            router.push('/signin');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        setShowTimer(true);
        setTimer(70);

        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setShowTimer(false);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return interval;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!jobDescription.trim() || !resume.trim()) {
            setError('Both job description and resume are required');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        const timerInterval = startTimer();

        try {
            const response = await axios.post(
                `${serverUrl}/api/user/optimize-resume`,
                {
                    jobDescription: jobDescription.trim(),
                    resume: resume.trim()
                },
                { withCredentials: false }
            );

            setResult(response.data);
        } catch (error: any) {
            console.error('Error optimizing resume:', error);
            setError(error.response?.data?.message || 'Error optimizing resume. Please try again.');
        } finally {
            setLoading(false);
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            setShowTimer(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-t from-[black] to-[#02023d] p-4'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-white text-3xl font-bold'>Optimize your Resume according to Job Description</h1>
                    <button
                        onClick={handleLogout}
                        className='px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors'
                    >
                        Logout
                    </button>
                </div>

                <div className='grid md:grid-cols-2 gap-6 mb-8'>
                    <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
                        <h2 className='text-white text-xl font-semibold mb-4'>Job Description</h2>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder='Paste the job description here...'
                            className='w-full h-64 p-4 rounded-lg bg-white text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
                        <h2 className='text-white text-xl font-semibold mb-4'>Resume (Overleaf Code)</h2>
                        <textarea
                            value={resume}
                            onChange={(e) => setResume(e.target.value)}
                            placeholder='Paste your resume Overleaf LaTeX code here...'
                            className='w-full h-64 p-4 rounded-lg bg-white text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                </div>

                <div className='text-center mb-8'>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors text-lg'
                    >
                        {loading ? 'Optimizing Resume...' : 'Optimize Resume'}
                    </button>

                    {showTimer && (
                        <div className='mt-4'>
                            <div className='inline-flex items-center px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full'>
                                <div className='w-4 h-4 bg-yellow-500 rounded-full mr-2 animate-pulse'></div>
                                <span className='text-yellow-800 font-semibold text-lg'>
                                    Optimizing... {formatTime(timer)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className='bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-8'>
                        {error}
                    </div>
                )}

                {result && (
                    <div className='space-y-6'>
                        <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-white text-2xl font-semibold'>Optimized Resume Code</h2>
                                <button
                                    onClick={() => copyToClipboard(result.optimizedResume)}
                                    className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                                >
                                    Copy Code
                                </button>
                            </div>
                            <pre className='bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap'>
                                {result.optimizedResume}
                            </pre>
                        </div>

                        <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
                            <h2 className='text-white text-2xl font-semibold mb-4'>Expected Interview Questions & Answers</h2>
                            <div className='space-y-4'>
                                {result.questions.map((item, index) => (
                                    <QuestionAnswerCard
                                        key={index}
                                        question={item.question}
                                        answer={item.answer}
                                        index={index + 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
