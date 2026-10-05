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
      contents.shift()
    }

    if (contents.length === 0) {
      res.status(200).json({
        text: 'Please ask a question about Sri Lanka Highway Code, driving trials, road signs, or your learner journey!',
        status: 'empty_query',
      })
      return
    }

    // Keep the most recent 16 turns
    const trimmedContents =
      contents.length > 16 ? contents.slice(-16) : contents
    if (trimmedContents[0].role !== 'user') {
      trimmedContents.shift()
    }

    const latestUserMessage = [...validMessages].reverse().find(m => m.sender === 'user' || m.sender === 'student' || m.sender === 'human')?.text || ''

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

    if (apiKey) {
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
          }
        } catch {
          // try next model
        }
      }
    }

    // Intelligent local fallback if Gemini is offline or API key is not yet set
    const fallbackResponse = getDomainFallbackResponse(latestUserMessage, body.language || 'en')
    res.status(200).json({
      text: fallbackResponse.text,
      status: 'success',
      suggestions: fallbackResponse.suggestions,
    })
  } catch (error: any) {
    res.status(500).json({
      text: 'An unexpected error occurred while processing your request.',
      status: 'server_error',
      error: error?.message,
    })
  }
}

function getDomainFallbackResponse(
  query: string,
  language: 'en' | 'si' | 'ta' = 'en',
): { text: string; suggestions?: string[] } {
  const q = query.toLowerCase().trim()

  // 1. Hard-decline out-of-scope queries (math, code, python, essays, trivia)
  const isOutOfScope =
    /\b(python|javascript|typescript|java|c\+\+|html|css|php|sql|react|code|coding|function|algorithm|script|compile|debug|def |class |import |print\(|console\.log)\b/i.test(q) ||
    /\b(math|mathematics|equation|calculate|calculus|integral|derivative|algebra|geometry|matrix|trigonometry|solve \d|\d\s*[\+\-\*\/]\s*\d|\bsin\(|\bcos\()\b/i.test(q) ||
    /\b(essay|poem|song|story|movie|cinema|actor|president|politics|parliament|election|cricket|football|nba|recipe|cook)\b/i.test(q)

  if (isOutOfScope) {
    if (language === 'si') {
      return {
        text: 'මම TrialReady රියදුරු පුහුණු සහායකයා වන අතර, ශ්‍රී ලංකා මාර්ග නීති, ප්‍රායෝගික රියදුරු විභාග (DMT Trials), සහ ශිෂ්‍ය ද්වාරය පිළිබඳ විමසීම් සඳහා පමණක් සහාය ලබා දෙමි. වෙනත් විෂයයන් පිළිබඳ ප්‍රශ්න මගේ විෂය පථයෙන් බැහැර වේ. රියදුරු පුහුණුව හෝ මාර්ග නීති පිළිබඳ ඕනෑම ප්‍රශ්නයක් විමසන්න!',
        suggestions: [
          'ශ්‍රී ලංකාවේ වේග සීමා මොනවාද?',
          'Hill Start නිවැරදිව කරන්නේ කෙසේද?',
          'DMT Reverse S-Bend විභාග උපදෙස්',
          'මාර්ග සංඥා වර්ගීකරණය',
        ],
      }
    }
    if (language === 'ta') {
      return {
        text: 'நான் TrialReady ஓட்டுநர் பயிற்சி உதவியாளர் ஆவேன். இலங்கை போக்குவரத்து விதிகள், செய்முறை ஓட்டுநர் பரீட்சை மற்றும் மாணவர் தளம் தொடர்பான விடயங்களுக்கு மட்டுமே என்னால் உதவ முடியும். ஏனைய விடயங்கள் எனது எல்லைக்கு அப்பாற்பட்டவை. ஓட்டுநர் பயிற்சி அல்லது வீதி விதிகள் தொடர்பான வினாக்களை தயவுசெய்து கேட்கவும்!',
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
      suggestions: [
        'What are the speed limits in Sri Lanka?',
        'How to do Hill Start without rollback?',
        'Tips for DMT Reverse S-Bend maneuver',
        'Explain mandatory vs warning road signs',
      ],
    }
  }

  // 2. Greetings
  if (
    /^(hi|hello|hey|ayubowan|vanakkam|good morning|good afternoon|good evening|sup|greetings|kohomada|kohomada oya|hlo|hii|helo)$/i.test(q) ||
    /^(hi |hello |hey |ayubowan )/i.test(q)
  ) {
    if (language === 'si') {
      return {
        text: '👋 **ආයුබෝවන්! මම TrialReady AI රියදුරු සහායකයා වෙමි.**\n\nශ්‍රී ලංකා මාර්ග නීති, මාර්ග සංඥා, Hill Start, Reverse S-Bend, හෝ ඔබේ පුහුණු සැසි හා ගෙවීම් පිළිබඳ ඕනෑම දෙයක් මා වෙතින් විමසන්න!',
        suggestions: ['වේග සීමා මොනවාද?', 'Hill Start උපදෙස්', 'S-Bend පුහුණුව', 'ශිෂ්‍ය ගෙවීම්'],
      }
    }
    if (language === 'ta') {
      return {
        text: '👋 **வணக்கம்! நான் உங்கள் TrialReady AI சாரதி பயிற்சி உதவியாளர் ஆவேன்.**\n\nஇலங்கை போக்குவரத்து விதிகள், வீதி சமிக்ஞைகள், Hill Start, Reverse S-Bend, அல்லது உங்கள் கட்டண விபரங்கள் பற்றி கேட்கலாம்!',
        suggestions: ['வேக வரம்புகள் என்ன?', 'Hill Start குறிப்புகள்', 'S-Bend பயிற்சி', 'கட்டண விபரங்கள்'],
      }
    }
    return {
      text: '👋 **Ayubowan / Vanakkam / Hello! I am your TrialReady AI Assistant.**\n\nI can help you with:\n• 🚦 **Sri Lanka Highway Code:** Speed limits, right-of-way, road signs & markings\n• 🚗 **DMT Practical Trial Maneuvers:** Hill Start, Reverse S-Bend, 3-Point Turn, Parallel Parking\n• 📑 **Theory Exam Prep:** Mock exam questions, road safety & vehicle mechanics\n• 🎓 **Student Academy Portal:** Lessons schedule, payment plans, and readiness score\n\nWhat would you like help with today?',
      suggestions: [
        'What are the speed limits in Sri Lanka?',
        'How to do Hill Start without rollback?',
        'Tips for DMT Reverse S-Bend maneuver',
        'Explain mandatory vs warning road signs',
      ],
    }
  }

  // 3. Hill Start
  if (q.includes('hill') || q.includes('clutch') || q.includes('biting point') || q.includes('rollback') || q.includes('කඳු') || q.includes('ක්ලච්')) {
    return {
      text: `🚗 **Mastering the DMT Hill Start (Clutch & Handbrake Control):**\n\n1. **Stop & Secure:** Come to a full stop on the incline. Apply the handbrake firmly and shift to Neutral.\n2. **Engage 1st Gear:** Depress clutch fully and select 1st gear.\n3. **Set Revs (Gas):** Press accelerator slightly (~1500–2000 RPM) to produce engine torque.\n4. **Find the Biting Point:** Slowly raise the clutch pedal until you feel the engine dip and vehicle vibrate slightly (car squats).\n5. **Hold Clutch Steady:** Keep your left foot completely frozen at this biting point.\n6. **360° Safety Observations:** Check interior mirror, right wing mirror, and blind spot.\n7. **Release Handbrake:** Smoothly lower the handbrake. The car will move forward without rolling back an inch!\n8. **Gradual Acceleration:** Gently release the remaining clutch travel as the vehicle builds momentum.`,
      suggestions: ['Reverse S-Bend Tips', 'Parallel Parking Steps', 'Speed Limits in Sri Lanka'],
    }
  }

  // 4. Reverse S-Bend
  if (q.includes('s-bend') || q.includes('s bend') || q.includes('reverse') || q.includes('වංගු') || q.includes('පසුපස')) {
    return {
      text: `🔄 **DMT Practical Trial — Reverse S-Bend Maneuver Guide:**\n\n1. **Approach & Straighten:** Position vehicle centered at the entrance of the S-bend track.\n2. **Engage Reverse:** Depress clutch, engage Reverse gear, and check mirrors & rear windscreen.\n3. **First Curve (Left):** When the rear wheel aligns with the first apex curb, steer smoothly towards the curb, maintaining a 0.5m safety margin.\n4. **Transition Point:** As the vehicle enters the inflection point between the curves, quickly straighten the steering.\n5. **Second Curve (Right):** Steer in the opposite direction following the outer curb radius using side mirrors.\n6. **Speed Control:** Use **pure clutch friction control** at walking pace (under 5 km/h). Do not touch the accelerator.\n7. **Complete:** Straighten steering and stop cleanly before the exit boundary markers.`,
      suggestions: ['Hill Start Guide', '3-Point Turn Guide', 'Common Trial Failures'],
    }
  }

  // 5. Speed limits
  if (q.includes('speed') || q.includes('limit') || q.includes('වේග') || q.includes('வேக')) {
    return {
      text: `🚦 **Sri Lanka Legal Speed Limits (Motor Traffic Gazette):**\n\n• **Urban / Built-up Areas (City):**\n  - Cars & Dual Purpose: **50 km/h**\n  - Motorcycles: **40 km/h**\n  - Heavy Vehicles (Buses/Lorries/Three-Wheelers): **40 km/h**\n\n• **Rural / Non-Urban Roads:**\n  - Cars & Dual Purpose: **70 km/h**\n  - Motorcycles: **60 km/h**\n  - Three-Wheelers: **40 km/h**\n\n• **Expressways (Southern / Central / E01/E02):**\n  - Maximum Speed: **100 km/h**\n  - Minimum Speed: **60 km/h**\n  - *Note: Motorcycles and three-wheelers are prohibited on expressways.*`,
      suggestions: ['Highway Code Road Signs', 'Expressway Lane Discipline', 'Hill Start Tips'],
    }
  }

  // 6. Road signs
  if (q.includes('sign') || q.includes('warning') || q.includes('regulatory') || q.includes('සංඥා') || q.includes('சமிக்ஞை')) {
    return {
      text: `🛑 **Sri Lanka Road Signs Classification:**\n\n1. **Regulatory Signs (Mandatory & Prohibitory):**\n   • Circular shape.\n   • Red circle with white/yellow background = **Prohibitory** (e.g., No Entry, Speed Limit, No Right Turn).\n   • Blue circle with white arrows = **Mandatory** (e.g., Turn Left Only, Keep Left).\n   • *Failure to obey is a direct traffic violation under the Motor Traffic Act.*\n\n2. **Warning Signs (Danger Ahead):**\n   • Equilateral triangle pointing upwards with yellow background and black borders.\n   • Warns of upcoming hazards: Sharp Bends, Pedestrian Crossings, School Zones, Steep Inclines.\n\n3. **Informative / Directional Signs:**\n   • Rectangular/Square shape.\n   • Green (Expressways), Blue (National Highways), Brown (Tourism & Heritage sites).`,
      suggestions: ['Speed Limits in Sri Lanka', 'Roundabout Priority Rules', 'Practice DMT Theory Exam'],
    }
  }

  // 7. Payments / Fees
  if (q.includes('payment') || q.includes('fee') || q.includes('pay') || q.includes('koko') || q.includes('mintpay') || q.includes('paypal') || q.includes('installment') || q.includes('ගෙවීම්') || q.includes('கட்டணம்')) {
    return {
      text: `💳 **TrialReady Student Tuition & Payment Methods:**\n\nWe support flexible, instant, and secure payment options for all driving packages:\n\n1. **Direct Bank Transfer (CEFT/SLIPS):** Transfer directly to Commercial Bank of Ceylon PLC (A/C: \`1000 2489 7712\`) and upload your slip in the portal.\n2. **Online Card Payment Gateway:** Instant payment with Visa, MasterCard, or LankaPay.\n3. **PayPal Express:** Global payment via PayPal balance or overseas bank cards.\n4. **Koko (3x BNPL):** Pay in 3 monthly installments with **0% interest** on your debit/credit card.\n5. **Mintpay (3x BNPL):** Split tuition into 3 equal monthly payments with instant approval.\n\nVisit your **Student Portal > Payments Tab** to view your balance, download official receipts, or make a payment!`,
      suggestions: ['View My Payment Ledger', 'Download Official Receipts', 'Learner Journey Milestones'],
    }
  }

  // Default driving guidance response
  return {
    text: `I am your **TrialReady AI Assistant**, dedicated to helping you pass your Sri Lanka driving exams and master road rules.\n\nI can assist you with:\n• 🚦 **Highway Code Regulations** (Speed limits, roundabouts, road signs)\n• 🚗 **DMT Practical Trial Maneuvers** (Hill Start, Reverse S-Bend, Parallel Parking)\n• 📑 **DMT Theory Examination** preparation and mock questions\n• 🎓 **Student Academy Portal** navigation (sessions, payments, logbook, readiness score)\n\nPlease ask any question related to driving education or road safety!`,
    suggestions: [
      'What are the speed limits in Sri Lanka?',
      'How to do Hill Start without rollback?',
      'Tips for DMT Reverse S-Bend maneuver',
      'Explain mandatory vs warning road signs',
    ],
  }
}
