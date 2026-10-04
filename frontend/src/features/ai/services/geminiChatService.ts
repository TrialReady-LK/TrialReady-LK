import type { TheoryLanguage } from '../../theory/types/theory'

export interface ChatMessagePayload {
  sender: 'user' | 'ai'
  text: string
}

export interface ChatRequestOptions {
  language?: TheoryLanguage
  userName?: string | null
  role?: string | null
}

export interface ChatResponsePayload {
  text: string
  status: string
  suggestions?: string[]
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://127.0.0.1:8000'

export async function sendGeminiChatMessage(
  messages: ChatMessagePayload[],
  options?: ChatRequestOptions
): Promise<ChatResponsePayload> {
  const payload = {
    messages: messages.map((m) => ({
      sender: m.sender,
      text: m.text,
    })),
    language: options?.language || 'en',
    user_name: options?.userName || null,
    role: options?.role || null,
  }

  // Try direct backend API URL first, fallback to relative /api/chat
  const endpoints = [
    API_BASE_URL ? `${API_BASE_URL}/api/chat` : '/api/chat',
    '/api/chat',
    'http://127.0.0.1:8000/api/chat',
    'http://localhost:8000/api/chat',
  ]

  // Remove duplicates
  const uniqueEndpoints = Array.from(new Set(endpoints.filter(Boolean)))

  for (const endpoint of uniqueEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data: ChatResponsePayload = await response.json()
        return data
      }
    } catch {
      // Continue to next endpoint attempt
    }
  }

  // Fallback if all endpoints failed
  const lang = options?.language || 'en'
  let fallbackMessage =
    '⚠️ Could not connect to the Gemini AI server. Please make sure the backend server is running on port 8000.'

  if (lang === 'si') {
    fallbackMessage =
      '⚠️ Gemini AI සේවාදායකය හා සම්බන්ධ වීමට නොහැකි විය. කරුණාකර පසුපස සේවාදායකය (Backend) ක්‍රියාත්මක දැයි පරීක්ෂා කරන්න.'
  } else if (lang === 'ta') {
    fallbackMessage =
      '⚠️ Gemini AI சேவையகத்துடன் இணைக்க முடியவில்லை. பின்தள சேவையகம் (Backend) இயங்குகிறதா என்பதை உறுதிப்படுத்தவும்.'
  }

  return {
    text: fallbackMessage,
    status: 'network_error',
    suggestions: [
      'Solve 2x + 5 = 15',
      'Write a Python function',
      'Highway Code rules in Sri Lanka',
      'Hill Start tips',
    ],
  }
}
