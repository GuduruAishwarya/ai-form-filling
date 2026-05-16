import React from "react";
import { FormField } from "../app/formConfig";

interface FormProps {
  formConfig: FormField[];
  formData: Record<string, string>;
  handleManualInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function Form({
  formConfig,
  formData,
  handleManualInput,
  handleSubmit,
}: FormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex-1">
      {formConfig.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              id={field.id}
              value={formData[field.id] || ""}
              onChange={handleManualInput}
              required={field.required}
              className="w-full border border-gray-200 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            >
              <option value="" disabled>
                Select an option
              </option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "radio" ? (
            <div className="flex gap-4 mt-2">
              {field.options?.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    name={field.id}
                    id={field.id}
                    value={opt}
                    checked={formData[field.id] === opt}
                    onChange={handleManualInput}
                    required={field.required && !formData[field.id]}
                    className="focus:ring-blue-500"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ) : field.type === "range" ? (
            <div className="flex items-center gap-4">
              <input
                type="range"
                id={field.id}
                value={formData[field.id] || 0}
                onChange={handleManualInput}
                required={field.required}
                className="w-full accent-blue-500"
              />
              <span className="text-sm font-semibold text-gray-600 w-12">
                {formData[field.id] || 0}
              </span>
            </div>
          ) : (
            <input
              type={field.type}
              id={field.id}
              value={formData[field.id] || ""}
              onChange={handleManualInput}
              required={field.required}
              className="w-full border border-gray-200 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          )}
        </div>
      ))}
      <div className="pt-4 mt-auto">
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-md transition duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
