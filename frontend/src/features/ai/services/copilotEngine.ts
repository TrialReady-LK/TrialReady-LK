import {
  COPILOT_KNOWLEDGE_BASE,
  type KnowledgeItem,
} from '../data/copilotKnowledgeBase'
import type { TheoryLanguage } from '../../theory/types/theory'

export interface CopilotContext {
  role?: string | null
  userName?: string | null
  drivingSchoolName?: string | null
}

export interface CopilotResponse {
  text: string
  matchedCategory?: string
  suggestions?: string[]
}

export function processCopilotQuery(
  rawQuery: string,
  language: TheoryLanguage = 'en',
  context?: CopilotContext
): CopilotResponse {
  const query = rawQuery.trim()
  if (!query) {
    return {
      text:
        language === 'si'
          ? 'කරුණාකර ඔබේ ප්‍රශ්නය යොමු කරන්න.'
          : language === 'ta'
          ? 'தயவுசெய்து உங்கள் கேள்வியைக் கேட்கவும்.'
          : 'Please ask a question about Sri Lanka driving rules, practical trials, or the Student Portal.',
    }
  }

  const lowerQuery = query.toLowerCase()
  const queryTokens = lowerQuery
    .replace(/[^\w\s\u0D80-\u0DFF\u0B80-\u0BFF]/g, '')
    .split(/\s+/)
    .filter((t) => t.length > 1)

  // 1. Check for Direct Greetings
  const greetingsRegex =
    /^(hi|hello|hey|ayubowan|vanakkam|good morning|good afternoon|good evening|sup|kohomada|halo|greetings)[\s!.]*$/i
  if (greetingsRegex.test(lowerQuery) || lowerQuery === 'hi' || lowerQuery === 'hello') {
    const greetingItem = COPILOT_KNOWLEDGE_BASE.find((k) => k.id === 'kb-greet-1')
    if (greetingItem) {
      return {
        text: greetingItem.answer[language] || greetingItem.answer.en,
        matchedCategory: 'greetings',
        suggestions: greetingItem.suggestions,
      }
    }
  }

  // 2. Score knowledge base items
  let bestItem: KnowledgeItem | null = null
  let maxScore = 0

  for (const item of COPILOT_KNOWLEDGE_BASE) {
    let score = 0

    // Exact phrase match in keywords
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase()
      if (lowerQuery.includes(lowerKw)) {
        score += lowerKw.length > 5 ? 12 : 7
      }
      // Token overlap
      const kwTokens = lowerKw.split(/\s+/)
      for (const t of queryTokens) {
        if (kwTokens.includes(t)) {
          score += 4
        }
      }
    }

    // Question text similarity
    const qText = (item.question[language] || item.question.en).toLowerCase()
    for (const t of queryTokens) {
      if (qText.includes(t)) {
        score += 3
      }
    }

    if (score > maxScore) {
      maxScore = score
      bestItem = item
    }
  }

  // If we have a strong match (score >= 6)
  if (bestItem && maxScore >= 6) {
    let answerText = bestItem.answer[language] || bestItem.answer.en

    // Personalize if student portal related
    if (bestItem.category === 'student_portal' && context?.userName) {
      const prefix =
        language === 'si'
          ? `ආයුබෝවන් ${context.userName}! `
          : language === 'ta'
          ? `வணக்கம் ${context.userName}! `
          : `Hello ${context.userName}! `
      answerText = prefix + '\n\n' + answerText
    }

    return {
      text: answerText,
      matchedCategory: bestItem.category,
      suggestions: bestItem.suggestions || [
        'How do I check my sessions?',
        'What is my Readiness score?',
        'Highway Code rules in Sri Lanka',
      ],
    }
  }

  // 3. Smart Semantic Intent Analyzers (Dynamic Fallback synthesis)
  // Check for Student Portal / Progress queries
  if (
    lowerQuery.includes('student') ||
    lowerQuery.includes('portal') ||
    lowerQuery.includes('dashboard') ||
    lowerQuery.includes('my class') ||
    lowerQuery.includes('my lesson') ||
    lowerQuery.includes('my fee')
  ) {
    return {
      text:
        language === 'si'
          ? `🎓 **ශිෂ්‍ය පෝර්ටලය (Student Portal) භාවිතය:**\n\nඔබේ ශිෂ්‍ය පෝර්ටලය (\`/student/portal\`) මඟින් පහත දෑ කළ හැකිය:\n• **පුහුණු සැසි:** නියමිත රියදුරු පුහුණු වේලාවන් සහ උපදේශක විස්තර බැලීම.\n• **ගෙවීම් සහ රිසිට්පත්:** ගෙවූ මුදල් සහ බාගත හැකි PDF රිසිට්පත් ලබාගැනීම.\n• **Trial Readiness:** විභාගයට ඔබේ සුදානම් වීමේ ප්‍රතිශතය.\n• **DMT Theory Hub:** පරිගණකගත ආදර්ශ විභාග පුහුණුව.`
          : language === 'ta'
          ? `🎓 **மாணவர் போர்ட்டல் (Student Portal) பயன்பாடு:**\n\nமாணவர் போர்ட்டலில் (\`/student/portal\`) நீங்கள்:\n• உங்கள் நடைமுறை ஓட்டுநர் பயிற்சி அமர்வுகளைப் பார்வையிடலாம்.\n• கட்டண ரசீதுகள் மற்றும் நிலுவைத் தொகையைச் சரிபார்க்கலாம்.\n• Trial Readiness மதிப்பெண்ணைக் கணிக்கலாம்.\n• DMT மாதிரிப் பரீட்சைகளைப் பயிற்சி செய்யலாம்.`
          : `🎓 **Student Portal Guide & Features:**\n\nIn your **Student Portal** (\`/student/portal\`), you have direct access to:\n\n• **📅 Practical Sessions:** View confirmed lesson dates, time slots, training vehicle, and instructor contact.\n• **📊 Trial Readiness Score:** Real-time AI metric evaluating your trial passing probability.\n• **💳 Payments & PDF Receipts:** Track fee installments and print official payment vouchers.\n• **🚦 Computerized Theory Hub:** Practice 40-question mock exams with real DMT timers.`,
      matchedCategory: 'student_portal',
      suggestions: ['How to view my payments', 'Upcoming Sessions', 'Take Mock Exam'],
    }
  }

  // Check for Highway Code / Driving rules queries
  if (
    lowerQuery.includes('highway') ||
    lowerQuery.includes('code') ||
    lowerQuery.includes('rule') ||
    lowerQuery.includes('law') ||
    lowerQuery.includes('overtake') ||
    lowerQuery.includes('drive')
  ) {
    return {
      text:
        language === 'si'
          ? `🛣️ **ශ්‍රී ලංකා මාර්ග නීති සංග්‍රහය (Highway Code):**\n\n• **වමෙන් ධාවනය:** සෑමවිටම වම් මංතීරුව භාවිත කරන්න.\n• **දකුණෙන් ඉස්සර කිරීම:** ඉස්සර කළ යුත්තේ දකුණු පසින් පමණි. තනි හෝ ද්විත්ව සුදු ඉරි මතින් ඉස්සර නොකරන්න.\n• **වටරවුම්:** ඔබේ දකුණු පසින් එන වාහනවලට ප්‍රමුඛතාව දෙන්න.\n• **වේග සීමා:** නගර තුළ 50 km/h, සාමාන්‍ය මාර්ගවල 70 km/h, අධිවේගී මාර්ගවල 100 km/h.\n• **ආසන පටි:** රියදුරු සහ මගියාට අනිවාර්ය වේ.`
          : language === 'ta'
          ? `🛣️ **இலங்கை நெடுஞ்சாலை விதிகள் (Highway Code):**\n\n• எப்போதும் வீதியின் இடதுபுறமாகச் செல்லவும்.\n• வலதுபுறமாக மட்டுமே முந்தவும் (Overtake).\n• வட்டாரப் பாதையில் வலதுபுற வாகனங்களுக்கு முன்னுரிமை அளியுங்கள்.\n• நகரங்களில் 50 km/h, நெடுஞ்சாலைகளில் 70 km/h, அதிவேக நெடுஞ்சாலைகளில் 100 km/h.\n• சீட்பெல்ட் அணிவது கட்டாயம்.`
          : `🛣️ **Sri Lanka Highway Code Essentials:**\n\n• **Lane Position:** Keep to the left lane of the carriageway.\n• **Overtaking:** Always overtake on the RIGHT. Never cross solid white or double continuous lines.\n• **Roundabouts:** Give way to traffic approaching from your RIGHT.\n• **Speed Limits:** Urban 50 km/h | Rural Highways 70 km/h | Expressways 100 km/h.\n• **Safe Distance:** Maintain the 2-Second rule behind the front vehicle (4 seconds in rain).\n• **Zero Alcohol:** Strict zero BAC tolerance for learner drivers.`,
      matchedCategory: 'highway_code',
      suggestions: ['Speed Limits in Sri Lanka', 'Roundabout Priority', 'Traffic Light Rules'],
    }
  }

  // Dynamic Contextual AI Response
  if (language === 'si') {
    return {
      text: `💡 **AI විමසුම් විශ්ලේෂණය:** "${query}"\n\nශ්‍රී ලංකා DMT රියදුරු පුහුණු පද්ධතිය සහ මාර්ග නීති සංග්‍රහයට අනුව:\n\n1. **ප්‍රායෝගික පුහුණුව:** Hill Start (කඳු නැගීම) සහ Reverse S-Bend (ප්‍රතිවිරුද්ධ S-වංගුව) සඳහා ක්ලච් පාලනය මනාව පුහුණුවන්න.\n2. **ලිඛිත විභාගය:** Theory Hub (\`/theory\`) මඟින් ආදර්ශ ප්‍රශ්න පත්‍ර 40 ප්‍රගුණ කරන්න (සමත්වීමට 30ක් අවශ්‍යයි).\n3. **ශිෂ්‍ය පෝර්ටලය:** ඔබේ කාලසටහන සහ ගෙවීම් පරීක්ෂා කිරීමට Student Portal (\`/student/portal\`) වෙත පිවිසෙන්න.`,
      suggestions: ['Student Portal Features', 'Highway Code', 'Hill Start Tips'],
    }
  }

  if (language === 'ta') {
    return {
      text: `💡 **AI ஆலோசனை:** "${query}"\n\nஇலங்கை DMT மோட்டார் போக்குவரத்து சட்டம் மற்றும் ஓட்டுநர் வழிகாட்டுதலின்படி:\n\n1. **செய்முறைப் பயிற்சி:** Hill Start மற்றும் Reverse S-Bend ஆகியவற்றில் தேர்ச்சி பெறுங்கள்.\n2. **கோட்பாட்டுப் பரீட்சை:** Theory Hub (\`/theory\`) இல் 40 வினாக்கள் கொண்ட மாதிரிப் பரீட்சைகளைப் பயிற்சி செய்யுங்கள்.\n3. **மாணவர் போர்ட்டல்:** உங்கள் கால அட்டவணை மற்றும் கட்டணங்களை Student Portal (\`/student/portal\`) இல் பார்க்கலாம்.`,
      suggestions: ['Student Portal Features', 'Highway Code', 'Hill Start Tips'],
    }
  }

  return {
    text: `💡 **AI Assistance on:** "${query}"

Based on the Sri Lanka Motor Traffic Regulations and TrialReady.LK Academy guidelines:

1. **🚗 Practical Driving Trials:**
   • Practice smooth clutch control for the **Hill Start** (no rollback) and **Reverse S-Bend** (avoid touching cones).
   • Complete at least 15 hours of certified driving lessons before the trial date.

2. **🚦 Theory & Highway Code:**
   • Master road signs (Red circle = Mandatory, Red triangle = Warning).
   • Practice 40-question mock exams in the **Theory Hub (\`/theory\`)** to ensure a score $\ge 30/40$.

3. **🎓 Student Portal:**
   • Navigate to **Student Portal (\`/student/portal\`)** to view your booked sessions, assigned instructor, trial readiness score, and download payment receipts.

Would you like more details on any specific rule, trial maneuver, or portal feature?`,
    suggestions: ['Student Portal Features', 'Highway Code Rules', 'Hill Start Tips', 'Speed Limits'],
  }
}
