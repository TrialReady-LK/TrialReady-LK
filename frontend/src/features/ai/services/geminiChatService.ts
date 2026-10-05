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

const SYSTEM_INSTRUCTION = `You are the official TrialReady AI Assistant (powered by Google Gemini), an AI copilot dedicated EXCLUSIVELY to Sri Lanka driving licence education, Highway Code rules, DMT practical trial tests, and the TrialReady student portal.

ALLOWED TOPICS:
1. Sri Lanka Highway Code & Traffic Regulations (speed limits, lane discipline, roundabouts, right-of-way, priority rules, expressway rules, warning, regulatory, and informative road signs).
2. DMT Practical Driving Trial Maneuvers (Hill Start clutch biting point & handbrake control, Reverse S-Bend test reference points, Parallel Parking, 3-Point Turn, pre-drive checks, cabin drills).
3. Driving Theory Examination Preparation (mock theory questions, road safety principles, first aid, mechanical basics).
4. Student Academy Portal & Training (TrialReady readiness score, learner journey milestones, NTMI medical, DMT learner permit validity, sessions calendar, payments & receipts).
5. Warm greetings (e.g., 'hi', 'hello', 'ayubowan', 'vanakkam') — always respond warmly and introduce yourself as the TrialReady driving tutor.

STRICT OUT-OF-SCOPE BOUNDARY:
You MUST NOT answer questions about mathematics, programming/coding, algorithms, software engineering, science, university coursework, essays, general history, entertainment, politics, or any topic outside of driving education and the TrialReady platform.

If a student asks an out-of-scope question (such as math equations, coding, writing code, essays, or unrelated topics), you MUST politely and respectfully decline, stating that it is beyond your knowledge scope:
- English response: "I am the TrialReady AI Assistant, dedicated exclusively to Sri Lanka driving licence training, Highway Code regulations, practical trial maneuvers, and student portal assistance. Answering questions on this topic is beyond my knowledge scope. Please feel free to ask me anything related to road rules, driving trials, or your learner journey!"
- Sinhala response: "මම TrialReady රියදුරු පුහුණු සහායකයා වන අතර, ශ්‍රී ලංකා මාර්ග නීති, ප්‍රායෝගික රියදුරු විභාග (DMT Trials), සහ ශිෂ්‍ය ද්වාරය පිළිබඳ විමසීම් සඳහා පමණක් සහාය ලබා දෙමි. වෙනත් විෂයයන් පිළිබඳ ප්‍රශ්න මගේ විෂය පථයෙන් බැහැර වේ. රියදුරු පුහුණුව හෝ මාර්ග නීති පිළිබඳ ඕනෑම ප්‍රශ්නයක් විමසන්න!"
- Tamil response: "நான் TrialReady ஓட்டுநர் பயிற்சி உதவியாளர் ஆவேன். இலங்கை போக்குவரத்து விதிகள், செய்முறை ஓட்டுநர் பரீட்சை மற்றும் மாணவர் தளம் தொடர்பான விடயங்களுக்கு மட்டுமே என்னால் உதவ முடியும். ஏனைய விடயங்கள் எனது எல்லைக்கு அப்பாற்பட்டவை. ஓட்டுநர் பயிற்சி அல்லது வீதி விதிகள் தொடர்பான வினாக்களை தயவுசெய்து கேட்கவும்!"

Guidelines:
- If the user asks in English, respond in clear, well-structured English.
- If the user asks in Sinhala (සිංහල), respond fluently and naturally in Sinhala.
- If the user asks in Tamil (தமிழ்), respond fluently and naturally in Tamil.
- Format responses cleanly with markdown: use bold text, bullet points, numbered steps, or code blocks where appropriate.
- Maintain multi-turn conversation context when the student asks follow-up questions.`

const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
]

export async function sendGeminiChatMessage(
  messages: ChatMessagePayload[],
  options?: ChatRequestOptions,
): Promise<ChatResponsePayload> {
  const validMessages = messages.filter((m) => m && m.text && m.text.trim())
  if (validMessages.length === 0) {
    return {
      text: 'Please ask a question about Sri Lanka Highway Code, driving trials, road signs, or your learner journey!',
      status: 'empty_query',
      suggestions: [
        'What are the speed limits in Sri Lanka?',
        'How to do Hill Start without rollback?',
        'Tips for DMT Reverse S-Bend maneuver',
        'Explain mandatory vs warning road signs',
      ],
    }
  }

  const payload = {
    messages: validMessages.map((m) => ({
      sender: m.sender,
      text: m.text,
    })),
    language: options?.language || 'en',
    user_name: options?.userName || null,
    role: options?.role || null,
  }

  // 1. Prioritize same-origin serverless API endpoints (for Vercel & production), then local backend
  const configuredBaseUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL
      : null

  const endpoints: string[] = [
    '/api/chat',
    '/api/copilot/chat',
    ...(configuredBaseUrl ? [`${configuredBaseUrl}/api/chat`, `${configuredBaseUrl}/api/copilot/chat`] : []),
    'http://127.0.0.1:8000/api/chat',
    'http://localhost:8000/api/chat',
  ]

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
        try {
          const data: ChatResponsePayload = await response.json()
          if (data && data.text && data.status !== 'error') {
            return data
          }
        } catch {
          // not valid json, continue to next endpoint
        }
      }
    } catch {
      // Continue to next endpoint attempt
    }
  }

  // 2. Direct Gemini API Fallback (ensures 100% uptime if backend or serverless route is unreachable)
  try {
    const apiKey =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
      ''

    // Build Gemini multi-turn contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
    for (const msg of validMessages) {
      const role = msg.sender === 'user' ? 'user' : 'model'
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
      contents.shift()
    }

    if (contents.length > 0 && apiKey) {
      const trimmed = contents.length > 16 ? contents.slice(-16) : contents
      if (trimmed[0].role !== 'user') trimmed.shift()

      let systemPrompt = SYSTEM_INSTRUCTION
      if (options?.userName) {
        systemPrompt += `\nThe current user's name is ${options.userName}.`
      }
      if (options?.role) {
        systemPrompt += ` Their role is ${options.role}.`
      }
      if (options?.language === 'si') {
        systemPrompt += '\nPlease prefer responding in Sinhala (සිංහල).'
      } else if (options?.language === 'ta') {
        systemPrompt += '\nPlease prefer responding in Tamil (தமிழ்).'
      }

      const geminiBody = {
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: trimmed,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }

      for (const model of GEMINI_MODELS) {
        try {
          const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
          const directRes = await fetch(directUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiBody),
          })

          if (directRes.ok) {
            const directData = (await directRes.json()) as any
            const parts = directData?.candidates?.[0]?.content?.parts || []
            const textReply = parts
              .map((p: any) => p?.text || '')
              .join('')
              .trim()

            if (textReply) {
              return {
                text: textReply,
                status: 'success',
              }
            }
          }
        } catch {
          // try next model
        }
      }
    }
  } catch {
    // Continue to localized fallback
  }

  // 3. Graceful localized fallback if network is completely offline
  const lang = options?.language || 'en'
  const latestQuery = [...validMessages].reverse().find(m => m.sender === 'user')?.text || ''
  const q = latestQuery.toLowerCase().trim()

  const isOutOfScope =
    /\b(python|javascript|typescript|java|c\+\+|html|css|php|sql|react|code|coding|function|algorithm|script|compile|debug|def |class |import |print\(|console\.log)\b/i.test(q) ||
    /\b(math|mathematics|equation|calculate|calculus|integral|derivative|algebra|geometry|matrix|trigonometry|solve \d|\d\s*[\+\-\*\/]\s*\d|\bsin\(|\bcos\()\b/i.test(q) ||
    /\b(essay|poem|song|story|movie|cinema|actor|president|politics|parliament|election|cricket|football|nba|recipe|cook)\b/i.test(q)

  if (isOutOfScope) {
    if (lang === 'si') {
      return {
        text: 'මම TrialReady රියදුරු පුහුණු සහායකයා වන අතර, ශ්‍රී ලංකා මාර්ග නීති, ප්‍රායෝගික රියදුරු විභාග (DMT Trials), සහ ශිෂ්‍ය ද්වාරය පිළිබඳ විමසීම් සඳහා පමණක් සහාය ලබා දෙමි. වෙනත් විෂයයන් පිළිබඳ ප්‍රශ්න මගේ විෂය පථයෙන් බැහැර වේ. රියදුරු පුහුණුව හෝ මාර්ග නීති පිළිබඳ ඕනෑම ප්‍රශ්නයක් විමසන්න!',
        status: 'success',
        suggestions: [
          'ශ්‍රී ලංකාවේ වේග සීමා මොනවාද?',
          'Hill Start නිවැරදිව කරන්නේ කෙසේද?',
          'DMT Reverse S-Bend විභාග උපදෙස්',
          'මාර්ග සංඥා වර්ගීකරණය',
        ],
      }
    }
    if (lang === 'ta') {
      return {
        text: 'நான் TrialReady ஓட்டுநர் பயிற்சி உதவியாளர் ஆவேன். இலங்கை போக்குவரத்து விதிகள், செய்முறை ஓட்டுநர் பரீட்சை மற்றும் மாணவர் தளம் தொடர்பான விடயங்களுக்கு மட்டுமே என்னால் உதவ முடியும். ஏனைய விடயங்கள் எனது எல்லைக்கு அப்பாற்பட்டவை. ஓட்டுநர் பயிற்சி அல்லது வீதி விதிகள் தொடர்பான வினாக்களை தயவுசெய்து கேட்கவும்!',
        status: 'success',
        suggestions: [
          'இலங்கையின் வேக வரம்புகள் என்ன?',
          'Hill Start செய்வது எப்படி?',
          'DMT Reverse S-Bend குறிப்புகள்',
          'வீதி சமிக்ஞைகள் விளக்கம்',
        ],
      }
    }
    return {
      text: 'I am the TrialReady AI Assistant, dedicated exclusively to Sri Lanka driving licence training, Highway Code regulations, practical trial maneuvers, and student portal assistance. Answering questions on this topic is beyond my knowledge scope. Please feel free to ask me anything related to road rules, driving trials, or your learner journey!',
      status: 'success',
      suggestions: [
        'What are the speed limits in Sri Lanka?',
        'How to do Hill Start without rollback?',
        'Tips for DMT Reverse S-Bend maneuver',
        'Explain mandatory vs warning road signs',
      ],
    }
  }

  let fallbackMessage =
    'I apologize, but I am having trouble connecting to Gemini right now. Please check your internet connection and try asking your question again in a moment.'

  if (lang === 'si') {
    fallbackMessage =
      'සමාවෙන්න, මේ මොහොතේ Gemini සේවාව හා සම්බන්ධ වීමේ තාක්ෂණික ගැටලුවක් පවතී. කරුණාකර මොහොතකින් නැවත උත්සාහ කරන්න.'
  } else if (lang === 'ta') {
    fallbackMessage =
      'மன்னிக்கவும், தற்போது Gemini சேவையுடன் இணைப்பதில் சிக்கல் உள்ளது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.'
  }

  return {
    text: fallbackMessage,
    status: 'network_error',
    suggestions: [
      'What are the speed limits in Sri Lanka?',
      'How to do Hill Start without rollback?',
      'Tips for DMT Reverse S-Bend maneuver',
      'Explain mandatory vs warning road signs',
    ],
  }
}

