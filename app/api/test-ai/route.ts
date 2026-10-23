import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test OpenRouter API with Deepseek model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3001",
        "X-Title": "CA Advisor Test",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "user", content: "Hello, say 'API is working!' if you can read this." }
        ],
        max_tokens: 50,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({ 
        error: "API Key validation failed", 
        status: response.status,
        statusText: response.statusText,
        details: errorData
      }, { status: 400 })
    }
    
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || "No response"
    
    return NextResponse.json({ 
      success: true, 
      message: "OpenRouter with Deepseek is working!",
      testResponse: content,
      model: "deepseek/deepseek-chat"
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to test API", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
