import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

function getGeminiApiKey(): string {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
  const candidatePaths = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../backend/.env'),
    path.resolve(__dirname, '.env.local'),
    path.resolve(__dirname, '.env'),
  ]
  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/)
      if (match && match[1]) {
        return match[1].trim().replace(/^["']|["']$/g, '')
      }
    }
  }
  return ''
}

function geminiDevApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-gemini-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const apiKey = getGeminiApiKey()
              const messages = parsed.messages || []
              const validMessages = messages.filter((m: any) => m && m.text && m.text.trim())

              if (validMessages.length === 0) {
                res.setHeader('Content-Type', 'application/json')
                res.end(
                  JSON.stringify({
                    text: 'Please ask a question about Sri Lanka Highway Code, driving trials, road signs, or your learner journey!',
                    status: 'empty_query',
                    suggestions: [
                      'What are the speed limits in Sri Lanka?',
                      'How to do Hill Start without rollback?',
                      'Tips for DMT Reverse S-Bend maneuver',
                      'Explain mandatory vs warning road signs',
                    ],
                  }),
                )
                return
              }

              const models = [
                'gemini-3.8-flash',
                'gemini-3.7-flash',
                'gemini-3.6-flash',
                'gemini-flash-latest',
                'gemini-3.5-flash-lite',
                'gemini-3.1-flash-lite',
              ]

              const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
              for (const msg of validMessages) {
                const role = msg.sender === 'user' ? 'user' : 'model'
                const text = msg.text.trim()
                if (contents.length > 0 && contents[contents.length - 1].role === role) {
                  contents[contents.length - 1].parts[0].text += '\n\n' + text
                } else {
                  contents.push({ role, parts: [{ text }] })
                }
              }

              while (contents.length > 0 && contents[0].role !== 'user') {
                contents.shift()
              }

              const systemInstruction = `You are the official TrialReady AI Assistant (powered by Google Gemini), an AI copilot dedicated EXCLUSIVELY to Sri Lanka driving licence education, Highway Code rules, DMT practical trial tests, and the TrialReady student portal.

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

              const payload = {
                system_instruction: {
                  parts: [{ text: systemInstruction }],
                },
                contents: contents.slice(-16),
                generationConfig: {
                  temperature: 0.7,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 2048,
                },
              }

              for (const model of models) {
                try {
                  const gRes = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    },
                  )
                  if (gRes.ok) {
                    const data = (await gRes.json()) as any
                    const parts = data?.candidates?.[0]?.content?.parts || []
                    const reply = parts.map((p: any) => p?.text || '').join('').trim()
                    if (reply) {
                      res.setHeader('Content-Type', 'application/json')
                      res.end(
                        JSON.stringify({
                          text: reply,
                          status: 'success',
                        }),
                      )
                      return
                    }
                  }
                } catch {
                  // try next model
                }
              }

              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  text: 'I apologize, but I am having trouble connecting to Gemini right now. Please check your internet connection and try asking your question again in a moment.',
                  status: 'error',
                }),
              )
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  text: 'An unexpected error occurred.',
                  status: 'error',
                  error: err?.message,
                }),
              )
            }
          })
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [geminiDevApiPlugin(), tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})