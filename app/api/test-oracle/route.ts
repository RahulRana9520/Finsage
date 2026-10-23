import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check Oracle environment variables
    const oracleConfig = {
      baseUrl: process.env.ORACLE_ORDS_BASE_URL,
      schema: process.env.ORACLE_ORDS_SCHEMA,
      auth: process.env.ORACLE_ORDS_AUTH,
    }

    if (!oracleConfig.baseUrl || !oracleConfig.schema) {
      return NextResponse.json({
        status: "Oracle not configured",
        message: "Oracle ORDS environment variables not set - using in-memory storage",
        usingInMemory: true,
        config: {
          hasBaseUrl: !!oracleConfig.baseUrl,
          hasSchema: !!oracleConfig.schema,
          hasAuth: !!oracleConfig.auth,
        }
      })
    }

    // Test Oracle connection
    try {
      const testUrl = `${oracleConfig.baseUrl}/${oracleConfig.schema}/`
      const response = await fetch(testUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(oracleConfig.auth ? { Authorization: oracleConfig.auth } : {}),
        },
      })

      return NextResponse.json({
        status: "Oracle configured",
        message: "Oracle ORDS connection test",
        connected: response.ok,
        responseStatus: response.status,
        config: {
          baseUrl: oracleConfig.baseUrl,
          schema: oracleConfig.schema,
          hasAuth: !!oracleConfig.auth,
        }
      })
    } catch (error) {
      return NextResponse.json({
        status: "Oracle connection failed",
        message: "Could not connect to Oracle ORDS",
        error: error instanceof Error ? error.message : "Unknown error",
        usingInMemory: true,
      })
    }

  } catch (error) {
    console.error("Oracle test error:", error)
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
