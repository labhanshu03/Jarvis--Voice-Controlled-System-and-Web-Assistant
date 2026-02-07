"use client";
import React, { useContext, useEffect, useState, useRef } from 'react';
import { userDataContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { BiMenuAltRight } from "react-icons/bi";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import Image from 'next/image';
import userImg from "@/assets/user.gif";
import aiImg from "@/assets/ai.gif";

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const context = useContext(userDataContext);
  const { userData, serverUrl, setUserData, getGeminiResponse } = context || {
    userData: null,
    serverUrl: '',
    setUserData: () => { },
    getGeminiResponse: async () => { }
  };

  const router = useRouter();
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const [ham, setHam] = useState(false);

  // Use state for synthesis to avoid SSR issues
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  const isRecognizingRef = useRef(false);
  const [aiText, setAiText] = useState("");
  const [userText, setUserText] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSynth(window.speechSynthesis);
    }
  }, []);

  // Auth check
  useEffect(() => {
    if (!context) return;

    if (!context.loading && !userData) {
      router.push("/signin");
    }
  }, [userData, context, router]);



  const handleLogOut = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      setUserData(null);
      router.push("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
      router.push("/signin");
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("recognition requested to start");
      } catch (error: any) {
        if (error.name !== "InvalidStateError") {
          console.log("start error", error);
        }
      }
    }
  }

  const speak1 = (text: string) => {
    if (!synth) return;
    const greeting = new SpeechSynthesisUtterance(text);
    greeting.lang = "hi-IN";
    synth.speak(greeting);
  }

  const speak = (text: string) => {
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    console.log(utterance);

    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      recognitionRef.current?.start();
      setTimeout(() => {
        startRecognition();
      }, 800);
    }

    synth.cancel();
    synth.speak(utterance);
  };

  const handlecommand = (data: any) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.location.href = `https://www.google.com/search?q=${query}`;
    }

    if (type === "calculator-open") {
      window.location.href = `https://www.google.com/search?q=calculator`;
    }

    if (type === "instagram-open") {
      window.location.href = "https://www.instagram.com/";
    }

    if (type === "facebook-open") {
      window.location.href = "https://www.facebook.com/";
    }

    if (type === "weather-show") {
      window.location.href = "https://www.google.com/search?q=weather";
    }

    if (type === "youtube-search" || type === "youtube-play") {
      if (userInput == "") {
        window.location.href = `https://www.youtube.com/`;
      } else {
        const query = encodeURIComponent(userInput);
        console.log("lasdaf");
        window.location.href = `https://www.youtube.com/results?search_query=${query}`;
      }
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;
    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e: any) {
          if (e.name !== "InvalidStateError") {
            console.log(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    }

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("recognition restarted");
            } catch (e: any) {
              if (e.name !== "InvalidStateError") {
                console.error(e);
              }
            }
          }
        }, 1000);
      }
    }

    recognition.onresult = async (e: any) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log(transcript);

      if (transcript?.toLowerCase().includes(userData?.assistantName?.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        console.log(data);
        handlecommand(data);
        setAiText(data.response);
        setUserText("");
      }
    }

    recognition.onerror = (event: any) => {
      console.warn("recognition error", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("recognition restarted after error");
            } catch (error: any) {
              if (error.name !== "InvalidStateError") console.error(error);
            }
          }
        }, 1000);
      }
    }

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    }

  }, [userData, getGeminiResponse]);



  if (!context || context.loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className='w-full h-screen bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden max-w-[100vw] relative'>
      <CgMenuRight onClick={() => setHam(true)} className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer z-50' />

      <div className={`fixed lg:hidden top-0 right-0 w-full h-full bg-[#00000099] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start transition-transform z-50 ${ham ? "translate-x-0" : "translate-x-full"}`}>
        <RxCross1 onClick={() => setHam(false)} className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' />
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer' onClick={handleLogOut}>Log Out</button>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer' onClick={() => router.push("/customize")}>Customize your Assistant</button>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer' onClick={() => router.push("/resume-optimization")}>Resume Optimization</button>
        <div className='w-full h-[2px] bg-gray-400'></div>

        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-[20px]'>
          {userData.history?.map((his: string, ind: number) => {
            return <span key={ind} className='text-gray-200 text-[18px] truncate'>{his}</span>
          })}
        </div>
      </div>

      <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] absolute hidden lg:block top-[20px] right-[20px] cursor-pointer' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] absolute hidden lg:block top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer' onClick={() => router.push("/customize")}>Customize your Assistant</button>
      <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] absolute hidden lg:block top-[180px] right-[20px] px-[20px] py-[10px] cursor-pointer' onClick={() => router.push("/resume-optimization")}>Resume Optimization</button>

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-[2rem] shadow-lg relative'>
        {userData?.assistantImage && <img src={userData.assistantImage} alt="" className="h-full object-cover" />}
      </div>

      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {!aiText && <div className="w-[200px] h-[200px] relative"><Image src={userImg} alt="User" fill className="object-contain" unoptimized /></div>}
      {aiText && <div className="w-[200px] h-[200px] relative"><Image src={aiImg} alt="AI" fill className="object-contain" unoptimized /></div>}

      <h1 className="text-white text-[18px] font-semibold text-wrap text-center max-w-[80%]">{userText ? userText : aiText ? aiText : null}</h1>
      <button className="min-w-[300px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] mt-[20px] cursor-pointer" onClick={() => speak1(`hi ${userData.name} how can i help you today`)}>Click to Start</button>
    </div>
  )
}
