# Voice-Controlled System & Web Assistant

A powerful, Voice-Controlled System & Web Assistant application migrated from a MERN stack to a modern **Next.js (App Router)** architecture. This application integrates Google's Gemini AI for intelligent conversations, resume optimization, and various voice-controlled commands.

## 🚀 Features

*   **🎙️ Voice Interaction:**
    *   **Speech-to-Text:** Listens to your voice commands using the Web Speech API.
    *   **Text-to-Speech:** Responds vocally with a natural Hindi/English accent.
    *   **Wake Word:** Activates when you say the assistant's name.
*   **🤖 AI Intelligence:**
    *   Powered by **Google Gemini AI**.
    *   Conversational capabilities for general queries.
    *   Context-aware responses.
*   **📄 Resume Optimization:**
    *   Upload your resume (PDF/Image) and job description.
    *   Get AI-powered analysis and optimization suggestions.
    *   ATS compatibility checks.
*   **🎨 Customization:**
    *   **Assistant Identity:** Rename your assistant.
    *   **Visual Avatar:** Upload and set a custom image/avatar for your assistant.
*   **🛠️ Tools & Commands:**
    *   Open websites (Google, YouTube, Instagram, Facebook).
    *   Perform Google searches directly via voice.
    *   Open Calculator, Weather, etc.
*   **🔐 Authentication:**
    *   Secure generic Sign Up / Sign In.
    *   JWT-based session management (HTTP-Only cookies).

## 🛠️ Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
*   **AI Model:** [Google Gemini API](https://ai.google.dev/)
*   **Image Storage:** [Cloudinary](https://cloudinary.com/)
*   **State Management:** React Context API

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URL="your_mongodb_connection_string"

# Authentication
JWT_SECRET="your_jwt_secret_key"

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key"

# API Configuration
NEXT_PUBLIC_API_URL="/api"
```

## 🏃‍♂️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
    cd REPO_NAME
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Copy the variables above into a `.env` file.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages & API routes
│   ├── (auth)/          # Authentication pages (Signin/Signup)
│   ├── api/             # Backend API routes (Serverless functions)
│   ├── customize/       # Assistant customization pages
│   └── page.tsx         # Main Dashboard (Voice Interface)
├── components/          # Reusable UI components
├── context/             # React Context (User State)
├── lib/                 # Utilities (DB connection, Gemini, Token, Cloudinary)
└── models/              # Mongoose Database Models
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is open-source and available for personal and educational use.
