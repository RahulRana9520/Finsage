import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Simple test response
    return NextResponse.json({ 
      content: `Hello! You said: "${message}". I'm a CA advisor and I'm working properly now!` 
    })

  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ 
      error: "Failed to process chat request", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
