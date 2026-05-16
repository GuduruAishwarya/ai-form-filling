# Multi-Modal AI Form Filler 🤖🎙️

🚀 **[Live Demo on Vercel](https://ai-form-filling.vercel.app/)**

A production-ready, highly dynamic Next.js application that allows users to fill out complex forms using **natural language chat** or **voice commands**.

Built with scalability in mind, the entire application—from the frontend UI to the AI's backend JSON Schema extraction logic—is driven by a single, central configuration file.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-teal)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-orange)

## ✨ Key Features

- **Conversational Form Filling**: Users can chat with the AI to provide their details step-by-step or all at once. The AI acts as a smart agent, retaining context and correcting previous data if the user changes their mind.
- **Voice Integration**: Native integration with the Web Speech API allows users to fill out the form entirely hands-free.
- **Bi-Directional State Sync**: Any data extracted by the AI instantly populates the manual form UI. Any manual edits to the form are automatically tracked and respected by the AI in future chat turns.
- **Config-Driven Architecture**: The form fields, types (text, email, select, radio, range, date), required flags, and AI extraction prompts are all automatically generated from a single `app/formConfig.ts` file.
- **Strict Structured AI Outputs**: Built using the OpenAI SDK mapped to the Gemini API, forcing the AI to strictly adhere to a dynamic JSON Schema so the app never breaks from hallucinated formats.
- **Production Grade Code**: Features a segregated component architecture, rigorous TypeScript typing (no `any` types), and elegant error handling (graceful fallbacks for unsupported browsers/APIs).

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js installed and an active Google Gemini API key.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd ai-form-filling
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Rename `env.example` to `.env` and add your Gemini API Key:

   ```env
   OPENAI_API_KEY=your_google_gemini_api_key_here
   ```

   _(Note: The app uses the `openai` SDK but points the `baseURL` to the Gemini API endpoint for maximum compatibility)._

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ How to Customize the Form

You do not need to touch the UI code or the Backend AI prompt code to change the form. Everything adapts automatically!

Simply open `app/formConfig.ts` and modify the array:

```typescript
export const formConfig: FormField[] = [
  { id: "name", label: "Full Name", type: "text", required: true },
  { id: "email", label: "Email Address", type: "email", required: true },
  {
    id: "experience",
    label: "Experience Level",
    type: "select",
    options: ["Junior", "Mid", "Senior"],
    required: false,
  },
];
```

Once saved:

1. The frontend immediately generates the correct `<input>` or `<select>` tags.
2. The AI backend immediately updates its JSON schema to strictly request and format these new fields.

## 🚢 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to GitHub.
2. Import the project in your Vercel Dashboard.
3. Add `OPENAI_API_KEY` in the Vercel Environment Variables settings.
4. Click Deploy!

## 💡 Why this architecture?

This project was built to demonstrate advanced patterns in modern web development:

- **Separation of Concerns**: UI components (`Form.tsx`, `ChatSection.tsx`, `DisplayResult.tsx`) are purely presentational and detached from the AI business logic.
- **Single Source of Truth**: `formConfig.ts` governs both the client-side rendering engine and the server-side LLM constraints.
- **Resilience**: The app gracefully handles AI hallucinations via Strict JSON Schema enforcement, and handles environment limitations (like missing microphone permissions or unsupported browsers) without crashing.
