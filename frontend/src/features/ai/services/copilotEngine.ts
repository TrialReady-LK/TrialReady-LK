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

  // 2. High-Precision Knowledge Base Scoring
  const queryTokens = cleanLower.split(/\s+/).filter((t) => t.length > 1)

  // Direct portal role match if user specifically asks for Admin or Instructor
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

  let bestItem: KnowledgeItem | null = null
  let maxScore = 0

  for (const item of COPILOT_KNOWLEDGE_BASE) {
    let score = 0

    // Exact keyword or phrase matches
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase()
      if (cleanLower === lowerKw) {
        score += 25
      } else if (cleanLower.includes(lowerKw)) {
        score += lowerKw.length > 5 ? 14 : 8
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
      score += 18
    }
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

  // If matched with confidence
  if (bestItem && maxScore >= 6) {
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

  // 3. Domain & Universal Generalized Responders
  // Weather & Rain Driving
  if (
    cleanLower.includes('rain') ||
    cleanLower.includes('weather') ||
    cleanLower.includes('flood') ||
    cleanLower.includes('fog') ||
    cleanLower.includes('wet') ||
    cleanLower.includes('aquaplan') ||
    cleanLower.includes('hydroplan')
  ) {
    return {
      text:
        language === 'si'
          ? `🌧️ **වැසි සහ අයහපත් කාලගුණයේදී ආරක්ෂිතව රිය ධාවනය:**\n\n1. **වේගය අඩු කරන්න:** සාමාන්‍ය වේග සීමාවට වඩා අවම වශයෙන් 20-30% කින් වේගය අඩු කරන්න.\n2. **4-Second රීතිය:** ඉදිරිපස වාහනය සමඟ ආරක්ෂිත පරතරය තත්පර 4 දක්වා දෙගුණ කරන්න.\n3. **හෙඩ්ලයිට් දල්වන්න (Low Beam):** මීදුම හෝ අධික වැසි ඇති විට Low Beam පමණක් දල්වන්න (High Beam මඟින් ආලෝකය පරාවර්තනය වේ).\n4. **Aquaplaning වළක්වා ගැනීම:** ජලය පිරුණු ස්ථානවලින් ධාවනය කිරීමේදී සුක්කානම එකවර නොකරකවන්න, එකවර තදින් බ්‍රේක් නොපාගන්න.`
          : language === 'ta'
          ? `🌧️ **மழைக்கால பாதுகாப்பான ஓட்டுநர் வழிகாட்டல்:**\n\n1. **வேகத்தைக் குறைக்கவும்:** 20-30% வேகத்தைக் குறைக்கவும்.\n2. **4-வினாடி இடைவெளி:** வாகனங்களுக்கிடையிலான இடைவெளியை 4 வினாடிகளாக அதிகரிக்கவும்.\n3. **Low Beam விளக்குகளைப் பயன்படுத்தவும்.**\n4. **Aquaplaning:** தண்ணீர்த் தேக்கங்களில் திடீரென பிரேக் அடிப்பதைத் தவிர்க்கவும்.`
          : `🌧️ **Safe Driving in Rain & Wet Weather:**\n\n1. **Reduce Speed:** Slow down by 20–30% below the normal speed limit to maintain tyre traction.\n2. **Double the Following Distance (4-Second Rule):** Wet asphalt increases braking distance significantly.\n3. **Use Dipped Headlights (Low Beam):** Enhances visibility to other drivers without blinding them in heavy rain or mist.\n4. **Avoid Hydroplaning (Aquaplaning):** Never slam on brakes or jerk the steering wheel when driving through standing water puddles. Ease off the accelerator gently.\n5. **Demist Windshields:** Turn on AC and windscreen defroster to prevent internal glass fogging.`,
      suggestions: ['Tyre Pressure Tips', 'Speed Limits in Sri Lanka', 'Brake Failure Emergency'],
    }
  }

  // Car Maintenance, Fluids, Tyres & Fuel
  if (
    cleanLower.includes('oil') ||
    cleanLower.includes('fuel') ||
    cleanLower.includes('petrol') ||
    cleanLower.includes('diesel') ||
    cleanLower.includes('tyre') ||
    cleanLower.includes('tire') ||
    cleanLower.includes('pressure') ||
    cleanLower.includes('service') ||
    cleanLower.includes('maintenance') ||
    cleanLower.includes('coolant') ||
    cleanLower.includes('battery')
  ) {
    return {
      text:
        language === 'si'
          ? `🔧 **වාහන නඩත්තුව සහ ඉන්ධන කාර්යක්ෂමතාව:**\n\n• 🛢️ **එන්ජින් ඔයිල්:** සෑම කිලෝමීටර් 5,000කට වරක් (Mineral) හෝ 10,000කට වරක් (Synthetic) මාරු කරන්න.\n• 🚗 **ටයර් පීඩනය (PSI):** සාමාන්‍යයෙන් 30-34 PSI මට්ටමක තබාගන්න (සෑම සති 2කට වරක්ම පරීක්ෂා කරන්න).\n• ⛽ **ඉන්ධන ඉතිරිය:** අධික ලෙස වේගය වැඩි කිරීමෙන් වළකින්න, AC එක අධික ශීතල මට්ටම්වල නොතබන්න, රථයේ අනවශ්‍ය බර අඩු කරන්න.\n• 🔋 **බැටරිය:** අග්‍රවල මලකඩ පිරිසිදු කර ස්ථාවරව තබාගන්න.`
          : language === 'ta'
          ? `🔧 **வாகனப் பராமரிப்பு & எரிபொருள் சேமிப்பு:**\n\n• 🛢️ **என்ஜின் எண்ணெய்:** 5,000 கி.மீ அல்லது 10,000 கி.மீ இற்கு ஒருமுறை மாற்றவும்.\n• 🚗 **டயர் காற்று அழுத்தம்:** 30-34 PSI அளவில் பேணவும்.\n• ⛽ **எரிபொருள் சேமிப்பு:** மிதமான வேகத்தில் சீராக ஓட்டவும்.\n• 🔋 **பேட்டரி:** முனைகளை சுத்தமாக வைத்திருக்கவும்.`
          : `🔧 **Essential Vehicle Maintenance & Fuel Economy:**\n\n1. **Engine Oil & Filter:** Change every 5,000 km (Mineral) or 10,000 km (Full Synthetic) to ensure engine longevity.\n2. **Tyre Pressure (PSI):** Maintain between 30–34 PSI (check your driver's door placard). Proper pressure improves fuel economy by up to 5% and prevents blowouts.\n3. **Fluid Checks:** Inspect Brake Fluid, Engine Coolant, and Transmission Fluid monthly.\n4. **Fuel-Saving Habits:** Accelerate smoothly, maintain 50–70 km/h cruising speed, and avoid excessive idling.\n5. **Battery Health:** Inspect battery terminals for white corrosion deposits and clean with warm water and baking soda.`,
      suggestions: ['Dashboard Warning Lights', 'How to Jumpstart a Car', 'Tyre Blowout Emergency'],
    }
  }

  // Police, Demerit Points, Fines & Law
  if (
    cleanLower.includes('police') ||
    cleanLower.includes('fine') ||
    cleanLower.includes('fines') ||
    cleanLower.includes('court') ||
    cleanLower.includes('penalty') ||
    cleanLower.includes('law') ||
    cleanLower.includes('legal') ||
    cleanLower.includes('demerit')
  ) {
    return {
      text:
        language === 'si'
          ? `👮 **ශ්‍රී ලංකා පොලිස් රථවාහන නීති සහ දඩ මුදල්:**\n\n1. **Spot Fines (ක්ෂණික දඩ):** දඩ පත්‍රිකාව ලැබී **දින 14ක් ඇතුළත** ඕනෑම තැපැල් කාර්යාලයකින් හෝ අන්තර්ජාලය හරහා ගෙවිය යුතුය.\n2. **දින 14 ඉක්මවුවහොත්:** අධිකරණයට ඉදිරිපත් වීමට සිදුවේ.\n3. **පොදු දඩ හේතු:** වලංගු ආදායම් බලපත්‍රයක් නොමැති වීම, ආසන පටි නොපැළඳීම, රිය ධාවනයේදී දුරකථන භාවිතය, වේග සීමා ඉක්මවීම, තනි/ද්විත්ව සුදු ඉරි කැපීම.\n4. **අනිවාර්ය ලිපිලේඛන:** රියදුරු බලපත්‍රය, වාහන ආදායම් බලපත්‍රය (Revenue License), සහ රක්ෂණ සහතිකය (Insurance Certificate) සැමවිටම ළඟ තබාගන්න.`
          : language === 'ta'
          ? `👮 **இலங்கை பொலிஸ் போக்குவரத்து அபராதங்கள்:**\n\n1. **Spot Fines:** 14 நாட்களுக்குள் தபால் நிலையத்தில் அல்லது ஆன்லைனில் செலுத்த வேண்டும்.\n2. **14 நாட்கள் கடந்தால்:** நீதிமன்றத்திற்குச் செல்ல நேரிடும்.\n3. **முக்கிய அபராதக் காரணங்கள்:** சீட்பெல்ட் அணியாமை, கையடக்கத் தொலைபேசி பயன்பாடு, அதிக வேகம், வெள்ளைக் கோடு மீறல்.\n4. **கட்டாய ஆவணங்கள்:** சாரதி அனுமதிப்பத்திரம், வருமான வரி அனுமதிப்பத்திரம் மற்றும் காப்புறுதிச் சான்றிதழ்.`
          : `👮 **Sri Lanka Traffic Police & Spot Fines Guide:**\n\n1. **Spot Fine Payment Window:** Spot fines must be paid within **14 days** at any Post Office in Sri Lanka or online via government payment portals.\n2. **Exceeding 14 Days:** If unpaid within 14 days, a court summons will be issued with added penalties.\n3. **Common Spot Fine Offenses:**\n   • Failure to wear seatbelts / helmets\n   • Using a mobile phone while driving\n   • Crossing solid white single/double continuous lines\n   • Speeding beyond legal limits\n   • Expired Revenue License or Insurance\n4. **Mandatory Documents to Carry:** Always keep your original Driver's License/Learner Permit, Vehicle Revenue License, and Insurance Card in the vehicle.`,
      suggestions: ['Speed Limits in Sri Lanka', 'Highway Code Rules', 'Insurance Types'],
    }
  }

  // Universal General Knowledge & Conversational Synthesizer
  // Formats thoughtful, polite, structured multi-topic responses
  if (language === 'si') {
    return {
      text: `💡 **විමසුම් සහාය:** "${query}"\n\nමෙම මාතෘකාව පිළිබඳ ප්‍රධාන කරුණු මෙසේය:\n\n• **ආරක්ෂාව සහ මූලික නීති:** සෑමවිටම මාර්ග නීති, පුද්ගලික ආරක්ෂාව සහ නීත්‍යානුකූල ක්‍රමවේද අනුගමනය කරන්න.\n• **පුහුණුව සහ සූදානම:** රියදුරු පරීක්ෂණ හෝ වෙනත් ඕනෑම කාර්යයකදී ප්‍රමාණවත් පෙර සූදානම සාර්ථකත්වයට මග පාදයි.\n• **වැඩිදුර තොරතුරු:** ඔබේ ශිෂ්‍ය පෝර්ටලය (\`/student/portal\`) හෝ Theory Hub (\`/theory\`) වෙතින් අදාළ තොරතුරු සවිස්තරාත්මකව ලබාගත හැක.\n\nඔබට පහත මාතෘකා පිළිබඳ වැඩිදුර විමසිය හැක:`,
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
      text: `💡 **தகவல் உதவி:** "${query}"\n\nஇது தொடர்பான முக்கிய குறிப்புகள்:\n\n• **பாதுகாப்பு & சட்ட விதிகள்:** எப்போதும் பாதுகாப்பு வழிகாட்டுதல்கள் மற்றும் சட்ட விதிமுறைகளைப் பின்பற்றுங்கள்.\n• **பயிற்சி & தயாரிப்பு:** சிறந்த தயாரிப்பு உங்கள் தேர்ச்சிக்கு உதவும்.\n• **மேலதிக தகவல்கள்:** Student Portal (\`/student/portal\`) அல்லது Theory Hub (\`/theory\`) இல் பார்வையிடலாம்.\n\nகீழே உள்ள தலைப்புகளைத் தேர்ந்தெடுத்து மேலும் அறியலாம்:`,
      suggestions: [
        'Student Portal Features',
        'Highway Code Rules',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    }
  }

  return {
    text: `💡 **Helpful Guidance on:** "${query}"

Here are the key takeaways and practical recommendations:

1. **Safety & Best Practices First:**
   • Always prioritize safety, legal adherence, and deliberate preparation in all driving and daily situations.
   • For mechanical or vehicle issues, refer to certified technicians and official vehicle handbooks.

2. **Driving Academy & Progress Support:**
   • If this relates to your license training, check your **Student Portal (\`/student/portal\`)** for lesson schedules, trial readiness metrics, and fee balances.
   • Practice official questions in the **Theory Hub (\`/theory\`)** for complete readiness.

3. **24/7 Availability:**
   • You can ask me anything further about Sri Lanka road laws, DMT trial maneuvers, or vehicle safety!

Feel free to choose a prompt below to continue:`,
    suggestions: [
      'Student Portal Features',
      'Highway Code Rules',
      'Hill Start Tips',
      'Accident Procedure',
      'Speed Limits in Sri Lanka',
    ],
  }
}
