import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  // Use process.env.GEMINI_API_KEY directly as per guidelines.
  // We assume the environment variable is pre-configured and valid.
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export const generateInstituteSummary = async (
  stats: { totalStudents: number; totalBatches: number; attendanceRate: number }
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Act as an educational consultant.
      Analyze the following institute data:
      - Total Students: ${stats.totalStudents}
      - Active Batches: ${stats.totalBatches}
      - Average Attendance Rate: ${stats.attendanceRate}%
      
      Provide a 2-sentence executive summary of the institute's health and one actionable recommendation for improvement.
      Do not use markdown formatting. Keep it professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI insights are currently unavailable. Please check your API configuration.";
  }
};

export const generateTaskFeedback = async (
  taskTitle: string,
  studentName: string,
  grade: number
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Write a short, encouraging feedback comment for a student named ${studentName} 
      who scored ${grade}/100 on the task "${taskTitle}".
      If the score is below 70, offer a constructive tip. If above 90, praise their excellence.
      Keep it under 30 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Good job.";
  } catch (error) {
    return "Feedback generated manually: Good effort.";
  }
};

export const generateLearningContent = async (
  topic: string,
  targetAudience: string,
  format: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Act as an expert technical trainer.
      Generate learning content about "${topic}".
      Target Audience: ${targetAudience}
      Format: ${format} (e.g., Lesson Plan, Quiz, Summary, Code Example)
      
      Provide a well-structured, engaging, and accurate response. Use markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI content generation is currently unavailable. Please check your API configuration.";
  }
};

export const analyzeStudentProgress = async (
  studentName: string,
  submissions: any[]
): Promise<string> => {
  try {
    const ai = getAiClient();
    const dataStr = JSON.stringify(submissions.map(s => ({ task: s.task, grade: s.grade, status: s.status })));
    const prompt = `
      Act as an educational data analyst.
      Analyze the following assignment submission data for student "${studentName}":
      ${dataStr}
      
      Provide a brief (3-4 sentences) summary of their progress, highlighting strengths, areas for improvement, and a recommendation for the trainer.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
    });

    return response.text || "Unable to analyze progress.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI analysis is currently unavailable.";
  }
};