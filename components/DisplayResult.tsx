import React from "react";

interface DisplayResultProps {
  submittedData: Record<string, string> | null;
}

export function DisplayResult({ submittedData }: DisplayResultProps) {
  if (!submittedData) return null;

  return (
    <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
      <h4 className="text-sm font-bold text-green-800 mb-2">
        🎉 Form Details Compiled Successfully:
      </h4>
      <pre className="bg-gray-800 text-white text-xs p-3 rounded-md overflow-x-auto">
        {JSON.stringify(submittedData, null, 2)}
      </pre>
    </div>
  );
}
