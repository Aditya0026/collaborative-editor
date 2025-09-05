import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages, selectedText } = await req.json()

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set")
      return Response.json(
        { error: "Google AI API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    console.log("[v0] Starting chat request with Google AI API key present:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

    const systemPrompt = `You are an AI assistant integrated into a collaborative text editor. You can:

1. Have normal conversations with users
2. Help improve and edit text
3. Provide suggestions and feedback
4. Search for information and provide summaries (simulated)

Be helpful, concise, and professional. When users ask for web searches or current information, provide helpful responses based on your training data.

${selectedText ? `The user has selected this text in the editor: "${selectedText}"` : ""}`

    const result = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages,
    })

    console.log("[v0] Chat request completed successfully")

    return Response.json({
      content: result.text,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return Response.json({ error: `Chat processing failed: ${errorMessage}` }, { status: 500 })
  }
}
