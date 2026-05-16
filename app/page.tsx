"use client";
import { useState, useEffect, useRef } from "react";
import { formConfig } from "./formConfig";
import { Form } from "../components/Form";
import {
  ChatSection,
  Message,
  SpeechRecognitionType,
  SpeechRecognitionEvent,
} from "../components/ChatSection";
import { DisplayResult } from "../components/DisplayResult";

const initialData = formConfig.reduce((acc: Record<string, string>, field) => {
  acc[field.id] = "";
  return acc;
}, {});
export default function Home() {
  const [formData, setFormData] = useState<Record<string, string>>(initialData);
  const [chatInput, setChatInput] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("Idle");
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    string
  > | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(
    null,
  );
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi there! Would you like to provide your details (${formConfig.map((f) => f.label).join(", ")}) all at once, or should we go step by step?`,
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize Web Speech API on client mount
  useEffect(() => {
    const speechRecognition =
      (
        window as unknown as {
          SpeechRecognition: new () => SpeechRecognitionType;
        }
      ).SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition: new () => SpeechRecognitionType;
        }
      ).webkitSpeechRecognition;
    if (speechRecognition) {
      const rec = new speechRecognition();
      rec.continuous = false;
      rec.lang = "en-US";

      rec.onstart = () => setVoiceStatus("Listening closely... 🎧");
      rec.onend = () => setVoiceStatus("Idle");
      rec.onerror = () => setVoiceStatus("Error recording.");

      rec.onresult = async (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        await sendToAIEngine(transcript);
      };

      setRecognition(rec);
    } else {
      setVoiceStatus("Voice not supported 🚫");
    }
  }, []);

  const sendToAIEngine = async (text: string) => {
    if (!text.trim()) return;

    setVoiceStatus("AI Analyzing... ⚡");
    setIsTyping(true);
    setChatInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/parse-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, currentData: formData }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      console.log("data from ai engine", data);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

      if (data.extractedData) {
        const updatedData: Record<string, string> = {};
        formConfig.forEach((f) => {
          updatedData[f.id] = data.extractedData[f.id] || "";
        });
        setFormData(updatedData);
      }
      setVoiceStatus("Filled successfully!");
    } catch (err: any) {
      console.error(err);
      setVoiceStatus("Failed to parse text.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "Sorry, I encountered an error. Could you try again?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleManualInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-6">
        {/* Left Side: Manual Form View */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800">Multi-Modal Form</h2>
          <p className="text-sm text-gray-500 mb-6">
            Fill manually, or use the conversational chat/voice mode.
          </p>

          <Form
            formConfig={formConfig}
            formData={formData}
            handleManualInput={handleManualInput}
            handleSubmit={handleSubmit}
          />

          <DisplayResult submittedData={submittedData} />
        </div>

        {/* Right Side: Chat View */}
        <ChatSection
          messages={messages}
          isTyping={isTyping}
          voiceStatus={voiceStatus}
          chatInput={chatInput}
          setChatInput={setChatInput}
          sendToAIEngine={sendToAIEngine}
          recognition={recognition}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  );
}
