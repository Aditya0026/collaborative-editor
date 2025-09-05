import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { text, action } = await req.json()

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set")
      return Response.json(
        { error: "Google AI API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    console.log("[v0] Starting edit request with Google AI API key present:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

    const prompts = {
      edit: `Please improve and edit this text while maintaining its core meaning. Make it more clear, concise, and engaging: "${text}"`,
      improve: `Please enhance this text by improving its vocabulary, flow, and overall quality while keeping the same message: "${text}"`,
      shorten: `Please make this text more concise while preserving all important information: "${text}"`,
      expand: `Please expand on this text with more detail and context: "${text}"`,
      professional: `Please rewrite this text in a more professional tone: "${text}"`,
      casual: `Please rewrite this text in a more casual, friendly tone: "${text}"`,
    }

    const prompt = prompts[action as keyof typeof prompts] || prompts.edit

    const result = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
      temperature: 0.7,
    })

    console.log("[v0] Edit request completed successfully")

    return Response.json({
      suggestion: result.text,
    })
  } catch (error) {
    console.error("Edit API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return Response.json({ error: `Edit processing failed: ${errorMessage}` }, { status: 500 })
  }
}
