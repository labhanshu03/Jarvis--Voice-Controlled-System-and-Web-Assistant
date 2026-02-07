import axios from "axios";

export const geminiResponse = async (command: string, assistantName: string, userName: string) => {
    try {
        const apiUrl = process.env.GEMINI_API_KEY;
        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. 
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month"|"calculator-open" | "instagram-open" |"facebook-open" |"weather-show"
  ,
  "userInput": "<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,

  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userinput": original sentence the user spoke.
- "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki category me rakho bas short answer dena
- "google-search": if user wants to search something on Google .
- "youtube-search": if user wants to search something on YouTube.
- "youtube-play": if user wants to directly play a video or song.
- "calculator-open": if user wants to  open a calculator .
- "instagram-open": if user wants to  open instagram .
- "facebook-open": if user wants to open facebook.
-"weather-show": if user wants to know weather
- "get-time": if user asks for current time.
- "get-date": if user asks for today's date.
- "get-day": if user asks what day it is.
- "get-month": if user asks for the current month.

Important:
- Use ${userName} agar koi puche tume kisne banaya 
- Only respond with the JSON object, nothing else.
- if someone asks you about weather, directly in response give weather details without telling "showing you the weather" or something like here is your answer
- if someone tolds you to open youtube but not have given what to open on it  then  give it type ="youtube-play and make userInput an empty string"

now your userInput- ${command}
`;

        const result = await axios.post(apiUrl!, {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        });

        console.log(result.data.candidates[0].content.parts[0].text + " this is the result in gemini.js");
        return result.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.log(error);
        return null; // Return null on error
    }
}

// Optimize resume content only
export const optimizeResumeContent = async (jobDescription: string, resume: string) => {
    try {
        const apiUrl = process.env.GEMINI_API_KEY;
        const prompt = `Context: I am providing: 1) My current resume in Overleaf (LaTeX) code 2) A target Job Description (JD) Your task is to optimize my resume for ATS .You are an expert resume optimizer. Return ONLY the complete LaTeX code. you can take maximum of 1 minute 15 seconds to do it

Requirements:
- make sure the ats score is above 70%
- Incorporate job-specific keywords, skills, tech words naturally, along with all the keywords
- Use industry-standard terminology
- You can't add to number of lines in the resume
- Concise, impact-focused bullets
- if some word mean the same but written differently change them to the ones in the jd naturally
- Align resume language with the JD using ATS-friendly keywords - Prefer integration, backend, API,server side scripting  and workflow wording when relevant 
- Update position title  if specified in job description exactly

Return the complete, valid Overleaf LaTeX code.

Job: ${jobDescription}
Resume: ${resume}`;

        const result = await axios.post(apiUrl!, {
            "contents": [{
                "parts": [{ "text": prompt }]
            }]
        });

        const response = result.data.candidates[0].content.parts[0].text;
        console.log("Resume raw response length:", response.length);

        // Clean up the response - remove any markdown code blocks if present
        let cleanedResponse = response;
        if (response.includes('```')) {
            const codeBlockMatch = response.match(/```[\s\S]*?\n([\s\S]*?)\n```/);
            if (codeBlockMatch) {
                cleanedResponse = codeBlockMatch[1];
            }
        }

        return cleanedResponse.trim();
    } catch (error) {
        console.log("Error in optimizeResumeContent:", error);
        throw error;
    }
};

// Generate interview questions only
export const generateInterviewQuestions = async (jobDescription: string, resume: string) => {
    try {
        const apiUrl = process.env.GEMINI_API_KEY;
        const prompt = `Generate 3-4 interview questions and brief answers based on this job and resume.

Return ONLY a JSON array in this exact format:
[{"question": "Question text", "answer": "Detailed answer (2-4 paragraphs)"}]

Focus on behavioral/situational questions. Use actual resume experience only.

Job: ${jobDescription.substring(0, 1500)}
Resume: ${resume.substring(0, 2000)}`;

        const result = await axios.post(apiUrl!, {
            "contents": [{
                "parts": [{ "text": prompt }]
            }]
        });

        const response = result.data.candidates[0].content.parts[0].text;
        console.log("Questions raw response:", response);

        // Try to extract JSON from the response
        let questions;
        try {
            // First try direct parsing
            questions = JSON.parse(response);
        } catch (parseError) {
            // If direct parsing fails, try to extract JSON from text
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not parse questions JSON from response");
            }
        }

        return questions;
    } catch (error) {
        console.log("Error in generateInterviewQuestions:", error);
        throw error;
    }
};

// Main function that orchestrates both calls
export const optimizeResumeWithGemini = async (jobDescription: string, resume: string) => {
    try {
        console.log("Starting parallel processing...");

        // Run both API calls in parallel
        const [optimizedResume, questions] = await Promise.all([
            optimizeResumeContent(jobDescription, resume),
            generateInterviewQuestions(jobDescription, resume)
        ]);

        console.log("Parallel processing completed");

        return JSON.stringify({
            optimizedResume: optimizedResume.trim(),
            questions: questions
        });

    } catch (error) {
        console.log("Error in optimizeResumeWithGemini:", error);
        throw error;
    }
}
