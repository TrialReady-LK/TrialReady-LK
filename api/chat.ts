import type { IncomingMessage, ServerResponse } from 'http'

interface MessageItem {
  sender: string
  text: string
}

interface ChatRequestPayload {
  messages: MessageItem[]
  language?: 'en' | 'si' | 'ta'
  user_name?: string | null
  role?: string | null
}

const SYSTEM_INSTRUCTION = `You are the TrialReady AI Assistant (powered by Google Gemini), an expert driving instructor and Highway Code tutor for Sri Lanka driving school students.

Your primary focus is assisting students with:
1. Sri Lanka Highway Code & Traffic Regulations (speed limits, lane discipline, roundabouts, right-of-way, priority rules, expressway rules, warning, regulatory and informative road signs).
2. DMT Practical Driving Trial Maneuvers (Hill Start clutch biting point & handbrake control, Reverse S-Bend test reference points, Parallel Parking, 3-Point Turn, pre-drive checks, cabin drills).
3. Driving Theory Exam Preparation (mock question explanations, road safety principles, first aid, mechanical basics).
4. Student Academy Portal & Training (TrialReady readiness score, learner journey milestones, NTMI medical, DMT learner permit validity).
5. If a student asks general or everyday questions, answer accurately and politely while keeping suggestions and context focused on driving education.

Guidelines:
- If the user asks in English, respond in clear, well-structured English.
- If the user asks in Sinhala (සිංහල), respond fluently and naturally in Sinhala.
- If the user asks in Tamil (தமிழ்), respond fluently and naturally in Tamil.
- Format responses cleanly with markdown: use bold text, bullet points, numbered steps, or code blocks where appropriate.
- Maintain multi-turn conversation context when the student asks follow-up questions.
- Be encouraging, concise, accurate, and supportive.`

const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
]

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    res.status(200).json({ status: 'healthy', service: 'TrialReady Gemini AI Backend' })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    let body: ChatRequestPayload = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        body = { messages: [] }
      }
    }

    const messages = body?.messages || []
    const validMessages = messages.filter((m) => m && m.text && m.text.trim())

    if (validMessages.length === 0) {
      res.status(200).json({
        text: 'Please ask a question about Sri Lanka Highway Code, driving trials, road signs, or your learner journey!',
        status: 'empty_query',
        suggestions: [
          'What are the speed limits in Sri Lanka?',
          'How to do Hill Start without rollback?',
          'Tips for DMT Reverse S-Bend maneuver',
          'Explain mandatory vs warning road signs',
        ],
      })
      return
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      ''

    // Build Gemini contents array for multi-turn chat
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
    for (const msg of validMessages) {
      const role =
        msg.sender === 'user' || msg.sender === 'student' || msg.sender === 'human'
          ? 'user'
          : 'model'
      const text = msg.text.trim()

      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += '\n\n' + text
      } else {
        contents.push({
          role,
          parts: [{ text }],
        })
      }
    }

    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.pop()
    }

    if (contents.length === 0) {
      res.status(200).json({
        text: 'Please ask a question. I can help with math, programming, coursework, and driving education!',
        status: 'empty_query',
      })
      return
    }

    // Keep the most recent 16 turns to ensure rapid responses within token limits
    const trimmedContents =
      contents.length > 16 ? contents.slice(-16) : contents
    if (trimmedContents[0].role !== 'user') {
      trimmedContents.shift()
    }

    let personalizedSystem = SYSTEM_INSTRUCTION
    if (body.user_name) {
      personalizedSystem += `\nThe current user's name is ${body.user_name}.`
    }
    if (body.role) {
      personalizedSystem += ` Their role is ${body.role}.`
    }
    if (body.language === 'si') {
      personalizedSystem +=
        '\nPlease prefer responding in Sinhala (සිංහල) unless the user asks in English.'
    } else if (body.language === 'ta') {
      personalizedSystem +=
        '\nPlease prefer responding in Tamil (தமிழ்) unless the user asks in English.'
    }

    const payload = {
      system_instruction: {
        parts: [{ text: personalizedSystem }],
      },
      contents: trimmedContents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }

    let lastError = ''
    for (const model of GEMINI_MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          const data = (await response.json()) as any
          const candidate = data?.candidates?.[0]
          const parts = candidate?.content?.parts || []
          const replyText = parts
            .map((p: any) => p?.text || '')
            .join('')
            .trim()

          if (replyText) {
            res.status(200).json({
              text: replyText,
              status: 'success',
            })
            return
          }
        } else {
          const errText = await response.text()
          lastError = `HTTP ${response.status}: ${errText.slice(0, 150)}`
        }
      } catch (err: any) {
        lastError = err?.message || 'Network error'
      }
    }

    // If Gemini model calls failed, return friendly localized response
    let fallbackMessage =
      'I apologize, but I am having trouble connecting to Gemini right now. Please try asking your question again in a moment.'
    if (body.language === 'si') {
      fallbackMessage =
        'සමාවෙන්න, මේ මොහොතේ Gemini සේවාව හා සම්බන්ධ වීමේ තාක්ෂණික ගැටලුවක් පවතී. කරුණාකර මොහොතකින් නැවත උත්සාහ කරන්න.'
    } else if (body.language === 'ta') {
      fallbackMessage =
        'மன்னிக்கவும், தற்போது Gemini சேவையுடன் இணைப்பதில் சிக்கல் உள்ளது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.'
    }

    res.status(200).json({
      text: fallbackMessage,
      status: 'error',
      debug: lastError,
    })
  } catch (error: any) {
    res.status(500).json({
      text: 'An unexpected error occurred while processing your request.',
      status: 'server_error',
      error: error?.message,
    })
  }
}
