export type FormField = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};

export const formConfig: FormField[] = [
  { id: "name", label: "Full Name", type: "text", required: true },
  { id: "email", label: "Email Address", type: "email", required: true },
  { id: "dob", label: "Date of Birth", type: "date", required: true },
  {
    id: "gender",
    label: "Gender",
    type: "radio",
    required: true,
    options: ["Male", "Female", "Other"],
  },
  {
    id: "yearsOfExperience",
    label: "Years of Experience",
    type: "number",
    required: false,
  },
];

export const getFormSchemaProperties = () => {
  const extractionProperties: Record<string, { type: "string" }> = {};
  const fieldNames: string[] = [];
  const fieldDescriptionsArr: string[] = [];

  formConfig.forEach((field) => {
    extractionProperties[field.id] = { type: "string" };
    fieldNames.push(field.id);

    const requiredMarker = field.required ? " (required)" : "";
    
    if (field.type === "date") {
      fieldDescriptionsArr.push(`- ${field.id}: Must be formatted as YYYY-MM-DD (e.g., "2000-01-15").${requiredMarker}`);
    } else if (field.type === "number") {
      fieldDescriptionsArr.push(`- ${field.id}: Must be a whole number (integer) only (e.g., "5"). Do not use decimals or text like "five".${requiredMarker}`);
    } else if (field.type === "radio" || field.type === "select") {
      fieldDescriptionsArr.push(`- ${field.id}: ${field.label}. MUST be one of these exact values: [${field.options?.join(', ')}].${requiredMarker}`);
    } else if (field.type === "range") {
      fieldDescriptionsArr.push(`- ${field.id}: ${field.label}. Must be a number corresponding to the slider value.${requiredMarker}`);
    } else {
      fieldDescriptionsArr.push(`- ${field.id}: ${field.label}. Format normally, but do not invent data that is not explicitly provided by the user.${requiredMarker}`);
    }
  });

  return { extractionProperties, fieldNames, fieldDescriptions: fieldDescriptionsArr.join('\n') };
};