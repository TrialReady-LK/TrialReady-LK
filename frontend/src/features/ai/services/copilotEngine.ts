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

// Conversational quick-replies for conversational inputs
const CASUAL_RESPONSES: Record<
  string,
  { en: string; si: string; ta: string; suggestions?: string[] }
> = {
  // Morning greetings
  gm: {
    en: '☀️ Good morning! Wishing you a productive and safe driving day!\n\nHow can I help you today? You can ask about your student portal, upcoming driving lessons, DMT theory questions, or trial test maneuvers.',
    si: '☀️ සුබ උදෑසනක්! අද දවස ඔබට සාර්ථක හා ආරක්ෂිත රියදුරු පුහුණු දිනයක් වේවා!\n\nඅද මට ඔබට උපකාර කළ හැක්කේ කෙසේද? ශිෂ්‍ය පෝර්ටලය, පුහුණු සැසි, හෝ DMT මාර්ග නීති පිළිබඳ ඕනෑම දෙයක් අසන්න.',
    ta: '☀️ காலை வணக்கம்! இன்றைய நாள் உங்களுக்கு பாதுகாப்பான ஓட்டுநர் பயிற்சி நாளாக அமையட்டும்!\n\nஇன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்? மாணவர் போர்ட்டல், செய்முறைப் பயிற்சி அல்லது விதிகள் பற்றி கேட்கலாம்.',
    suggestions: ['Student Portal', 'Hill Start Tips', 'Highway Code', 'Mock Exam'],
  },
  'good morning': {
    en: '☀️ Good morning! Ready to master your driving skills today?\n\nAsk me anything about your student portal schedule, fees, Sri Lanka highway code, or practical trial tips!',
    si: '☀️ සුබ උදෑසනක්! රියදුරු පුහුණුව හෝ මාර්ග නීති පිළිබඳ ඕනෑම ප්‍රශ්නයක් අසන්න.',
    ta: '☀️ காலை வணக்கம்! உங்கள் ஓட்டுநர் பயிற்சி அல்லது விதிகள் பற்றி எதுவாக இருந்தாலும் கேளுங்கள்.',
    suggestions: ['Student Portal', 'Highway Code', 'Hill Start Tips'],
  },
  // Evening & night greetings
  gn: {
    en: '🌙 Good night! Rest well and stay safe on the roads. Reach out anytime tomorrow for more driving guidance and theory prep!',
    si: '🌙 සුබ රාත්‍රියක්! හෙට දවසේ ඔබේ රියදුරු පුහුණුවට සුබ පතනවා. අවශ්‍ය ඕනෑම වේලාවක මගෙන් විමසන්න!',
    ta: '🌙 இனிய இரவு வணக்கம்! நாளை உங்கள் ஓட்டுநர் பயிற்சி சிறக்க வாழ்த்துகள்!',
    suggestions: ['Student Portal', 'Highway Code', 'Mock Exam'],
  },
  'good night': {
    en: '🌙 Good night! Rest well. Don’t forget to practice some quick DMT mock exam questions before your trial!',
    si: '🌙 සුබ රාත්‍රියක්! විභාගයට පෙර Theory Hub වෙතින් පුහුණු වීමට අමතක නොකරන්න.',
    ta: '🌙 இனிய இரவு வணக்கம்! பரீட்சைக்கு முன் மாதிரி வினாக்களைப் பயிற்சி செய்ய மறக்காதீர்கள்.',
  },
  ge: {
    en: '🌆 Good evening! How did your driving sessions or theory practice go today? Let me know if you have any questions!',
    si: '🌆 සුබ සැන්දෑවක්! අද ඔබේ රියදුරු පුහුණුව කෙසේද? ඔබට ඇති ඕනෑම ගැටලුවක් විමසන්න.',
    ta: '🌆 மாலை வணக்கம்! உங்கள் ஓட்டுநர் பயிற்சி எவ்வாறு சென்றது? ஏதேனும் சந்தேகங்கள் இருந்தால் கேளுங்கள்.',
  },
  'good evening': {
    en: '🌆 Good evening! How can I assist you with your driving license journey tonight?',
    si: '🌆 සුබ සැන්දෑවක්! අද රාත්‍රියේ ඔබේ රියදුරු විභාග සූදානමට මට උපකාර කළ හැක්කේ කෙසේද?',
    ta: '🌆 மாலை வணக்கம்! உங்கள் ஓட்டுநர் பயிற்சிக்கு நான் எவ்வாறு உதவ முடியும்?',
  },
  ga: {
    en: '☀️ Good afternoon! How are your driving lessons going? Let me know what you would like to explore today.',
    si: '☀️ සුබ දහවලක්! ඔබේ රියදුරු පුහුණුව සාර්ථකව සිදුවේද? අද ඔබට දැනගැනීමට අවශ්‍ය කුමක්ද?',
    ta: '☀️ மதிய வணக்கம்! உங்கள் ஓட்டுநர் பயிற்சி எவ்வாறு செல்கிறது? இன்று உங்களுக்கு என்ன உதவி தேவை?',
  },
  'good afternoon': {
    en: '☀️ Good afternoon! Ready to practice some theory questions or review your trial readiness?',
    si: '☀️ සුබ දහවලක්! ලිඛිත විභාග ප්‍රශ්න හෝ ප්‍රායෝගික පරීක්ෂණ ඉඟි පිළිබඳ විමසන්න.',
    ta: '☀️ மதிய வணக்கம்! கோட்பாட்டு வினாக்கள் அல்லது செய்முறைப் பயிற்சி பற்றி கேளுங்கள்.',
  },
  // Casual greetings
  hi: {
    en: '👋 Hello! Welcome to TrialReady AI Copilot.\n\nHow can I help you today? You can ask about:\n• 🎓 **Student Portal:** Check schedule, fees, and trial readiness\n• 🚦 **Highway Code:** Speed limits, traffic lights, and road signs\n• 🚗 **Practical Trials:** Hill Start, Reverse S-Bend, and test tips',
    si: '👋 ආයුබෝවන්! TrialReady AI Copilot වෙත සාදරයෙන් පිළිගනිමු.\n\nඔබේ ශිෂ්‍ය පෝර්ටලය, පුහුණු සැසි, මාර්ග නීති හෝ ප්‍රායෝගික පරීක්ෂණය පිළිබඳ ඕනෑම දෙයක් අසන්න!',
    ta: '👋 வணக்கம்! TrialReady AI Copilot இற்கு உங்களை வரவேற்கிறோம்.\n\nமாணவர் போர்ட்டல், கால அட்டவணை, போக்குவரத்து விதிகள் அல்லது செய்முறைப் பரீட்சை பற்றி கேளுங்கள்!',
    suggestions: ['Student Portal Features', 'Highway Code', 'Hill Start Tips', 'Speed Limits'],
  },
  hello: {
    en: '👋 Hello! I am your AI Driving Assistant. Ask me anything about your driving academy schedule, DMT theory exam, or Sri Lanka road rules!',
    si: '👋 ආයුබෝවන්! මම ඔබේ AI රියදුරු සහායකයා වෙමි. ඕනෑම ප්‍රශ්නයක් අසන්න.',
    ta: '👋 வணக்கம்! நான் உங்கள் AI ஓட்டுநர் உதவியாளர். உங்கள் கேள்விகளைக் கேளுங்கள்.',
    suggestions: ['Student Portal Features', 'Highway Code', 'Hill Start Tips'],
  },
  hey: {
    en: '👋 Hey there! How can I help with your driving license preparation today?',
    si: '👋 ආයුබෝවන්! අද ඔබේ රියදුරු බලපත්‍ර සූදානමට මට උපකාර කළ හැක්කේ කෙසේද?',
    ta: '👋 வணக்கம்! உங்கள் ஓட்டுநர் உரிமத் தயாரிப்புக்கு நான் எவ்வாறு உதவலாம்?',
  },
  ayubowan: {
    en: '🙏 Ayubowan! Welcome to TrialReady.LK. How can I assist you with your driving lessons or road regulations today?',
    si: '🙏 ආයුබෝවන්! TrialReady.LK වෙත සාදරයෙන් පිළිගනිමු. අද ඔබට උපකාර කළ හැක්කේ කෙසේද?',
    ta: '🙏 ஆயுபோவன்! TrialReady.LK இற்கு வரவேற்கிறோம். உங்களுக்கு எவ்வாறு உதவலாம்?',
  },
  vanakkam: {
    en: '🙏 Vanakkam! Welcome to TrialReady.LK. How can I assist your driving journey today?',
    si: '🙏 වනක්කම්! TrialReady.LK වෙත සාදරයෙන් පිළිගනිමු. ඔබට උදව් කරන්නේ කෙසේද?',
    ta: '🙏 வணக்கம்! TrialReady.LK இற்கு உங்களை அன்புடன் வரவேற்கிறோம். இன்று உங்களுக்கு என்ன உதவி தேவை?',
  },
  // Polite acknowledgements
  thanks: {
    en: '🙏 You are very welcome! Always happy to help you drive safely and confidently. Let me know if you need anything else!',
    si: '🙏 ඔබට ඉතාම ස්තූතියි! ආරක්ෂිතව හා විශ්වාසයෙන් රිය ධාවනය කිරීමට ඔබට උදව් කිරීමට මම සැමවිටම සූදානම්.',
    ta: '🙏 மிக்க நன்றி! பாதுகாப்பாக வாகனம் ஓட்ட உங்களுக்கு உதவ எப்போதும் தயாராக உள்ளேன்.',
  },
  'thank you': {
    en: '🙏 You are very welcome! Best of luck with your driving lessons and DMT trials. Feel free to ask anytime!',
    si: '🙏 ස්තූතියි! ඔබේ රියදුරු පුහුණුවට සහ විභාගයට සුබ පතනවා!',
    ta: '🙏 மிக்க நன்றி! உங்கள் ஓட்டுநர் பயிற்சி மற்றும் பரீட்சைக்கு நல்வாழ்த்துகள்!',
  },
  thx: {
    en: '🙏 Anytime! Keep practicing and drive safely!',
    si: '🙏 සතුටුයි ඔබට උදව් කිරීමට ලැබීම ගැන! නිරතුරුව පුහුණුවන්න.',
    ta: '🙏 மகிழ்ச்சி! பாதுகாப்பாக வாகனம் ஓட்டுங்கள்.',
  },
  sthuthi: {
    en: '🙏 Bohoma Sthuthi! Always here to support your driving journey.',
    si: '🙏 බොහොම ස්තූතියි! ඔබට උදව් කිරීමට ලැබීම සතුටක්.',
    ta: '🙏 மிக்க நன்றி!',
  },
  nandri: {
    en: '🙏 Romba Nandri! Safe driving!',
    si: '🙏 බොහොම ස්තූතියි!',
    ta: '🙏 மிக்க நன்றி! பாதுகாப்பாக ஓட்டுங்கள்.',
  },
  // Ok & confirmation
  ok: {
    en: '👍 Great! Let me know whenever you have more questions about your lessons, student portal, or road signs.',
    si: '👍 ඉතා හොඳයි! රියදුරු පාඩම් හෝ මාර්ග සංඥා පිළිබඳ වැඩිදුර ප්‍රශ්න ඇත්නම් විමසන්න.',
    ta: '👍 சிறப்பு! மேலும் சந்தேகங்கள் இருந்தால் தயங்காமல் கேளுங்கள்.',
  },
  okay: {
    en: '👍 Perfect! I am always here if you need any driving tips or exam guidance.',
    si: '👍 ඉතා හොඳයි! අවශ්‍ය ඕනෑම වේලාවක විමසන්න.',
    ta: '👍 சரி! உங்களுக்கு உதவி தேவைப்படும்போது கேளுங்கள்.',
  },
  cool: {
    en: '😎 Glad to hear! Drive safe and good luck with your practice sessions!',
    si: '😎 ඉතා විශිෂ්ටයි! ආරක්ෂිතව ධාවනය කරන්න.',
    ta: '😎 நன்று! பாதுகாப்பாகப் பயிற்சி செய்யுங்கள்.',
  },
  great: {
    en: '🌟 Wonderful! Feel free to ask about Hill Starts, Roundabouts, or Speed Limits anytime.',
    si: '🌟 විශිෂ්ටයි! අවශ්‍ය ඕනෑම වේලාවක විමසන්න.',
    ta: '🌟 அருமை! எந்த நேரத்திலும் கேளுங்கள்.',
  },
  // Personal & bot identity
  'how are you': {
    en: '😊 I am doing great, thank you for asking! Ready to help you master the Sri Lanka Highway Code and ace your practical driving trial. What would you like to know today?',
    si: '😊 මම ඉතා සතුටින් හා සූදානමින් සිටිනවා! ශ්‍රී ලංකා මාර්ග නීති සහ රියදුරු විභාගය පිළිබඳ ඔබට උපකාර කිරීමට මම සූදානම්.',
    ta: '😊 நான் நலமாக உள்ளேன், நன்றி! உங்கள் ஓட்டுநர் பரீක්ෂைக்கு வழிகாட்டத் தயாராக உள்ளேன்.',
  },
  'how r u': {
    en: '😊 Doing great and ready to assist you! How are your driving lessons going?',
    si: '😊 සතුටින් සිටිනවා! ඔබේ රියදුරු පුහුණුව කෙසේද?',
    ta: '😊 நலமாக உள்ளேன்! உங்கள் பயிற்சி எவ்வாறு செல்கிறது?',
  },
  kohomada: {
    en: '😊 Godak hondin innawa! Obe driving training eka kohomada? Mokakda danaganna one?',
    si: '😊 ගොඩක් හොඳින් ඉන්නවා! ඔබේ රියදුරු පුහුණුව කොහොමද? අද ඔබට දැනගන්න අවශ්‍ය කුමක්ද?',
    ta: '😊 நான் நலம்! உங்கள் பயிற்சி எப்படி போகிறது?',
  },
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
  const cleanLower = lowerQuery
    .replace(/[^\w\s\u0D80-\u0DFF\u0B80-\u0BFF]/g, '')
    .trim()

  // 1. Direct check for casual greetings and short-form conversational tokens
  if (CASUAL_RESPONSES[cleanLower]) {
    const r = CASUAL_RESPONSES[cleanLower]
    return {
      text: r[language] || r.en,
      matchedCategory: 'greetings',
      suggestions: r.suggestions || [
        'Student Portal Features',
        'Highway Code',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    }
  }

  // 2. Comprehensive scoring against knowledge base
  const queryTokens = cleanLower.split(/\s+/).filter((t) => t.length > 1)

  let bestItem: KnowledgeItem | null = null
  let maxScore = 0

  for (const item of COPILOT_KNOWLEDGE_BASE) {
    let score = 0

    // Exact keyword or phrase matches
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase()
      if (cleanLower === lowerKw) {
        score += 20
      } else if (cleanLower.includes(lowerKw)) {
        score += lowerKw.length > 5 ? 12 : 8
      }

      // Token overlap
      const kwTokens = lowerKw.split(/\s+/)
      for (const t of queryTokens) {
        if (kwTokens.includes(t)) {
          score += 4
        }
      }
    }

    // Question match
    const qText = (item.question[language] || item.question.en).toLowerCase()
    if (cleanLower.includes(qText) || qText.includes(cleanLower)) {
      score += 15
    }
    for (const t of queryTokens) {
      if (qText.includes(t)) {
        score += 2
      }
    }

    if (score > maxScore) {
      maxScore = score
      bestItem = item
    }
  }

  // If we have a reliable match (score >= 6)
  if (bestItem && maxScore >= 6) {
    let answerText = bestItem.answer[language] || bestItem.answer.en

    // Personalize greeting if user is known
    if (bestItem.category === 'student_portal' && context?.userName) {
      const prefix =
        language === 'si'
          ? `ආයුබෝවන් ${context.userName}! `
          : language === 'ta'
          ? `வணக்கம் ${context.userName}! `
          : `Hello ${context.userName}! `
      answerText = `${prefix}\n\n${answerText}`
    }

    return {
      text: answerText,
      matchedCategory: bestItem.category,
      suggestions: bestItem.suggestions || [
        'Student Portal Features',
        'Highway Code Rules',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    }
  }

  // 3. Domain-Specific Intelligent Responders (Natural, direct, conversational)
  // Student Portal / Lessons / Schedule / Payments
  if (
    cleanLower.includes('student') ||
    cleanLower.includes('portal') ||
    cleanLower.includes('schedule') ||
    cleanLower.includes('lesson') ||
    cleanLower.includes('class') ||
    cleanLower.includes('instructor') ||
    cleanLower.includes('payment') ||
    cleanLower.includes('fee') ||
    cleanLower.includes('receipt') ||
    cleanLower.includes('readiness')
  ) {
    return {
      text:
        language === 'si'
          ? `🎓 **ශිෂ්‍ය පෝර්ටලය (Student Portal) පිළිබඳ මගපෙන්වීම:**\n\nඔබේ **Student Portal** (\`/student/portal\`) වෙතින් පහත තොරතුරු ක්ෂණිකව බලාගත හැක:\n\n• 📅 **පුහුණු සැසි (Sessions):** වෙන්කරගත් රියදුරු පුහුණු වේලාවන්, උපදේශකවරයා සහ වාහන අංකය.\n• 📊 **Trial Readiness ලකුණු:** ප්‍රායෝගික විභාගයට ඔබ සුදානම්දැයි දක්වන AI ප්‍රතිශතය.\n• 💳 **ගෙවීම් සහ රිසිට්පත්:** පාඨමාලා ගාස්තු, ගෙවූ වාරික සහ නිල PDF රිසිට්පත් බාගත කිරීම.\n• 🚦 **DMT Mock Exam:** ප්‍රශ්න 40 කින් සමන්විත පරිගණකගත ආදර්ශ විභාග පුහුණුව.`
          : language === 'ta'
          ? `🎓 **மாணவர் போர்ட்டல் (Student Portal) வழிகாட்டல்:**\n\n**Student Portal** (\`/student/portal\`) இல் நீங்கள் பின்வருவனவற்றைப் பார்க்கலாம்:\n\n• 📅 **பயிற்சி அமர்வுகள்:** பதிவு செய்யப்பட்ட திகதி, நேரம், பயிற்றுனர் மற்றும் வாகனம்.\n• 📊 **Trial Readiness மதிப்பெண்:** செய்முறைப் பரீட்சைக்கான உங்கள் தயார்நிலை.\n• 💳 **கட்டணங்கள் & ரசீதுகள்:** செலுத்தப்பட்ட தவணைகள் மற்றும் PDF ரசீதுகள்.\n• 🚦 **DMT மாதிரிப் பரீட்சை:** 40 வினாக்கள் கொண்ட கணினி மாதிரிப் பரீட்சை.`
          : `🎓 **Student Portal Guide & Features:**\n\nIn your **Student Portal** (\`/student/portal\`), you have direct 24/7 access to:\n\n• 📅 **Practical Driving Sessions:** Check upcoming confirmed driving lessons, assigned instructor contact, and vehicle.\n• 📊 **AI Trial Readiness Score:** Tracks your progress (target $\ge 80\%$) based on instructor ratings and attendance.\n• 💳 **Payments & PDF Receipts:** View total course fees, paid installments, balance dues, and download official receipts.\n• 🚦 **Computerized Theory Hub:** Practice full 40-question DMT timed mock exams with instant reviews.`,
      matchedCategory: 'student_portal',
      suggestions: [
        'How to check my sessions',
        'How to view my payments',
        'What is Readiness Score',
      ],
    }
  }

  // Highway Code / Road Rules / Speed / Traffic lights / Road signs
  if (
    cleanLower.includes('highway') ||
    cleanLower.includes('code') ||
    cleanLower.includes('rule') ||
    cleanLower.includes('speed') ||
    cleanLower.includes('sign') ||
    cleanLower.includes('light') ||
    cleanLower.includes('roundabout') ||
    cleanLower.includes('overtake') ||
    cleanLower.includes('line')
  ) {
    return {
      text:
        language === 'si'
          ? `🛣️ **ශ්‍රී ලංකා මහාමාර්ග නීති සංග්‍රහය (Highway Code):**\n\n• **වමෙන් ධාවනය:** සෑමවිටම වම් මංතීරුව භාවිත කරන්න.\n• **දකුණෙන් ඉස්සර කිරීම:** ඉස්සර කළ යුත්තේ දකුණු පසින් පමණි (සුදු ඉරි හෝ වංගුවලදී ඉස්සර නොකරන්න).\n• **වටරවුම්:** ඔබේ දකුණු පසින් එන වාහනවලට ප්‍රමුඛතාව දෙන්න.\n• **වේග සීමා:** නගර තුළ 50 km/h | සාමාන්‍ය මාර්ගවල 70 km/h | අධිවේගී මාර්ගවල 100 km/h.\n• **ආසන පටි:** රියදුරු සහ ඉදිරිපස මගියාට අනිවාර්ය වේ.\n• **2-Second රීතිය:** ඉදිරිපස රථය සමඟ තත්පර 2ක ආරක්ෂිත පරතරයක් තබාගන්න.`
          : language === 'ta'
          ? `🛣️ **இலங்கை நெடுஞ்சாலை விதிகள் (Highway Code):**\n\n• எப்போதும் இடதுபுறமாகச் செல்லவும்.\n• வலதுபுறமாக மட்டுமே முந்தவும் (Overtake).\n• வட்டாரப் பாதையில் வலதுபுற வாகனங்களுக்கு முன்னுரிமை அளியுங்கள்.\n• வேக வரம்புகள்: நகரங்களில் 50 km/h | நெடுஞ்சாலைகளில் 70 km/h | அதிவேக நெடுஞ்சாலைகளில் 100 km/h.\n• சீட்பெල්ட் அணிவது கட்டாயம்.`
          : `🛣️ **Essential Sri Lanka Highway Code Rules:**\n\n1. **Drive on the Left:** Always keep to the left side of the carriageway.\n2. **Overtaking on the Right:** Overtake only on the RIGHT. Never cross solid white continuous lines or overtake on bends.\n3. **Roundabout Priority:** Always give way to traffic approaching from your RIGHT.\n4. **Speed Limits:** Urban areas: **50 km/h** | Rural highways: **70 km/h** | Expressways: **100 km/h**.\n5. **2-Second Safe Distance:** Keep a 2-second buffer behind the front vehicle (4 seconds in rain).\n6. **Seatbelts & Phones:** Seatbelts mandatory; mobile phone usage strictly prohibited while driving.`,
      matchedCategory: 'highway_code',
      suggestions: [
        'Speed Limits in Sri Lanka',
        'Roundabout Priority',
        'Road Signs Difference',
        'Traffic Light Rules',
      ],
    }
  }

  // Maneuvers / Hill Start / Reverse S-bend / Parking / Trial Day
  if (
    cleanLower.includes('hill') ||
    cleanLower.includes('start') ||
    cleanLower.includes('reverse') ||
    cleanLower.includes('bend') ||
    cleanLower.includes('park') ||
    cleanLower.includes('trial') ||
    cleanLower.includes('exam') ||
    cleanLower.includes('maneuver') ||
    cleanLower.includes('fail')
  ) {
    return {
      text:
        language === 'si'
          ? `🚗 **DMT ප්‍රායෝගික පරීක්ෂණය (Practical Trial):**\n\n• ⛰️ **Hill Start (කඳු නැගීම):** හෑන්ඩ්බ්‍රේක් යොදන්න, 1st gear දමන්න, RPM 1500-2000 තබාගන්න, ක්ලච් බයිටිං පොයින්ට් එකට ගෙන හෑන්ඩ්බ්‍රේක් මුදාහරින්න (පසුපසට නොයන්න).\n• 🔄 **Reverse S-Bend:** අඩු ක්ලච් වේගයකින් කණ්නාඩි බලමින් කෝන්වල නොගැටී ධාවනය කරන්න.\n• 🛑 **ක්ෂණික අසමත්වීම්:** කන්දේදී පසුපසට පෙරලීම, කෝන් හැපීම, සීට්බෙල්ට් නොපැළඳීම, හෝ රතු එළියට නොනැවතීම.`
          : language === 'ta'
          ? `🚗 **DMT செய்முறைப் பரீட்சை வழிகாட்டல்:**\n\n• ⛰️ **Hill Start:** ஹேண்ட்பிரேக், 1வது கியர், 1500-2000 RPM, கிளட்ச் பைட்டிங் பாயிண்டில் வைத்து ஹேண்ட்பிரேக்கை விடுவிக்கவும்.\n• 🔄 **Reverse S-Bend:** குறைந்த வேகத்தில் கண்ணாடிகளைக் கவனித்துக் கூம்புகளில் முட்டாமல் ஓட்டவும்.\n• 🛑 **உடனடி தோல்விகள்:** கூம்புகளில் முட்டுதல், வாகனம் பின்னோக்கி உருளுதல், சீட்பெல்ட் அணியாமை.`
          : `🚗 **DMT Practical Trial Mastery & Tips:**\n\n• ⛰️ **Hill Start:** Handbrake on $\rightarrow$ 1st gear $\rightarrow$ Accelerator to 1500–2000 RPM $\rightarrow$ Lift clutch to biting point $\rightarrow$ Release handbrake cleanly with zero rollback.\n• 🔄 **Reverse S-Bend:** Crawl slowly using clutch control $\rightarrow$ Check side mirrors $\rightarrow$ Keep centered between cones without touching poles.\n• 🛑 **Instant Fail Criteria:** Rolling back $>6$ inches on hill, knocking down cones, failing to check blind spots, or straddling solid lines.`,
      matchedCategory: 'maneuvers',
      suggestions: [
        'Hill Start Tips',
        'Reverse S-Bend Tips',
        'Examiner Checkpoints',
        'Student Portal',
      ],
    }
  }

  // Natural conversational fallback for any other question
  if (language === 'si') {
    return {
      text: `💡 **ඔබේ විමසුම පිළිබඳ තොරතුරු:**\n\nශ්‍රී ලංකා රියදුරු පුහුණු නීති සහ TrialReady.LK පද්ධතියට අනුව:\n\n1. **ප්‍රායෝගික පුහුණුව:** Hill Start සහ Reverse S-Bend මනාව ප්‍රගුණ කර පැය 15+ ක පුහුණුව සම්පූර්ණ කරන්න.\n2. **ලිඛිත විභාගය:** Theory Hub (\`/theory\`) වෙතින් ප්‍රශ්න 40 ආදර්ශ විභාග පුහුණුවන්න.\n3. **ශිෂ්‍ය පෝර්ටලය:** ඔබේ කාලසටහන සහ ගෙවීම් පරීක්ෂා කිරීමට Student Portal (\`/student/portal\`) වෙත පිවිසෙන්න.\n\nඔබට වැඩිදුර තොරතුරු අවශ්‍ය මාතෘකාව තෝරන්න:`,
      suggestions: [
        'Student Portal Features',
        'Highway Code in Sri Lanka',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    }
  }

  if (language === 'ta') {
    return {
      text: `💡 **உங்கள் கேள்விக்கான வழிகாட்டல்:**\n\nஇலங்கை ஓட்டுநர் பயிற்சி மற்றும் TrialReady.LK வழிகாட்டுதலின்படி:\n\n1. **செய்முறைப் பயிற்சி:** Hill Start மற்றும் Reverse S-Bend ஆகியவற்றில் தேர்ச்சி பெறுங்கள்.\n2. **கோட்பாட்டுப் பரீட்சை:** Theory Hub (\`/theory\`) இல் மாதிரி வினாக்களைப் பயிற்சி செய்யுங்கள்.\n3. **மாணவர் போர்ட்டல்:** உங்கள் கால அட்டவணை மற்றும் கட்டணங்களை Student Portal (\`/student/portal\`) இல் பார்க்கலாம்.\n\nமேலும் அறிய கீழே உள்ள தலைப்புகளைத் தேர்ந்தெடுக்கவும்:`,
      suggestions: [
        'Student Portal Features',
        'Highway Code in Sri Lanka',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    }
  }

  return {
    text: `💡 **Driving Academy & DMT Guidance:**\n\nRegarding your question, here are the essential points:\n\n1. **🚗 Practical Driving & Trials:**\n   • Master the **Hill Start** (clutch biting point with zero rollback) and **Reverse S-Bend** (slow clutch crawl, no cone hits).\n   • Complete at least 15 hours of certified driving lessons before trial.\n\n2. **🚦 Highway Code & Road Rules:**\n   • Drive on the left, overtake only on the right, and obey speed limits (50 km/h city, 70 km/h highway, 100 km/h expressway).\n   • Practice DMT theory questions in the **Theory Hub (\`/theory\`)**.\n\n3. **🎓 Student Portal Access:**\n   • Check your booked sessions, assigned instructor, and download payment receipts in **Student Portal (\`/student/portal\`)**.\n\nFeel free to choose a topic below for detailed instructions:`,
    suggestions: [
      'Student Portal Features',
      'Highway Code in Sri Lanka',
      'Hill Start Tips',
      'Speed Limits in Sri Lanka',
    ],
  }
}
