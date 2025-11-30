export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage.content

    // Use a simple session ID based on timestamp or pass from client
    const sessionId = req.headers.get("x-session-id") || `session-${Date.now()}`

    const n8nWebhookUrl = "https://paisly.app.n8n.cloud/webhook/4c05ff66-0e36-46c2-8a04-abf75ce093b1/chat"

    console.log("[v0] Sending to n8n:", { action: "sendMessage", sessionId, chatInput: userMessage })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000) // 55 seconds timeout

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: sessionId,
          chatInput: userMessage,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("[v0] n8n response status:", n8nResponse.status)

      if (!n8nResponse.ok) {
        const errorBody = await n8nResponse.text()
        console.error("[v0] n8n error body:", errorBody)
        throw new Error(`n8n webhook returned status ${n8nResponse.status}`)
      }

      const n8nData = await n8nResponse.json()
      console.log("[v0] n8n response data:", n8nData)

      const assistantMessage = n8nData.output || n8nData.response || n8nData.message || JSON.stringify(n8nData)

      const response = {
        role: "assistant",
        content: assistantMessage,
      }

      // Return response in the expected format
      return new Response(
        JSON.stringify({
          messages: [...messages, response],
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "x-session-id": sessionId, // Return sessionId for client to reuse
          },
        },
      )
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        throw new Error("Request timed out. The AI is taking longer than expected to respond.")
      }
      throw fetchError
    }
  } catch (error) {
    console.error("[v0] Chat error:", error)

    // Provide a user-friendly error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return new Response(
      JSON.stringify({
        error: "Failed to process chat message",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
