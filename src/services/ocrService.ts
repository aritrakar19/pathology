// ocrService.ts

// The API key is read from the environment variables injected by Vite
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn("Groq API key is missing. Please check your .env configuration.");
}

/**
 * Converts a File object to a base64 string.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // The result is something like "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      // We need to pass the URL exactly as is for OpenAI compatible vision APIs
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Initializes the OCR / AI reading service.
 * The API key is securely passed to the Groq client or REST API call.
 */
export const extractPrescriptionData = async (imageFile: File) => {
  if (!GROQ_API_KEY) {
    throw new Error("OCR Service is not configured. Missing API key.");
  }

  try {
    const base64Image = await fileToBase64(imageFile);

    const prompt = `You are a medical AI assistant. Analyze the provided prescription image and extract the following details. Return the result STRICTLY as a valid JSON object without markdown wrappers or extra text.

{
  "medicines": [
    {
      "name": "Medicine Name",
      "dosage": "Dosage (e.g. 500mg)",
      "frequency": "Frequency (e.g. 1-0-1)",
      "duration": "Duration (e.g. 5 days)"
    }
  ],
  "tests": ["Test 1", "Test 2"],
  "doctorName": "Doctor's Name",
  "hospitalClinic": "Hospital or Clinic Name",
  "diagnosis": "Any diagnosis or symptoms mentioned",
  "notes": "Any other advice or notes",
  "confidence": 0.95 // Rate your confidence from 0 to 1 based on readability
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from AI.");
    }
    
    // Attempt to parse JSON
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error("OCR Extraction Failed:", error);
    throw error;
  }
};
