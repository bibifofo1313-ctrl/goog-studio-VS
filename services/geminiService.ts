
import { GoogleGenAI } from "@google/genai";
import { OnboardingData } from "../types";

export const getSmartAuditStream = async (data: OnboardingData, onChunk: (text: string) => void) => {
  try {
    // Initializing with the mandatory named parameter apiKey.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Act as a Senior ESG Consultant specialized in 2026 sustainability standards.
      Analyze the following company data and provide a concise, professional executive summary (max 300 words).
      Include specific, actionable insights on energy efficiency, waste management, and supply chain sourcing.
      
      Company Data:
      - Company: ${data.companyName}
      - Industry: ${data.industry}
      - Location: ${data.location}
      - Monthly Energy: ${data.monthlyKWh} kWh
      - Monthly Waste: ${data.wasteVolume} kg
      - Fleet: ${data.fleetType}
      - Sustainable Materials: ${data.sustainableMaterials}%
      - Revenue: $${data.annualRevenue}
      
      Format with professional Markdown headings. Use a tone that is expert, encouraging, and serious.
    `;

    // Using gemini-3-flash-preview for basic text analysis tasks.
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    let fullText = "";
    // Iterating directly over the response object which is an async iterator of chunks.
    for await (const chunk of response) {
      // Accessing the .text property directly (not a method).
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    onChunk("Error generating live audit. Please check your connection.");
  }
};
