import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("=== Clean Chat API ===")
  
  try {
    const body = await req.json()
    const { message } = body
    
    console.log("Received message:", message)
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    console.log("API key status:", apiKey ? "found" : "missing")
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "API key not configured" 
      }, { status: 500 })
    }

    console.log("Making OpenRouter API call...")

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CA Advisor",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful Chartered Accountant advisor for Indian residents." 
          },
          { role: "user", content: message }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    console.log("OpenRouter response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenRouter API Error:", response.status, errorText)
      return NextResponse.json({
        error: "API request failed",
        details: errorText
      }, { status: 500 })
    }

    const data = await response.json()
    const responseText = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

    return NextResponse.json({ 
      content: responseText
    })

  } catch (error) {
    console.error("Chat Error:", error)
    return NextResponse.json({ 
      error: "Failed to process request"
    }, { status: 500 })
  }
}
