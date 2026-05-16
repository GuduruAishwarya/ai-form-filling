import React from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export interface SpeechRecognitionType {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

export interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      }
    }
  };
}

interface ChatSectionProps {
  messages: Message[];
  isTyping: boolean;
  voiceStatus: string;
  chatInput: string;
  setChatInput: (val: string) => void;
  sendToAIEngine: (text: string) => void;
  recognition: SpeechRecognitionType | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatSection({
  messages,
  isTyping,
  voiceStatus,
  chatInput,
  setChatInput,
  sendToAIEngine,
  recognition,
  messagesEndRef,
}: ChatSectionProps) {
  return (
    <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-[600px]">
      <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-between">
        <span>Conversational Chat Mode</span>
        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {voiceStatus}
        </span>
      </h3>

      <div className="flex-1 overflow-y-auto mb-4 border border-gray-100 rounded-md p-4 space-y-4 bg-gray-50 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-500 rounded-lg rounded-bl-none p-3 shadow-sm text-sm flex gap-1 items-center h-10">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-col gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendToAIEngine(chatInput);
          }}
          className="flex gap-2"
        >
          <button
            type="button"
            disabled={!recognition}
            onClick={() => recognition && recognition.start()}
            className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-md transition duration-200 disabled:opacity-50"
            title="Speak to fill"
          >
            🎤
          </button>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-200 p-2 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isTyping || !chatInput.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 text-sm rounded-md transition duration-200 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
