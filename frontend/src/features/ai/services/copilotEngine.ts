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

const STOP_WORDS = new Set([
  'how',
  'to',
  'be',
  'an',
  'a',
  'the',
  'in',
  'is',
  'at',
  'of',
  'on',
  'for',
  'with',
  'about',
  'can',
  'i',
  'you',
  'me',
  'my',
  'what',
  'where',
  'when',
  'which',
  'who',
  'why',
  'and',
  'or',
  'do',
  'does',
  'did',
  'are',
  'was',
  'were',
  'it',
  'this',
  'that',
  'there',
  'section',
  'tell',
  'give',
  'go',
  'get',
  'know',
  'some',
  'please',
  'want',
  'need',
  'like',
])

// Conversational quick-replies for greetings & social exchanges
const CASUAL_RESPONSES: Record<
  string,
  { en: string; si: string; ta: string; suggestions?: string[] }
> = {
  gm: {
    en: '☀️ Good morning! Wishing you a productive and safe driving day!\n\nHow can I help you today? You can ask about your student portal, driving lessons, DMT theory questions, or trial test maneuvers.',
    si: '☀️ සුබ උදෑසනක්! අද දවස ඔබට සාර්ථක හා ආරක්ෂිත රියදුරු පුහුණු දිනයක් වේවා!\n\nඅද මට ඔබට උපකාර කළ හැක්කේ කෙසේද? ශිෂ්‍ය පෝර්ටලය, පුහුණු සැසි, හෝ DMT මාර්ග නීති පිළිබඳ ඕනෑම දෙයක් අසන්න.',
    ta: '☀️ காலை வணக்கம்! இன்றைய நாள் உங்களுக்கு பாதுகாப்பான ஓட்டுநர் பயிற்சி நாளாக அமையட்டும்!\n\nஇன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்? மாணவர் போர்ட்டல், செய்முறைப் பயிற்சி அல்லது விதிகள் பற்றி கேட்கலாம்.',
    suggestions: ['Student Portal Features', 'Highway Code Rules', 'Hill Start Tips', 'Mock Exam'],
  },
  'good morning': {
    en: '☀️ Good morning! Ready to master your driving skills today?\n\nAsk me anything about your student portal schedule, fees, Sri Lanka highway code, or practical trial tips!',
    si: '☀️ සුබ උදෑසනක්! රියදුරු පුහුණුව හෝ මාර්ග නීති පිළිබඳ ඕනෑම ප්‍රශ්නයක් අසන්න.',
    ta: '☀️ காலை வணக்கம்! உங்கள் ஓட்டுநர் பயிற்சி அல்லது விதிகள் பற்றி எதுவாக இருந்தாலும் கேளுங்கள்.',
    suggestions: ['Student Portal Features', 'Highway Code Rules', 'Hill Start Tips'],
  },
  gn: {
    en: '🌙 Good night! Rest well and stay safe on the roads. Reach out anytime tomorrow for more driving guidance and theory prep!',
    si: '🌙 සුබ රාත්‍රියක්! හෙට දවසේ ඔබේ රියදුරු පුහුණුවට සුබ පතනවා. අවශ්‍ය ඕනෑම වේලාවක මගෙන් විමසන්න!',
    ta: '🌙 இனிய இரவு வணக்கம்! நாளை உங்கள் ஓட்டுநர் பயிற்சி சிறக்க வாழ்த்துகள்!',
    suggestions: ['Student Portal Features', 'Highway Code Rules', 'Mock Exam'],
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
  hi: {
    en: '👋 Hello! Welcome to TrialReady AI Copilot.\n\nHow can I help you today? You can ask about:\n• 🎓 **Student Portal:** Check schedule, fees, and trial readiness\n• 🚦 **Highway Code:** Speed limits, traffic lights, and road signs\n• 🚗 **Practical Trials:** Hill Start, Reverse S-Bend, and test tips',
    si: '👋 ආයුබෝවන්! TrialReady AI Copilot වෙත සාදරයෙන් පිළිගනිමු.\n\nඔබේ ශිෂ්‍ය පෝර්ටලය, පුහුණු සැසි, මාර්ග නීති හෝ ප්‍රායෝගික පරීක්ෂණය පිළිබඳ ඕනෑම දෙයක් අසන්න!',
    ta: '👋 வணக்கம்! TrialReady AI Copilot இற்கு உங்களை வரவேற்கிறோம்.\n\nமாணவர் போர்ட்டல், கால அட்டவணை, போக்குவரத்து விதிகள் அல்லது செய்முறைப் பரீட்சை பற்றி கேளுங்கள்!',
    suggestions: ['Student Portal Features', 'Highway Code Rules', 'Hill Start Tips', 'Speed Limits in Sri Lanka'],
  },
  hello: {
    en: '👋 Hello! I am your AI Assistant. Ask me anything about your driving academy schedule, DMT theory exam, road rules, vehicle mechanics, or safety guidance!',
    si: '👋 ආයුබෝවන්! මම ඔබේ AI සහායකයා වෙමි. ඕනෑම ප්‍රශ්නයක් අසන්න.',
    ta: '👋 வணக்கம்! நான் உங்கள் AI உதவியாளர். உங்கள் கேள்விகளைக் கேளுங்கள்.',
    suggestions: ['Student Portal Features', 'Highway Code Rules', 'Hill Start Tips'],
  },
  hey: {
    en: '👋 Hey there! How can I help you today?',
    si: '👋 ආයුබෝවන්! අද ඔබට මට උපකාර කළ හැක්කේ කෙසේද?',
    ta: '👋 வணக்கம்! இன்று உங்களுக்கு நான் எவ்வாறு உதவலாம்?',
  },
  ayubowan: {
    en: '🙏 Ayubowan! Welcome to TrialReady.LK. How can I assist you today?',
    si: '🙏 ආයුබෝවන්! TrialReady.LK වෙත සාදරයෙන් පිළිගනිමු. අද ඔබට උපකාර කළ හැක්කේ කෙසේද?',
    ta: '🙏 ஆயுபோவன்! TrialReady.LK இற்கு வரவேற்கிறோம். உங்களுக்கு எவ்வாறு உதவலாம்?',
  },
  vanakkam: {
    en: '🙏 Vanakkam! Welcome to TrialReady.LK. How can I assist your journey today?',
    si: '🙏 වනක්කම්! TrialReady.LK වෙත සාදරයෙන් පිළිගනිමු. ඔබට උදව් කරන්නේ කෙසේද?',
    ta: '🙏 வணக்கம்! TrialReady.LK இற்கு உங்களை அன்புடன் வரவேற்கிறோம். இன்று உங்களுக்கு என்ன உதவி தேவை?',
  },
  thanks: {
    en: '🙏 You are very welcome! Always happy to help. Let me know if you have any more questions!',
    si: '🙏 ඔබට ඉතාම ස්තූතියි! උදව් කිරීමට ලැබීම සතුටක්. තවත් ප්‍රශ්න ඇත්නම් විමසන්න.',
    ta: '🙏 மிக்க நன்றி! உதவ எப்போதும் தயாராக உள்ளேன்.',
  },
  'thank you': {
    en: '🙏 You are very welcome! Best of luck with your goals. Feel free to ask anytime!',
    si: '🙏 ස්තූතියි! ඔබේ සියලු කටයුතුවලට සුබ පතනවා!',
    ta: '🙏 மிக்க நன்றி! நல்வாழ்த்துகள்!',
  },
  ok: {
    en: '👍 Great! Let me know whenever you need any further information or tips.',
    si: '👍 ඉතා හොඳයි! අවශ්‍ය ඕනෑම වේලාවක විමසන්න.',
    ta: '👍 சிறப்பு! மேலும் சந்தேகங்கள் இருந்தால் கேளுங்கள்.',
  },
  okay: {
    en: '👍 Perfect! I am always here to help.',
    si: '👍 ඉතා හොඳයි! මම සැමවිටම ඔබට සහාය වීමට සූදානම්.',
    ta: '👍 சரி! உங்களுக்கு உதவி தேவைப்படும்போது கேளுங்கள்.',
  },
  cool: {
    en: '😎 Awesome! Feel free to ask anything else.',
    si: '😎 විශිෂ්ටයි! ඕනෑම දෙයක් විමසන්න.',
    ta: '😎 நன்று! எதையும் கேளுங்கள்.',
  },
  'how are you': {
    en: '😊 I am doing great, thank you for asking! Ready to help you with driving questions, safety tips, or general advice. What is on your mind today?',
    si: '😊 මම ඉතා සතුටින් හා සූදානමින් සිටිනවා! ඔබට උපකාර කිරීමට මම සූදානම්.',
    ta: '😊 நான் நலமாக உள்ளேன், நன்றி! உங்களுக்கு உதவத் தயாராக உள்ளேன்.',
  },
  'how r u': {
    en: '😊 Doing great and ready to assist! How can I help you today?',
    si: '😊 සතුටින් සිටිනවා! අද ඔබට උදව් කරන්නේ කෙසේද?',
    ta: '😊 நலமாக உள்ளேன்! இன்று நான் எவ்வாறு உதவலாம்?',
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
          : 'Please ask a question. I am ready to assist you!',
    }
  }

  const lowerQuery = query.toLowerCase()
  const cleanLower = lowerQuery
    .replace(/[^\w\s\u0D80-\u0DFF\u0B80-\u0BFF]/g, '')
    .trim()

  // 1. Direct Casual & Social Handler
  if (CASUAL_RESPONSES[cleanLower]) {
    const r = CASUAL_RESPONSES[cleanLower]
    return {
      text: r[language] || r.en,
      matchedCategory: 'greetings',
      suggestions: r.suggestions || [
        'Student Portal Features',
        'Highway Code Rules',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    }
  }

  // 2. High-Specificity Sub-Intent Direct Routing
  // A. Admin Portal Intent
  if (
    cleanLower.includes('admin') ||
    cleanLower.includes('administrator') ||
    cleanLower.includes('principal') ||
    cleanLower.includes('management portal')
  ) {
    const adminItem = COPILOT_KNOWLEDGE_BASE.find(
      (k) => k.id === 'kb-admin-portal'
    )
    if (adminItem) {
      return {
        text: adminItem.answer[language] || adminItem.answer.en,
        matchedCategory: 'instructor_admin',
        suggestions: adminItem.suggestions || [
          'Student Management',
          'Instructor Portal',
          'Financial Management',
        ],
      }
    }
  }

  // B. Instructor Portal Intent
  if (
    cleanLower.includes('instructor') ||
    cleanLower.includes('teacher') ||
    cleanLower.includes('trainer')
  ) {
    const instructorItem = COPILOT_KNOWLEDGE_BASE.find(
      (k) => k.id === 'kb-instructor-portal'
    )
    if (instructorItem) {
      return {
        text: instructorItem.answer[language] || instructorItem.answer.en,
        matchedCategory: 'instructor_admin',
        suggestions: instructorItem.suggestions || [
          'Admin Portal Access',
          'Student Portal Features',
          'Hill Start Tips',
        ],
      }
    }
  }

  // C. Specific Student Portal Sub-Features:
  // 1. Finances, Receipts, Payments, Fees & Balance
  if (
    cleanLower.includes('finance') ||
    cleanLower.includes('financial') ||
    cleanLower.includes('receipt') ||
    cleanLower.includes('receipts') ||
    cleanLower.includes('reciept') ||
    cleanLower.includes('reciepts') ||
    cleanLower.includes('payment') ||
    cleanLower.includes('payments') ||
    cleanLower.includes('installment') ||
    cleanLower.includes('fee') ||
    cleanLower.includes('fees') ||
    cleanLower.includes('balance') ||
    cleanLower.includes('package cost')
  ) {
    const payItem = COPILOT_KNOWLEDGE_BASE.find((k) => k.id === 'kb-payments-fees')
    if (payItem) {
      return {
        text: payItem.answer[language] || payItem.answer.en,
        matchedCategory: 'payments_fees',
        suggestions: [
          'How to check my sessions',
          'Student Portal Overview',
          'What is Readiness Score',
        ],
      }
    }
  }

  // 2. Practical Sessions & Calendar Schedule
  if (
    cleanLower.includes('session') ||
    cleanLower.includes('sessions') ||
    cleanLower.includes('schedule') ||
    cleanLower.includes('lesson') ||
    cleanLower.includes('lessons') ||
    cleanLower.includes('driving class') ||
    cleanLower.includes('when is my class') ||
    cleanLower.includes('book session') ||
    cleanLower.includes('calendar')
  ) {
    const sessItem = COPILOT_KNOWLEDGE_BASE.find(
      (k) => k.id === 'kb-sessions-schedule'
    )
    if (sessItem) {
      return {
        text: sessItem.answer[language] || sessItem.answer.en,
        matchedCategory: 'sessions_schedule',
        suggestions: [
          'How to view my payments',
          'Hill Start Tips',
          'What is Readiness Score',
        ],
      }
    }
  }

  // 3. Trial Readiness Score & Learner Journey
  if (
    cleanLower.includes('readiness') ||
    cleanLower.includes('ready for trial') ||
    cleanLower.includes('am i ready') ||
    cleanLower.includes('score percentage') ||
    cleanLower.includes('how readiness is calculated') ||
    cleanLower.includes('journey milestones')
  ) {
    const readyItem = COPILOT_KNOWLEDGE_BASE.find(
      (k) => k.id === 'kb-trial-readiness'
    )
    if (readyItem) {
      return {
        text: readyItem.answer[language] || readyItem.answer.en,
        matchedCategory: 'trial_tips',
        suggestions: ['How to do Hill Start', 'Examiner checkpoints', 'Take Mock Exam'],
      }
    }
  }

  // 4. DMT Theory Mock Exam Simulator
  if (
    cleanLower.includes('mock exam') ||
    cleanLower.includes('theory exam') ||
    cleanLower.includes('theory hub') ||
    cleanLower.includes('practice exam') ||
    cleanLower.includes('40 questions') ||
    cleanLower.includes('pass mark')
  ) {
    const examItem = COPILOT_KNOWLEDGE_BASE.find(
      (k) => k.id === 'kb-theory-exam-overview'
    )
    if (examItem) {
      return {
        text: examItem.answer[language] || examItem.answer.en,
        matchedCategory: 'theory_hub',
        suggestions: ['Highway Code Rules', 'Speed Limits in Sri Lanka', 'Road Signs Difference'],
      }
    }
  }

  // 5. Medical & DMT Permit Countdown
  if (
    cleanLower.includes('medical') ||
    cleanLower.includes('ntmi') ||
    cleanLower.includes('permit') ||
    cleanLower.includes('6 months') ||
    cleanLower.includes('renew permit') ||
    cleanLower.includes('license class')
  ) {
    const permitItem = COPILOT_KNOWLEDGE_BASE.find(
      (k) => k.id === 'kb-permits-regulations'
    )
    if (permitItem) {
      return {
        text: permitItem.answer[language] || permitItem.answer.en,
        matchedCategory: 'permits_regulations',
        suggestions: ['Student Portal Features', 'Highway Code Rules', 'Mock Exam'],
      }
    }
  }

  // 6. Generic Student Portal Overview (when no specific sub-feature was requested)
  if (
    cleanLower.includes('student portal') ||
    cleanLower.includes('my portal') ||
    cleanLower.includes('student dashboard') ||
    cleanLower.includes('what is student portal')
  ) {
    const overviewItem = COPILOT_KNOWLEDGE_BASE.find(
      (k) => k.id === 'kb-student-portal-overview'
    )
    if (overviewItem) {
      return {
        text: overviewItem.answer[language] || overviewItem.answer.en,
        matchedCategory: 'student_portal',
        suggestions: [
          'How to view my payments',
          'How to check my sessions',
          'What is Readiness Score',
        ],
      }
    }
  }

  // 3. Domain Knowledge Scoring with Stopword Filtering
  const allTokens = cleanLower.split(/\s+/).filter((t) => t.length > 1)
  const meaningfulTokens = allTokens.filter((t) => !STOP_WORDS.has(t))

  // If user only provided stopwords or non-driving nonsense
  if (meaningfulTokens.length === 0) {
    return getOutOfScopeResponse(language)
  }

  let bestItem: KnowledgeItem | null = null
  let maxScore = 0

  for (const item of COPILOT_KNOWLEDGE_BASE) {
    let score = 0

    // Exact phrase matches in keywords
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase()
      if (cleanLower === lowerKw) {
        score += 30
      } else if (cleanLower.includes(lowerKw)) {
        score += lowerKw.length > 5 ? 16 : 9
      }

      // Meaningful token overlap
      const kwTokens = lowerKw.split(/\s+/)
      for (const t of meaningfulTokens) {
        if (kwTokens.includes(t)) {
          score += 6
        }
      }
    }

    if (score > maxScore) {
      maxScore = score
      bestItem = item
    }
  }

  // High-confidence threshold (must match actual domain keywords)
  if (bestItem && maxScore >= 8) {
    let answerText = bestItem.answer[language] || bestItem.answer.en

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

  // 4. Out-of-Scope / Beyond Knowledge Handler
  return getOutOfScopeResponse(language)
}

function getOutOfScopeResponse(language: TheoryLanguage): CopilotResponse {
  if (language === 'si') {
    return {
      text: `🙏 **කණගාමියි, මෙම ප්‍රශ්නය TrialReady AI Copilot ලෙස මගේ විෂය පථයට අයත් නොවේ.**

මම විශේෂණය වී ඇත්තේ පහත ක්ෂේත්‍ර සඳහා පමණි:
• 🎓 **TrialReady පෝර්ටල්:** ශිෂ්‍ය කාලසටහන්, ගෙවීම් රිසිට්පත්, සහ විභාග සූදානම.
• 🚦 **ශ්‍රී ලංකා මාර්ග නීති (Highway Code):** වේග සීමා, මාර්ග සංඥා, සහ වටරවුම් නීති.
• 🚗 **DMT ප්‍රායෝගික පරීක්ෂණ:** Hill Start, Reverse S-Bend, සහ Parallel Parking.

රියදුරු පුහුණුව හෝ මාර්ග නීති පිළිබඳ ඕනෑම ප්‍රශ්නයක් විමසන්න!`,
      suggestions: [
        'Student Portal Features',
        'Highway Code Rules',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    }
  }

  if (language === 'ta') {
    return {
      text: `🙏 **மன்னிக்கவும், இந்த கேள்வி TrialReady AI Copilot ஆக எனது அறிவுக்கு அப்பாற்பட்டது.**

நான் பின்வரும் துறைகளில் மட்டுமே உதவுகிறேன்:
• 🎓 **TrialReady போர்ட்டல்:** கால அட்டவணை, கட்டண ரசீதுகள் மற்றும் தயார்நிலை.
• 🚦 **இலங்கை போக்குவரத்து விதிகள்:** வேக வரம்புகள் மற்றும் வீதி அடையாளங்கள்.
• 🚗 **DMT செய்முறைப் பரீட்சை:** Hill Start, Reverse S-Bend நுட்பங்கள்.

ஓட்டுநர் பயிற்சி அல்லது விதிகள் தொடர்பான கேள்விகளைத் தயங்காமல் கேளுங்கள்!`,
      suggestions: [
        'Student Portal Features',
        'Highway Code Rules',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    }
  }

  return {
    text: `🙏 **Sorry, this question is beyond my knowledge as the TrialReady AI Copilot.**

I specialize specifically in:
• 🎓 **TrialReady Portals:** Student schedules, payment receipts, and Trial Readiness scores.
• 🚦 **Sri Lanka Highway Code:** Road signs, speed limits, traffic lights, and right-of-way rules.
• 🚗 **DMT Practical Trial Maneuvers:** Hill Start, Reverse S-Bend, and Parallel Parking.
• 🔧 **Road Safety & Emergencies:** Vehicle maintenance, brake failure, and accident procedures.

Please feel free to ask me anything related to driving, road regulations, or your driving academy portal!`,
    suggestions: [
      'Student Portal Features',
      'Highway Code Rules',
      'Hill Start Tips',
      'Speed Limits in Sri Lanka',
    ],
  }
}
