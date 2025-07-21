import { type NextRequest, NextResponse } from "next/server"

// Utility function for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Retry function with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} for ${url}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout per attempt

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        console.log(`✅ Success on attempt ${attempt}`)
        return response
      }

      // If it's a server error (5xx), retry. If client error (4xx), don't retry
      if (response.status >= 500 && attempt < maxRetries) {
        console.log(`⚠️ Server error ${response.status}, retrying...`)
        await delay(1000 * attempt) // Exponential backoff
        continue
      }

      return response
    } catch (error) {
      lastError = error as Error
      console.error(`❌ Attempt ${attempt} failed:`, lastError.message)

      if (attempt < maxRetries) {
        await delay(1000 * attempt) // Exponential backoff
        continue
      }
    }
  }

  throw lastError!
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    console.log("🌐 Server-side fetching from:", url)

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "CareerMatch-AI/1.0",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`❌ Final HTTP Error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        {
          error: `HTTP Error: ${response.status}`,
          message: response.statusText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("✅ Successfully fetched data after retries")

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("⏰ All retry attempts timed out")
        return NextResponse.json(
          {
            error: "Request timeout",
            message: "The external API is not responding after multiple attempts",
          },
          { status: 408 },
        )
      }

      console.error("🔥 All retry attempts failed:", error.message)
      return NextResponse.json(
        {
          error: "Network error",
          message: `Failed after retries: ${error.message}`,
        },
        { status: 500 },
      )
    }

    console.error("💥 Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
