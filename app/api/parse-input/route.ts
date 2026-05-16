import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getFormSchemaProperties, formConfig } from "../../formConfig";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(req: Request) {
  try {
    const { messages, currentData } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }
    // get field data from formconfig
    const { extractionProperties, fieldNames, fieldDescriptions } =
      getFormSchemaProperties();
    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant helping a user fill out an application form. 
If the user provides a date or time, format it appropriately for an HTML input field.
The fields we need to collect are:
${fieldDescriptions}

Current known form data: ${JSON.stringify(currentData || {})}

Your goal is to collect this information. You can ask for them one by one or all at once.
Always be polite and conversational.
You must always respond with a JSON object containing:
- 'reply': Your conversational response to the user.
- 'extractedData': An object with keys: ${fieldNames.join(", ")}. This MUST represent the complete, updated form data. If a field is known (either from the current data or newly provided), include it. If the user explicitly changes a value, update it to the new value. If a field is still completely unknown, set it to an empty string "".`,
        },
        ...messages,
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "form_extraction",
          schema: {
            type: "object",
            properties: {
              reply: { type: "string" },
              extractedData: {
                type: "object",
                properties: extractionProperties,
                required: fieldNames,
                additionalProperties: false,
              },
            },
            required: ["reply", "extractedData"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content from AI");
    const extractedData = JSON.parse(content);
    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("AI Processing Error:", error);
    return NextResponse.json(
      { error: "Failed to process data with AI" },
      { status: 500 },
    );
  }
}
