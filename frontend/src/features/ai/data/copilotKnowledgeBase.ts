export interface KnowledgeItem {
  id: string
  category:
    | 'greetings'
    | 'student_portal'
    | 'theory_hub'
    | 'highway_code'
    | 'speed_limits'
    | 'traffic_lights'
    | 'road_signs'
    | 'roundabouts'
    | 'maneuvers'
    | 'trial_tips'
    | 'permits_regulations'
    | 'payments_fees'
    | 'sessions_schedule'
    | 'instructor_admin'
    | 'general'
  keywords: string[]
  question: {
    en: string
    si: string
    ta: string
  }
  answer: {
    en: string
    si: string
    ta: string
  }
  suggestions?: string[]
}

export const COPILOT_KNOWLEDGE_BASE: KnowledgeItem[] = [
  // --- GREETINGS & CASUAL ---
  {
    id: 'kb-greet-1',
    category: 'greetings',
    keywords: [
      'hi',
      'hello',
      'hey',
      'ayubowan',
      'vanakkam',
      'good morning',
      'good afternoon',
      'good evening',
      'sup',
      'greetings',
      'kohomada',
      'vanakkam',
    ],
    question: {
      en: 'Hello! How can you help me today?',
      si: 'ආයුබෝවන්! අද මට ඔබට උදව් කළ හැක්කේ කෙසේද?',
      ta: 'வணக்கம்! இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    },
    answer: {
      en: `👋 **Ayubowan / Vanakkam! Welcome to TrialReady.LK AI Copilot!**

I am your 24/7 intelligent driving assistant. Here is what I can help you with:

🚗 **Student Portal & Progress:**
• Check your booked driving lessons, assigned instructor, and vehicles.
• Track your Trial Readiness Score & Learner Journey milestones.
• View payment plans, installment receipts, and balance dues.

🚦 **Sri Lanka Highway Code & Theory:**
• Ask about Speed Limits, Traffic Lights, Road Signs, and Roundabout priority.
• Practice Computerized DMT Mock Exams (40 questions in EN/SI/TA).

🎯 **DMT Practical Trial Mastery:**
• Step-by-step techniques for Hill Start, Reverse S-Bend, and 3-Point Turns.
• Examiner scoring rubrics and common mistakes to avoid on trial day.

What would you like to explore today? Type any question or select a prompt above!`,
      si: `👋 **ආයුබෝවන්! TrialReady.LK AI Copilot වෙත සාදරයෙන් පිළිගනිමු!**

මම ඔබේ 24/7 බුද්ධිමත් රියදුරු සහායකයා වෙමි. මට ඔබට පහත දෑ සඳහා උදව් කළ හැකිය:

🚗 **ශිෂ්‍ය පෝර්ටලය (Student Portal) සහ ප්‍රගතිය:**
• නියමිත ප්‍රායෝගික පුහුණු සැසි, උපදේශක සහ වාහන තොරතුරු බැලීම.
• Trial Readiness ලකුණු මට්ටම සහ Learner Journey පියවර පරීක්ෂා කිරීම.
• ගෙවීම් වාරික, රිසිට්පත් සහ ඉතිරි මුදල් විස්තර.

🚦 **ශ්‍රී ලංකා මාර්ග නීති සංග්‍රහය (Highway Code) & Theory:**
• වේග සීමා, මාර්ග සංඥා, වටරවුම් නීති සහ මාර්ග සලකුණු.
• DMT ආදර්ශ පරිගණක ප්‍රශ්න පත්‍ර පුහුණුව (ප්‍රශ්න 40 - සිංහල/දෙමළ/ඉංග්‍රීසි).

🎯 **DMT ප්‍රායෝගික පරීක්ෂණය (Practical Trial):**
• කඳු නැගීම (Hill Start), ප්‍රතිවිරුද්ධ S-වංගුව (Reverse S-Bend) නිවැරදිව කරන ආකාරය.
• පරීක්ෂණ දිනයේදී සිදුවන පොදු වැරදි වළක්වා ගැනීම.

ඔබට දැනගැනීමට අවශ්‍ය ඕනෑම දෙයක් අසන්න!`,
      ta: `👋 **வணக்கம்! TrialReady.LK AI Copilot இற்கு உங்களை அன்புடன் வரவேற்கிறோம்!**

நான் உங்கள் 24/7 அறிவார்ந்த சாரதி பயிற்றுனர் உதவியாளர். நான் உங்களுக்கு பின்வருவனவற்றில் உதவ முடியும்:

🚗 **மாணவர் போர்ட்டல் (Student Portal) & முன்னேற்றம்:**
• உங்கள் நடைமுறை ஓட்டுநர் அமர்வுகள், ஒதுக்கப்பட்ட பயிற்றுனர் மற்றும் வாகன விவரங்கள்.
• Trial Readiness மதிப்பெண் மற்றும் கற்றல் மைல்கற்களைப் பார்வையிடல்.
• கட்டணத் தவணைகள், பற்றுச்சீட்டுகள் மற்றும் நிலுவைத் தொகை.

🚦 **இலங்கை நெடுஞ்சாலை விதிகள் (Highway Code) & Theory:**
• வேக வரம்புகள், போக்குவரத்து அடையாளங்கள், வட்டாரப் பாதை விதிகள்.
• DMT மாதிரி பரீட்சை பயிற்சி (40 வினாக்கள் - தமிழ்/சிங்களம்/ஆங்கிலம்).

🎯 **DMT செய்முறைப் பரீட்சை (Practical Trial):**
• Hill Start, Reverse S-Bend நுட்பங்கள் மற்றும் தவறுகளைத் தவிர்ப்பதற்கான வழிகள்.

உங்களுக்குத் தேவையான எந்தவொரு கேள்வியையும் கேட்கலாம்!`,
    },
    suggestions: ['Student Portal Features', 'Hill Start Tips', 'Highway Code', 'Mock Exam'],
  },

  {
    id: 'kb-who-are-you',
    category: 'greetings',
    keywords: [
      'who are you',
      'what are you',
      'what can you do',
      'introduce yourself',
      'help me',
      'about you',
      'chatbot',
    ],
    question: {
      en: 'Who are you and what can you do?',
      si: 'ඔබ කවුද සහ ඔබට කුමක් කළ හැකිද?',
      ta: 'நீங்கள் யார் மற்றும் நீங்கள் என்ன செய்ய முடியும்?',
    },
    answer: {
      en: `🤖 **I am the TrialReady.LK AI Driving Assistant & Copilot!**

I am specifically engineered to guide learner drivers, instructors, and driving academies across Sri Lanka.

**My Core Capabilities:**
1. **Student Portal Guide:** Helping students navigate schedules, payments, attendance, and exam readiness scores.
2. **Highway Code Expert:** Comprehensive knowledge of Sri Lanka Motor Traffic Act No. 14 of 1951 (and amendments), DMT traffic signs, speed limits, and road regulations.
3. **Practical Trial Coach:** Step-by-step guidance on DMT maneuvers (Hill Start, Reverse S-Bend, Parallel Parking).
4. **Trilingual Support:** Fluently answering in English, Sinhala (සිංහල), and Tamil (தமிழ்).

Feel free to ask me anything about your driving academy journey or traffic laws!`,
      si: `🤖 **මම TrialReady.LK AI රියදුරු සහායක Copilot වෙමි!**

ශ්‍රී ලංකාවේ ආධුනික රියදුරන්, උපදේශකවරුන් සහ රියදුරු පාසල් කළමනාකරණය සඳහා විශේෂයෙන් නිර්මාණය කර ඇත.

**මගේ ප්‍රධාන හැකියාවන්:**
1. **ශිෂ්‍ය පෝර්ටල් මගපෙන්වීම:** පුහුණු සැසි කාලසටහන, ගෙවීම්, සහ Trial Readiness ලකුණු පරික්ෂාව.
2. **මාර්ග නීති විශේෂඥතාව:** ශ්‍රී ලංකා මෝටර් රථ ප්‍රවාහන පනත, DMT මාර්ග සංඥා, වේග සීමා සහ රීති.
3. **ප්‍රායෝගික විභාග පුහුණුව:** Hill Start, Reverse S-Bend, Parallel Parking ක්‍රමවේද.
4. **භාෂා ත්‍රිත්ව සහාය:** සිංහල, දෙමළ සහ ඉංග්‍රීසි භාෂාවලින් සහාය ලබාදීම.`,
      ta: `🤖 **நான் TrialReady.LK AI சாரதி உதவியாளர் Copilot ஆவேன்!**

இலங்கையின் பயிலுனர் சாரதிகள் மற்றும் ஓட்டுநர் பாடசாலைகளுக்காக விசேடமாக உருவாக்கப்பட்டுள்ளேன்.

**எனது முக்கிய திறன்கள்:**
1. **மாணவர் போர்ட்டல் வழிகாட்டல்:** கால அட்டவணை, கட்டணங்கள் மற்றும் தயார்நிலை மதிப்பெண்கள்.
2. **நெடுஞ்சாலை விதிகள் நிபுணத்துவம்:** இலங்கை மோட்டார் போக்குவரத்து சட்டம், வீதி அடையாளங்கள், வேக வரம்புகள்.
3. **செய்முறைப் பரீட்சை வழிகாட்டல்:** Hill Start, Reverse S-Bend நுட்பங்கள்.
4. **மும்மொழி ஆதரவு:** தமிழ், சிங்களம் மற்றும் ஆங்கிலத்தில் பதிலளிக்கும் திறன்.`,
    },
  },

  // --- STUDENT PORTAL FEATURES ---
  {
    id: 'kb-student-portal-overview',
    category: 'student_portal',
    keywords: [
      'student portal',
      'student dashboard',
      'portal features',
      'what is in student portal',
      'how to use student portal',
      'student view',
      'portal',
      'my portal',
    ],
    question: {
      en: 'What features are available in the Student Portal and how do I use it?',
      si: 'ශිෂ්‍ය පෝර්ටලයේ ඇති විශේෂාංග මොනවාද සහ එය භාවිත කරන්නේ කෙසේද?',
      ta: 'மாணவர் போர்ட்டலில் என்ன அம்சங்கள் உள்ளன மற்றும் அதை எவ்வாறு பயன்படுத்துவது?',
    },
    answer: {
      en: `🎓 **TrialReady Student Portal Overview:**

The **Student Portal** (\`/student/portal\`) is your personal central dashboard for your entire driving license journey:

1. **📊 Trial Readiness & Progress Widget:**
   • Displays your current AI Readiness Score (0-100%).
   • Shows completed practical driving hours vs. target requirement (e.g. 15 hours).
   • Tracks your Learner Journey stage (e.g., Medical Clearance -> Learner Permit -> Practical Training -> Trial Ready).

2. **📅 Upcoming Practical Sessions:**
   • See your booked driving lessons with assigned instructor name, contact number, vehicle model, and transmission type (Manual/Auto).

3. **🚦 Computerized DMT Theory Hub:**
   • Direct access to practice 40-question mock exams with real DMT timers, road sign flashcards, and instant explanations.

4. **💳 Financials & Receipts:**
   • View your package cost, total paid installments, remaining balance, and generate official PDF payment receipts.

5. **📄 Compliance Tracking:**
   • Live countdown of your 6-month DMT Learner's Permit validity and NTMI Medical certificate status.`,
      si: `🎓 **ශිෂ්‍ය පෝර්ටලය (Student Portal) පිළිබඳ සම්පූර්ණ විස්තරය:**

**Student Portal** (\`/student/portal\`) යනු ඔබේ රියදුරු බලපත්‍ර ගමනේ සියලු තොරතුරු එක්තැන් කළ ප්‍රධාන පාලක පුවරුවයි:

1. **📊 Trial Readiness සහ ප්‍රගති දර්ශකය:**
   • ඔබේ වත්මන් AI Readiness ප්‍රතිශතය (0-100%).
   • සම්පූර්ණ කළ ප්‍රායෝගික පුහුණු පැය ගණන (උදා: පැය 15).
   • Learner Journey හි ඔබ සිටින වත්මන් පියවර (වෛද්‍ය සහතිකය -> ආධුනික බලපත්‍රය -> ප්‍රායෝගික පුහුණුව -> විභාගයට සුදානම්).

2. **📅 ඉදිරි පුහුණු සැසි (Upcoming Sessions):**
   • වෙන්කරවා ගත් රියදුරු පාඩම්, උපදේශකගේ නම, දුරකථන අංකය, වාහන අංකය සහ ගියර් වර්ගය (Manual/Auto).

3. **🚦 DMT Theory Hub & Mock Exam:**
   • ප්‍රශ්න 40 කින් සමන්විත පරිගණකගත ආදර්ශ විභාග, මාර්ග සංඥා flashcards.

4. **💳 ගෙවීම් සහ රිසිට්පත්:**
   • පාඨමාලා ගාස්තුව, ගෙවූ වාරික, ඉතිරි මුදල සහ නිල PDF රිසිට්පත් බාගත කිරීම.

5. **📄 නීතිමය වලංගුතාව:**
   • DMT ආධුනික බලපත්‍රයේ මාස 6ක කාලසීමාව සහ NTMI වෛද්‍ය සහතිකයේ තත්ත්වය.`,
      ta: `🎓 **மாணவர் போர்ட்டல் (Student Portal) கண்ணோட்டம்:**

**Student Portal** (\`/student/portal\`) உங்கள் ஓட்டுநர் உரிமப் பயணத்தின் பிரதான பக்கமாகும்:

1. **📊 Trial Readiness மற்றும் முன்னேற்றப் பலகை:**
   • உங்கள் தற்போதைய AI தயார்நிலை மதிப்பெண் (0-100%).
   • நிறைவு செய்யப்பட்ட நடைமுறை ஓட்டுநர் மணித்தியாலங்கள்.
   • உங்கள் கற்றல் பயணத்தின் மைல்கற்கள்.

2. **📅 வரவிருக்கும் செய்முறை அமர்வுகள்:**
   • பதிவு செய்யப்பட்ட ஓட்டுநர் பாடங்கள், பயிற்றுனர் பெயர், தொடர்பு எண் மற்றும் வாகன விவரங்கள்.

3. **🚦 DMT கணினி மாதிரிப் பரீட்சை:**
   • 40 வினாக்கள் கொண்ட மாதிரிப் பரீட்சைகள் மற்றும் வீதி அடையாள அட்டைகள்.

4. **💳 கட்டணங்கள் மற்றும் பற்றுச்சீட்டுகள்:**
   • செலுத்தப்பட்ட தவணைகள், நிலுவைத் தொகை மற்றும் PDF ரசீதுகள்.

5. **📄 ஆவண செல்லுபடித்தன்மை:**
   • 6 மாத DMT பயிலுனர் அனுமதிப்பத்திரம் மற்றும் NTMI மருத்துவச் சான்றிதழ் நிலை.`,
    },
    suggestions: ['How to check my sessions', 'How to view my payments', 'What is Readiness Score'],
  },

  // --- SESSIONS & LESSONS SCHEDULE ---
  {
    id: 'kb-sessions-schedule',
    category: 'sessions_schedule',
    keywords: [
      'session',
      'sessions',
      'schedule',
      'driving lesson',
      'lessons',
      'practical class',
      'booking',
      'when is my class',
      'how to book',
      'instructor name',
      'vehicle assigned',
      'check my session',
    ],
    question: {
      en: 'How do I check or schedule my practical driving sessions?',
      si: 'මගේ ප්‍රායෝගික රියදුරු පුහුණු සැසි පරීක්ෂා කරන්නේ හෝ වෙන්කරගන්නේ කෙසේද?',
      ta: 'எனது நடைமுறை ஓட்டுநர் அமர்வுகளை எவ்வாறு சரிபார்ப்பது அல்லது முன்பதிவு செய்வது?',
    },
    answer: {
      en: `📅 **Checking & Managing Practical Driving Sessions:**

• **In the Student Portal (\`/student/portal\`):**
  Check the **"Upcoming Practical Sessions"** section on your dashboard to see your confirmed date, time slot (e.g. 09:00 AM - 11:00 AM), assigned instructor, and training vehicle.

• **In the Sessions Calendar (\`/sessions\`):**
  View the interactive driving calendar to see scheduled slots, completed session hours, instructor feedback ratings, and lesson topics (e.g. Hill Start drill, S-Bend practice, City traffic driving).

• **Need to reschedule?**
  Contact your driving academy coordinator or designated instructor at least 24 hours in advance to change your time slot.`,
      si: `📅 **ප්‍රායෝගික රියදුරු පුහුණු සැසි පරීක්ෂා කිරීම:**

• **ශිෂ්‍ය පෝර්ටලය තුළින් (\`/student/portal\`):**
  ප්‍රධාන පුවරුවේ ඇති **"Upcoming Practical Sessions"** කොටසෙන් ඔබේ පුහුණු දිනය, වේලාව (උදා: පෙ.ව. 09:00 - 11:00), උපදේශකවරයා සහ පුහුණු වාහනය බලාගත හැක.

• **Sessions & Calendar පිටුවෙන් (\`/sessions\`):**
  සම්පූර්ණ කළ පුහුණු පැය ගණන, උපදේශකවරයා ලබාදුන් ලකුණු සහ ආවරණය කළ පාඩම් (Hill Start, Reverse S-Bend, නගර ධාවනය) සවිස්තරාත්මකව බැලිය හැක.

• **වේලාව වෙනස් කිරීමට අවශ්‍ය නම්:**
  පුහුණු සැසියට පැය 24කට පෙර ඔබේ රියදුරු පාසලේ සම්බන්ධීකාරක හෝ උපදේශක අමතන්න.`,
      ta: `📅 **செய்முறை ஓட்டுநர் அமர்வுகளைப் பார்வையிடல்:**

• **மாணவர் போர்ட்டலில் (\`/student/portal\`):**
  **"Upcoming Practical Sessions"** பகுதியில் உறுதிப்படுத்தப்பட்ட திகதி, நேரம், பயிற்றுனர் மற்றும் பயிற்சி வாகனத்தைக் காணலாம்.

• **Sessions Calendar பக்கத்தில் (\`/sessions\`):**
  நிறைவு செய்யப்பட்ட மணித்தியாலங்கள், பயிற்றுனரின் மதிப்பீடுகள் மற்றும் பயிற்சி தலைப்புகளைப் பார்க்கலாம்.`,
    },
    suggestions: ['Who is my instructor?', 'How many hours needed before trial?'],
  },

  // --- PAYMENTS & FEES ---
  {
    id: 'kb-payments-fees',
    category: 'payments_fees',
    keywords: [
      'payment',
      'payments',
      'fees',
      'cost',
      'receipt',
      'receipts',
      'installment',
      'balance',
      'how to pay',
      'financials',
      'course package',
      'pending fee',
    ],
    question: {
      en: 'How do I check my payment installments, fee balance, and download receipts?',
      si: 'මගේ ගෙවීම් වාරික, ඉතිරි මුදල සහ රිසිට්පත් පරීක්ෂා කරන්නේ කෙසේද?',
      ta: 'எனது கட்டணத் தவணைகள், நிலுவைத் தொகை மற்றும் ரசீதுகளை எவ்வாறு சரிபார்ப்பது?',
    },
    answer: {
      en: `💳 **Course Payments & Official Receipts:**

1. **Viewing Payments in Student Portal:**
   • Navigate to **Student Portal (\`/student/portal\`)** or **Financials (\`/financials\`)**.
   • You will see: Total Course Fee (e.g. LKR 45,000), Total Paid to date, and Outstanding Balance.

2. **Official Payment Receipts:**
   • Every time an installment is paid (Cash, Bank Transfer, or Card), an official digital receipt is recorded with a unique receipt number (e.g., \`REC-2026-0089\`).
   • Click the **"View Receipt"** button next to any transaction to preview and print or save the PDF receipt.

3. **Installment Schedules:**
   • Typical plans include: Initial Registration Deposit (40%), Midway Training Payment (30%), and Final Pre-Trial Clearance (30%).`,
      si: `💳 **පාඨමාලා ගෙවීම් සහ නිල රිසිට්පත්:**

1. **ගෙවීම් විස්තර බැලීම:**
   • **Student Portal (\`/student/portal\`)** හෝ **Financials (\`/financials\`)** වෙත පිවිසෙන්න.
   • සම්පූර්ණ පාඨමාලා ගාස්තුව (උදා: රු. 45,000), මේ දක්වා ගෙවූ මුදල සහ ඉතිරි ශේෂය දැකගත හැක.

2. **නිල රිසිට්පත් ලබාගැනීම:**
   • ඔබ ගෙවන සෑම වාරිකයකටම අදාළව නිල ඩිජිටල් රිසිට්පතක් (උදා: \`REC-2026-0089\`) නිකුත් කෙරේ.
   • ඕනෑම ගෙවීමක් අසල ඇති **"View Receipt"** බොත්තම ක්ලික් කර PDF රිසිට්පත මුද්‍රණය කරගන්න හෝ බාගත කරගන්න.`,
      ta: `💳 **கட்டணங்கள் மற்றும் உத்தியோகபூர்வ ரசீதுகள்:**

1. **கட்டண விவரங்களைப் பார்க்க:**
   • **Student Portal (\`/student/portal\`)** அல்லது **Financials (\`/financials\`)** பக்கத்திற்குச் செல்லவும்.
   • மொத்தக் கட்டணம், செலுத்தப்பட்ட தொகை மற்றும் நிலுவைத் தொகையைப் பார்க்கலாம்.

2. **ரசீதுகளைப் பதிவிறக்க:**
   • ஒவ்வொரு கட்டணத்திற்கும் உத்தியோகபூர்வ டிஜிட்டல் ரசீது உருவாக்கப்படும். **"View Receipt"** என்பதைக் கிளிக் செய்து PDF ரசீதைப் பெறலாம்.`,
    },
  },

  // --- TRIAL READINESS & LEARNER JOURNEY ---
  {
    id: 'kb-trial-readiness',
    category: 'trial_tips',
    keywords: [
      'readiness',
      'readiness score',
      'trial ready',
      'am i ready',
      'journey',
      'learner journey',
      'milestones',
      'how readiness is calculated',
      'percentage',
    ],
    question: {
      en: 'What is the AI Trial Readiness Score and how is it calculated?',
      si: 'AI Trial Readiness ලකුණු මට්ටම යනු කුමක්ද සහ එය ගණනය කරන්නේ කෙසේද?',
      ta: 'AI Trial Readiness மதிப்பெண் என்றால் என்ன மற்றும் அது எவ்வாறு கணக்கிடப்படுகிறது?',
    },
    answer: {
      en: `📊 **Understanding Your AI Trial Readiness Score:**

Your **Trial Readiness Score** is an automated metric that predicts your likelihood of passing the official DMT Practical Driving Trial on your first attempt.

**The Score is weighted across 4 key criteria:**
1. **Practical Hours Completed (35%):** Completion of mandatory 15+ in-car practical training hours.
2. **Instructor Competency Ratings (35%):** Mastery of critical maneuvers (Hill Start, Reverse S-Bend, Parking, Lane discipline, Clutch control).
3. **Computerized Theory Mock Average (20%):** Consistent scores of $\ge 30/40$ in DMT mock exams.
4. **Attendance & Discipline (10%):** Punctuality and consistent training frequency.

🎯 **Benchmark:** A score of **$\ge 80\%$** certifies you as **"Trial Ready"** to be booked for the official government trial!`,
      si: `📊 **AI Trial Readiness ලකුණු මට්ටම ගණනය කරන ආකාරය:**

ඔබේ **Trial Readiness Score** මඟින් ඔබ පළමු උත්සාහයෙන්ම DMT රියදුරු පරීක්ෂණය සමත්වීමේ සම්භාවිතාව පුරෝකථනය කරයි.

**එය ප්‍රධාන සාධක 4ක් මත පදනම් වේ:**
1. **ප්‍රායෝගික පුහුණු පැය (35%):** නියමිත පැය 15+ ක පුහුණුව සම්පූර්ණ කිරීම.
2. **උපදේශක ඇගයීම් (35%):** Hill Start, Reverse S-Bend, Parking සහ ක්ලච් පාලනය පිළිබඳ ප්‍රවීණතාව.
3. **DMT Theory Mock Exam සාමාන්‍යය (20%):** ආදර්ශ විභාගවලින් 30/40 කට වඩා ලබාගැනීම.
4. **පැමිණීම සහ විනය (10%):** නොකඩවා පුහුණු සැසිවලට සහභාගී වීම.

🎯 **ඉලක්කය:** ලකුණු **$\ge 80\%$** ක් ලබාගත් පසු ඔබව නිල DMT විභාගය සඳහා යොමු කෙරේ!`,
      ta: `📊 **AI Trial Readiness மதிப்பெண் முறைமை:**

உங்கள் **Trial Readiness Score** நீங்கள் முதல் முயற்சியிலேயே DMT செய்முறைப் பரீட்சையில் சித்தியடைவதற்கான வாய்ப்பைக் கணிக்கும்.

**4 முக்கிய அம்சங்கள்:**
1. **நடைமுறை பயிற்சி மணித்தியாலங்கள் (35%):** கட்டாய 15+ மணித்தியாலங்கள்.
2. **பயிற்றுனர் மதிப்பீடுகள் (35%):** Hill Start, Reverse S-Bend, Parking தேர்ச்சி.
3. **DMT மாதிரிப் பரீட்சை சராசரி (20%):** 30/40 இற்கு மேல் புள்ளிகள்.
4. **வருகை ஒழுக்கம் (10%):** தொடர்ச்சியான பயிற்சி.

🎯 **இலக்கு:** **$\ge 80\%$** பெற்றவுடன் நீங்கள் அரச பரீட்சைக்குத் தகுதி பெறுவீர்கள்!`,
    },
    suggestions: ['How to do Hill Start', 'Examiner checkpoints', 'Take Mock Exam'],
  },

  // --- DMT THEORY EXAM & MOCK SIMULATOR ---
  {
    id: 'kb-theory-exam-overview',
    category: 'theory_hub',
    keywords: [
      'theory exam',
      'mock exam',
      'theory practice hub',
      'theory test',
      'how many questions',
      'pass mark',
      'exam time',
      'theory pass mark',
      'dmt computerized test',
    ],
    question: {
      en: 'What is the format of the DMT Theory Exam and how do I practice?',
      si: 'DMT ලිඛිත/පරිගණක විභාගයේ ආකෘතිය කුමක්ද සහ එය පුහුණු වන්නේ කෙසේද?',
      ta: 'DMT கோட்பாட்டுப் பரீட்சையின் கட்டமைப்பு என்ன மற்றும் எவ்வாறு பயிற்சி பெறுவது?',
    },
    answer: {
      en: `🚦 **Official DMT Theory Exam Format in Sri Lanka:**

• **Total Questions:** 40 Multiple-Choice Questions (MCQs).
• **Pass Mark:** Minimum **30 correct answers out of 40** ($75\%$).
• **Time Allowed:** 45 Minutes.
• **Exam Medium:** Computerized touchscreen at DMT offices (Werahera & District Secretariats) available in **English, Sinhala, and Tamil**.

**Key Question Categories:**
1. Road Signs & Symbols (Mandatory, Warning, Priority, Guide).
2. Right of Way & Roundabouts rules.
3. Speed Limits & Safe Distance (2-second rule).
4. Motor Traffic Act regulations, Penalties, and Vehicle Mechanics basics.

💡 **How to practice:** Go to the **Theory Practice Hub (\`/theory\`)** or start a timed **Mock Exam Session (\`/theory/exam\`)** on TrialReady.LK!`,
      si: `🚦 **ශ්‍රී ලංකා DMT ලිඛිත/පරිගණක විභාග ආකෘතිය:**

• **මුළු ප්‍රශ්න ගණන:** බහුවරණ ප්‍රශ්න 40 (MCQs).
• **සමත් වීමේ ලකුණු:** ප්‍රශ්න **30ක් නිවැරදි විය යුතුය** ($75\%$).
• **ලබාදෙන කාලය:** මිනිත්තු 45.
• **භාෂා:** සිංහල, දෙමළ සහ ඉංග්‍රීසි.

**ප්‍රධාන විභාග මාතෘකා:**
1. මාර්ග සංඥා සහ සලකුණු (අනිවාර්ය, අනතුරු ඇඟවීමේ, තොරතුරු).
2. මාර්ග ප්‍රමුඛතාවය සහ වටරවුම් නීති.
3. වේග සීමා සහ 2-Second ආරක්ෂිත දුර රීතිය.
4. මෝටර් රථ ප්‍රවාහන පනතේ නීති රීති සහ දඩ මුදල්.

💡 **පුහුණු වීමට:** TrialReady.LK හි **Theory Hub (\`/theory\`)** හෝ **Mock Exam (\`/theory/exam\`)** වෙත පිවිසෙන්න!`,
      ta: `🚦 **இலங்கை DMT கோட்பாட்டுப் பரீட்சை முறை:**

• **மொத்த வினாக்கள்:** 40 பல்தேர்வு வினாக்கள் (MCQs).
• **சித்திபெற தேவையான புள்ளிகள்:** **30 சரியான விடைகள்** ($75\%$).
• **நேரம்:** 45 நிமிடங்கள்.
• **மொழிகள்:** தமிழ், சிங்களம், ஆங்கிலம்.

💡 **பயிற்சி பெற:** TrialReady.LK இன் **Theory Hub (\`/theory\`)** அல்லது **Mock Exam (\`/theory/exam\`)** இற்குச் செல்லுங்கள்!`,
    },
    suggestions: ['Highway Code Rules', 'Speed Limits in Sri Lanka', 'Road Signs Difference'],
  },

  // --- HIGHWAY CODE & ROAD REGULATIONS ---
  {
    id: 'kb-highway-code-general',
    category: 'highway_code',
    keywords: [
      'highway code',
      'highway codes in sri lanka',
      'sri lanka highway code',
      'road rules',
      'traffic rules',
      'general driving rules',
      'rules of the road',
      'give me highway codes in sri lanka',
    ],
    question: {
      en: 'What are the essential Highway Code rules in Sri Lanka?',
      si: 'ශ්‍රී ලංකාවේ ප්‍රධාන මාර්ග නීති (Highway Code) මොනවාද?',
      ta: 'இலங்கையின் முக்கிய நெடுஞ்சாலை விதிகள் யாவை?',
    },
    answer: {
      en: `🛣️ **Essential Sri Lanka Highway Code Rules:**

1. **Drive on the Left:** Always keep to the left side of the carriageway unless overtaking or turning right.
2. **Overtaking on the Right:** Overtake only on the RIGHT. Never overtake on a bend, crest of a hill, pedestrian crossing, or across solid white lines.
3. **Roundabout Priority:** Always give way to traffic approaching from your **RIGHT** inside the roundabout.
4. **2-Second Following Rule:** Maintain at least a 2-second gap behind the preceding vehicle in dry weather (increase to 4 seconds in rain/wet conditions).
5. **Speed Limits:**
   • Built-up / Urban areas: **50 km/h**
   • Non-urban / Rural roads: **70 km/h** (Cars/Vans)
   • Expressways (E01, E02, E03): **100 km/h max** (Minimum 50 km/h)
6. **Zero Tolerance:** Zero blood alcohol level for learner/novice drivers.
7. **Mobile Phones:** Strictly prohibited while driving (even hands-free while learning).
8. **Seatbelts:** Mandatory for driver and front-seat passenger at all times.`,
      si: `🛣️ **ශ්‍රී ලංකා මාර්ග නීති සංග්‍රහයේ (Highway Code) ප්‍රධාන කරුණු:**

1. **වමෙන් ධාවනය කරන්න:** සෑම විටම මාර්ගයේ වම් මංතීරුවේ ධාවනය කරන්න.
2. **දකුණෙන් ඉස්සර කරන්න:** ඉස්සර කිරීම (Overtaking) කළ යුත්තේ දකුණු පසින් පමණි. වංගුවලදී, කඳු මුදුන්වලදී, සීබ්‍රා ක්‍රොසිං සහ තනි/ද්විත්ව සුදු ඉරි මතින් කිසිවිටෙක ඉස්සර නොකරන්න.
3. **වටරවුම් ප්‍රමුඛතාව:** වටරවුමක් තුළ ඔබේ **දකුණු පසින්** එන වාහනවලට පළමුව ඉඩ දෙන්න.
4. **2-Second නීතිය:** ඉදිරියෙන් යන වාහනය සමඟ අවම වශයෙන් තත්පර 2ක ආරක්ෂිත දුරක් තබාගන්න (වැසි දිනවල තත්පර 4ක්).
5. **වේග සීමා:**
   • නාගරික ප්‍රදේශ: **50 km/h**
   • සාමාන්‍ය මහාමාර්ග: **70 km/h** (මෝටර් රථ/වෑන්)
   • අධිවේගී මාර්ග (Expressways): උපරිම **100 km/h** (අවම 50 km/h)
6. **ආසන පටි:** රියදුරු සහ ඉදිරිපස මගියා ආසන පටි (Seatbelts) පැළඳීම අනිවාර්ය වේ.
7. **ජංගම දුරකථන:** රිය ධාවනය අතරතුර භාවිතය සපුරා තහනම්ය.`,
      ta: `🛣️ **இலங்கை நெடுஞ்சாலை விதிகளின் முக்கிய அம்சங்கள்:**

1. **இடதுபுறமாக ஓட்டுங்கள்:** எப்போதும் வீதியின் இடதுபுறமாக வாகனத்தைச் செலுத்துங்கள்.
2. **வலதுபுறமாக முந்துங்கள்:** முந்துவது (Overtake) எப்போதும் வலதுபுறமாக மட்டுமே செய்யப்பட வேண்டும்.
3. **வட்டாரப் பாதை முன்னுரிமை:** வட்டாரப் பாதையில் உங்கள் **வலதுபுறத்தில்** இருந்து வரும் வாகனங்களுக்கு முன்னுரிமை அளியுங்கள்.
4. **2-வினாடி விதி:** முன்னால் செல்லும் வாகனத்திற்கும் உங்களுக்கும் இடையில் குறைந்தபட்சம் 2 வினாடி இடைவெளியைப் பேணுங்கள்.
5. **வேக வரம்புகள்:**
   • நகரப் பகுதிகள்: **50 km/h**
   • கிராமப்புற நெடுஞ்சாலைகள்: **70 km/h**
   • அதிவேக நெடுஞ்சாலைகள்: **100 km/h**
6. **இருக்கைப்பட்டை:** சாரதியும் முன்பக்கப் பயணியும் சீட்பெல்ட் அணிவது கட்டாயம்.`,
    },
    suggestions: ['Speed Limits in Sri Lanka', 'Roundabout Priority', 'Road Signs Difference'],
  },

  // --- SPEED LIMITS ---
  {
    id: 'kb-speed-limits',
    category: 'speed_limits',
    keywords: [
      'speed',
      'speed limit',
      'speed limits',
      'maximum speed',
      'expressway speed',
      'urban speed',
      'highway speed',
      'km/h',
      'speed in sri lanka',
    ],
    question: {
      en: 'What are the legal speed limits in Sri Lanka for different roads and vehicles?',
      si: 'ශ්‍රී ලංකාවේ විවිධ මාර්ග සහ වාහන සඳහා නීත්‍යානුකූල වේග සීමා මොනවාද?',
      ta: 'இலங்கையில் வெவ்வேறு வீதிகள் மற்றும் வாகனங்களுக்கான வேக வரம்புகள் யாவை?',
    },
    answer: {
      en: `⚡ **Legal Speed Limits in Sri Lanka (Motor Traffic Regulations):**

1. **Urban / Built-Up Areas (City roads marked by municipal limits):**
   • Cars, Dual-Purpose Vans, SUVs: **50 km/h**
   • Motorcycles: **40 km/h**
   • Buses, Heavy Lorries, Three-wheelers: **40 km/h**

2. **Non-Urban / Rural Highways:**
   • Cars, Dual-Purpose Vans: **70 km/h**
   • Motorcycles: **60 km/h**
   • Buses & Heavy Commercial Vehicles: **60 km/h**
   • Three-wheelers: **40 km/h**

3. **Expressways (Southern E01, Central E02/E04, Katunayake E03):**
   • Maximum Speed: **100 km/h**
   • Minimum Speed: **50 km/h**
   • Three-wheelers, Motorcycles $<50\text{cc}$, Tractors, and non-motorized vehicles are **strictly prohibited** on expressways.`,
      si: `⚡ **ශ්‍රී ලංකාවේ නීත්‍යානුකූල වේග සීමා:**

1. **නාගරික / ජනාකීර්ණ ප්‍රදේශ:**
   • මෝටර් රථ සහ වෑන්: **50 km/h**
   • යතුරුපැදි: **40 km/h**
   • බස්, ලොරි සහ ත්‍රිරෝද රථ: **40 km/h**

2. **නාගරික නොවන / සාමාන්‍ය මහාමාර්ග:**
   • මෝටර් රථ සහ වෑන්: **70 km/h**
   • යතුරුපැදි: **60 km/h**
   • බස් සහ ලොරි: **60 km/h**
   • ත්‍රිරෝද රථ: **40 km/h**

3. **අධිවේගී මාර්ග (Expressways):**
   • උපරිම වේගය: **100 km/h**
   • අවම වේගය: **50 km/h**`,
      ta: `⚡ **இலங்கையின் சட்டபூர்வ வேக வரம்புகள்:**

1. **நகரப் பகுதிகள்:**
   • கார்கள் & வான்கள்: **50 km/h**
   • மோட்டார் சைக்கிள்கள் & முச்சக்கர வண்டிகள்: **40 km/h**

2. **நெடுஞ்சாலைகள்:**
   • கார்கள் & வான்கள்: **70 km/h**
   • மோட்டார் சைக்கிள்கள்: **60 km/h**
   • முச்சக்கர வண்டிகள்: **40 km/h**

3. **அதிவேக நெடுஞ்சாலைகள்:**
   • அதிகபட்ச வேகம்: **100 km/h** | குறைந்தபட்ச வேகம்: **50 km/h**`,
    },
    suggestions: ['Traffic Lights Rules', 'Road Signs Difference'],
  },

  // --- TRAFFIC LIGHTS ---
  {
    id: 'kb-traffic-lights',
    category: 'traffic_lights',
    keywords: [
      'traffic light',
      'traffic lights',
      'red light',
      'amber light',
      'green light',
      'flashing amber',
      'traffic signal',
      'pelican crossing',
    ],
    question: {
      en: 'What do the traffic light sequences and signals mean in Sri Lanka?',
      si: 'ශ්‍රී ලංකාවේ මාර්ග සංඥා ලාම්පු (Traffic Lights) වල අර්ථය කුමක්ද?',
      ta: 'போக்குவரத்து சைகை விளக்குகளின் (Traffic Lights) அர்த்தம் என்ன?',
    },
    answer: {
      en: `🚦 **Traffic Light Signal Sequence & Meanings:**

1. 🔴 **RED Alone:**
   • **STOP.** You must not proceed beyond the stop line.

2. 🔴 + 🟡 **RED & AMBER Together:**
   • **PREPARE.** Indicates green is about to appear. You must NOT cross the line until Green shows.

3. 🟢 **GREEN Alone:**
   • **GO.** Proceed if the way is clear and you do not block the junction.

4. 🟡 **AMBER Alone:**
   • **STOP.** You must stop unless you are so close to the stop line that stopping suddenly would cause a collision.

5. 🟡✨ **Flashing AMBER (Pelican / Pedestrian Crossing):**
   • **GIVE WAY** to pedestrians who are on the crossing. If no pedestrians, you may proceed with caution.

6. 🟢➡️ **Green Arrow Filter:**
   • You may proceed in the direction indicated by the arrow, regardless of other signals.`,
      si: `🚦 **මාර්ග සංඥා ලාම්පු (Traffic Lights) වල අර්ථය:**

1. 🔴 **රතු පැහැය පමණක්:**
   • **නතර වන්න.** සුදු ඉරෙන් ඉදිරියට නොයන්න.

2. 🔴 + 🟡 **රතු සහ කහ එකවර දැල්වීම:**
   • **සුදානම් වන්න.** කොළ පැහැය දැල්වීමට ආසන්නයි. කොළ පැහැය ලැබෙන තුරු නොයන්න.

3. 🟢 **කොළ පැහැය:**
   • **ධාවනය කරන්න.** මංසන්ධිය අවහිර නොවන්නේ නම් ඉදිරියට යන්න.

4. 🟡 **කහ පැහැය පමණක්:**
   • **නතර වන්න.** හදිසි නැවතීමක් නිසා පිටුපස රථය හැපීමේ අවදානමක් ඇත්නම් පමණක් ප්‍රවේශමෙන් ඉදිරියට යන්න.

5. 🟡✨ **නිවෙමින් දැල්වෙන කහ පැහැය (Flashing Amber):**
   • පදික මාරුවේ සිටින පදිකයින්ට ප්‍රමුඛතාව දෙන්න. පදිකයින් නොමැති නම් ප්‍රවේශමෙන් ඉදිරියට යන්න.`,
      ta: `🚦 **போக்குவரத்து சைகை விளக்குகளின் அர்த்தம்:**

1. 🔴 **சிவப்பு:** நில்லுங்கள்.
2. 🔴 + 🟡 **சிவப்பு & மஞ்சள்:** புறப்படத் தயாராகுங்கள்.
3. 🟢 **பச்சை:** முன்னோக்கிச் செல்லுங்கள்.
4. 🟡 **மஞ்சள்:** நில்லுங்கள் (ஆபத்தான சூழல் தவிர).
5. 🟡✨ **மின்னும் மஞ்சள்:** பாதசாரிகளுக்கு முன்னுரிமை வழங்கி எச்சரிக்கையுடன் செல்லுங்கள்.`,
    },
  },

  // --- ROAD SIGNS ---
  {
    id: 'kb-road-signs',
    category: 'road_signs',
    keywords: [
      'road sign',
      'road signs',
      'signs',
      'circle sign',
      'triangle sign',
      'mandatory signs',
      'warning signs',
      'prohibitory',
      'difference between circle and triangle',
    ],
    question: {
      en: 'What are the main categories of road signs in Sri Lanka and how do I identify them?',
      si: 'ශ්‍රී ලංකාවේ ප්‍රධාන මාර්ග සංඥා කාණ්ඩ මොනවාද සහ ඒවා හඳුනාගන්නේ කෙසේද?',
      ta: 'இலங்கையின் வீதி அடையாளங்களின் வகைகள் மற்றும் அவற்றை எவ்வாறு அடையாளம் காண்பது?',
    },
    answer: {
      en: `🛑 **Sri Lanka Road Signs Classification:**

1. ⭕ **Circular Signs with RED Borders = MANDATORY / PROHIBITORY:**
   • Give orders you **MUST OBEY** by law.
   • *Examples:* No Entry, Maximum Speed (e.g. 50), No Overtaking, No Parking, No Left Turn.

2. 🔺 **Triangular Signs with RED Borders = WARNING / HAZARD:**
   • Alert you to potential dangers ahead so you can slow down.
   • *Examples:* Sharp Bend, Pedestrian Crossing ahead, Narrow Bridge, Roundabout ahead, Slippery Road.

3. 🔵 **Blue Circular Signs = POSITIVE MANDATORY:**
   • Tell you actions you MUST take.
   • *Examples:* Turn Left Only, Keep Left, Pass Either Side.

4. 🟦 / 🟩 **Rectangular / Square Signs = INFORMATORY / GUIDE:**
   • Provide helpful directions, distances, facilities, and services.
   • *Examples:* Hospital, Parking Place, Expressway destination boards (Green/Blue background).`,
      si: `🛑 **ශ්‍රී ලංකාවේ මාර්ග සංඥා වර්ගීකරණය:**

1. ⭕ **රතු මායිම් සහිත වෘත්තාකාර සංඥා = අනිවාර්ය / තහනම් නියෝග:**
   • නීතියෙන් **අනිවාර්යයෙන්ම පිළිපැදිය යුතු** නියෝග වේ.
   • *උදාහරණ:* ඇතුල්වීම තහනම්, උපරිම වේග සීමා (50), ඉස්සර කිරීම තහනම්, වාහන නැවැත්වීම තහනම්.

2. 🔺 **රතු මායිම් සහිත ත්‍රිකෝණාකාර සංඥා = අනතුරු ඇඟවීමේ සංඥා:**
   • ඉදිරියේ ඇති අනතුරු පිළිබඳ කල්තියා දැනුම් දෙයි.
   • *උදාහරණ:* තියුණු වංගු, පදික මාරුවක් ඉදිරියෙන්, පටු පාලමක්, ලිස්සන සුළු මාර්ගය.

3. 🔵 **නිල් පැහැති වෘත්තාකාර සංඥා = අනිවාර්ය ක්‍රියාකාරකම්:**
   • ඔබ කළ යුතු දේ දක්වයි (වමට පමණක් හැරෙන්න, වම් පසින් ධාවනය කරන්න).

4. 🟦 **සෘජුකෝණාස්‍රාකාර සංඥා = තොරතුරු සංඥා:**
   • රෝහල්, වාහන නැවතුම්, දුර ප්‍රමාණ සහ දිශා දක්වයි.`,
      ta: `🛑 **இலங்கை வீதி அடையாளங்களின் வகைகள்:**

1. ⭕ **சிவப்பு வட்ட அடையாளங்கள் = கட்டாய / தடை உத்தரவுகள்:**
   • கட்டாயம் பின்பற்ற வேண்டியவை (எ.கா: உட்செல்ல தடை, வேக வரம்பு, முந்த தடை).

2. 🔺 **சிவப்பு முக்கோண அடையாளங்கள் = எச்சரிக்கை அடையாளங்கள்:**
   • முன்னால் உள்ள ஆபத்துகள் (எ.கா: ஆபத்தான வளைவு, பாதசாரி கடவை, வழுக்கும் வீதி).

3. 🔵 **நீல வட்ட அடையாளங்கள் = கட்டாய திசை அடையாளங்கள்.**
4. 🟦 **செவ்வக அடையாளங்கள் = தகவல் அடையாளங்கள் (மருத்துவமனை, பார்க்கிங்).**`,
    },
  },

  // --- ROUNDABOUTS ---
  {
    id: 'kb-roundabouts',
    category: 'roundabouts',
    keywords: [
      'roundabout',
      'roundabouts',
      'right of way',
      'priority at roundabout',
      'how to use roundabout',
      'who goes first at roundabout',
    ],
    question: {
      en: 'Who has right of way at a roundabout and how do I navigate it?',
      si: 'වටරවුමකදී ප්‍රමුඛතාවය හිමිවන්නේ කාටද සහ නිවැරදිව ගමන් කරන්නේ කෙසේද?',
      ta: 'வட்டாரப் பாதையில் யாருக்கு முன்னுரிமை உண்டு மற்றும் அதை எவ்வாறு கடப்பது?',
    },
    answer: {
      en: `🔄 **Roundabout Rules & Right of Way in Sri Lanka:**

1. **Golden Rule:** Give way to all traffic approaching from your **RIGHT** already circulating within the roundabout.

2. **Lane Discipline & Signaling:**
   • **Turning Left (1st Exit):** Approach in the LEFT lane, signal LEFT on approach, keep left, exit with left signal.
   • **Going Straight (2nd Exit):** Approach in the LEFT or CENTER lane, NO signal on approach. Signal LEFT immediately after passing the 1st exit to leave.
   • **Turning Right or U-Turn (3rd+ Exit):** Approach in the RIGHT lane, signal RIGHT on approach. Keep right in the roundabout, signal LEFT after passing the exit before yours.

3. **Never overtake** or change lanes abruptly inside a roundabout.`,
      si: `🔄 **ශ්‍රී ලංකාවේ වටරවුම් නීති:**

1. **ප්‍රධාන රීතිය:** වටරවුම තුළ ඔබේ **දකුණු පසින්** පැමිණෙන සියලු රථවාහන සඳහා ප්‍රමුඛතාව ලබාදිය යුතුය.

2. **මංතීරු භාවිතය සහ සංඥා (Indicators):**
   • **වමට හැරීම (1 වන පිටවීම):** වම් මංතීරුවෙන් ඇතුළු වන්න, වම් සිග්නල් දමන්න, වම් මංතීරුවෙන් පිටවන්න.
   • **කෙළින්ම ඉදිරියට (2 වන පිටවීම):** වම් හෝ මැද මංතීරුවෙන් ඇතුළු වන්න. ඇතුල්වීමේදී සිග්නල් අවශ්‍ය නොවේ. 1 වන පිටවීම පසුකළ වහාම වම් සිග්නල් දමා පිටවන්න.
   • **දකුණට හැරීම / U-Turn:** දකුණු මංතීරුවෙන් ඇතුළු වන්න, දකුණු සිග්නල් දමන්න. පිටවීමට පෙර වම් සිග්නල් දමා පිටවන්න.`,
      ta: `🔄 **வட்டாரப் பாதை விதிகள்:**

1. **முக்கிய விதி:** உங்கள் **வலதுபுறத்தில்** இருந்து வரும் வாகனங்களுக்கு முன்னுரிமை கொடுங்கள்.
2. **இடது திரும்ப:** இடது ஒழுங்கையில் வந்து இடது சைகை காட்டவும்.
3. **நேராகச் செல்ல:** சைகை இல்லாமல் நுழைந்து, முதல் வெளியேற்றத்தைக் கடந்ததும் இடது சைகை காட்டி வெளியேறவும்.
4. **வலது திரும்ப:** வலது ஒழுங்கையில் வலது சைகையுடன் நுழைந்து, தேவையான வெளியேற்றத்திற்கு முன் இடது சைகை காட்டி வெளியேறவும்.`,
    },
  },

  // --- HILL START MANEUVER ---
  {
    id: 'kb-hill-start',
    category: 'maneuvers',
    keywords: [
      'hill start',
      'gradient',
      'slope',
      'rollback',
      'clutch biting point',
      'how to hill start',
      'kandu',
      'handbrake',
    ],
    question: {
      en: 'How do I execute a flawless Hill Start without vehicle rollback?',
      si: 'රථය පසුපසට නොගොස් කඳු නැගීම (Hill Start) නිවැරදිව කරන්නේ කෙසේද?',
      ta: 'வாகனம் பின்னோக்கிச் செல்லாமல் மேடேறுவது (Hill Start) எப்படி?',
    },
    answer: {
      en: `⛰️ **Step-by-Step Guide to a Perfect Hill Start:**

1. **Secure the Vehicle:** Apply the handbrake firmly and press down the footbrake & clutch.
2. **Select 1st Gear:** Shift the gear lever into 1st gear.
3. **Set the Accelerator:** Gently press the accelerator to hold a steady 1,500 – 2,000 RPM.
4. **Find the Clutch Biting Point:** Slowly lift your left foot off the clutch until the engine note deepens slightly and the front of the car lifts marginally. Hold both feet completely still.
5. **Observation:** Check your rearview mirror, right side mirror, and blind spots.
6. **Smooth Release:** Press the handbrake button, smoothly release the handbrake down. The car will move forward steadily without rolling back an inch!`,
      si: `⛰️ **කඳු නැගීම (Hill Start) නිවැරදිව කරන පියවර:**

1. **රථය නවත්වා තබාගන්න:** හෑන්ඩ්බ්‍රේක් (Handbrake) තදින් යොදන්න. ක්ලච් සහ ෆුට්බ්‍රේක් සම්පූර්ණයෙන්ම පාගන්න.
2. **1 වන ගියරය යොදන්න:** ගියර් ලිවරය 1st Gear වෙත දමන්න.
3. **ඇක්සලරේටරය සුදානම් කරන්න:** ඇක්සලරේටරය මඳක් පාගා RPM 1500-2000 මට්ටමක ස්ථාවරව තබාගන්න.
4. **ක්ලච් බයිටිං පොයින්ට් (Biting Point):** ක්ලච් එක සෙමින් උඩට ගන්න. එන්ජින් ශබ්දය මඳක් වෙනස් වී වාහනයේ ඉදිරිපස සුළු වශයෙන් එසවෙන ස්ථානයේදී දෙපා ස්ථාවරව තබාගන්න.
5. **දෙපස නිරීක්ෂණය:** කණ්නාඩි සහ අන්ධ කලාප (Blind spots) පරීක්ෂා කරන්න.
6. **හෑන්ඩ්බ්‍රේක් මුදාහරින්න:** හෑන්ඩ්බ්‍රේක් එක පහතට දමන්න. රථය කිසිදු පසුපසට පෙරලීමකින් තොරව ඉදිරියට ගමන් කරනු ඇත!`,
      ta: `⛰️ **Hill Start மேடேறும் முறை:**

1. ஹேண்ட்பிரேக்கை (Handbrake) உறுதியாக இழுத்து, கிளட்ச் மற்றும் பிரேக்கை அழுத்தவும்.
2. 1வது கியரில் போடவும்.
3. எக்ஸிலேட்டரை 1500-2000 RPM வரை மெதுவாக அழுத்தவும்.
4. கிளட்சை பைட்டிங் பாயிண்ட் (Biting point) வரை மெதுவாக உயர்த்துங்கள்.
5. கண்ணாடிகளைப் பார்த்துவிட்டு, ஹேண்ட்பிரேக்கை மெதுவாக விடுவிக்கவும். வாகனம் பின்னோக்கிச் செல்லாமல் முன்னோக்கி நகரும்!`,
    },
    suggestions: ['Reverse S-Bend Tips', 'Examiner Failure Criteria'],
  },

  // --- REVERSE S-BEND MANEUVER ---
  {
    id: 'kb-reverse-s-bend',
    category: 'maneuvers',
    keywords: [
      'reverse s',
      'reverse s bend',
      's bend',
      'serpentine',
      'reverse test',
      'cones',
      'how to do reverse s',
    ],
    question: {
      en: 'What are the examiner checkpoints and tips for the Reverse S-Bend maneuver?',
      si: 'ප්‍රතිවිරුද්ධ S-වංගුව (Reverse S-Bend) විභාගයේදී පරීක්ෂකවරයා අවධානය යොමුකරන කරුණු මොනවාද?',
      ta: 'ரிவர்ஸ் S-வளைவு (Reverse S-Bend) பரீட்சைக்கான முக்கிய குறிப்புகள் யாவை?',
    },
    answer: {
      en: `🔄 **Mastering the DMT Reverse S-Bend Maneuver:**

**Examiner Checkpoints:**
• **Zero Cone Hits:** Touching or knocking down boundary poles/cones is an **instant failure**.
• **Clutch Crawl Speed:** Maintain a slow, walking-pace speed solely using clutch control.
• **Mirror & Window Observation:** Check both side mirrors continuously. Never open doors or unbuckle your seatbelt.
• **Smooth Steering Transfer:** Smooth transition of steering wheel locks between the first arc (left) and second arc (right).

**Pro-Tips:**
1. Keep the vehicle centered between the boundary cones.
2. Steer towards the mirror where you see more space between the rear tyre and boundary line.`,
      si: `🔄 **DMT Reverse S-Bend පරීක්ෂණය:**

**පරීක්ෂකවරයා පරීක්ෂා කරන කරුණු:**
• **කෝන් නොහැපීම:** මායිම් කෝන් හෝ කණු ස්පර්ශ කිරීම හෝ පෙරලීම **ක්ෂණික අසමත්වීමකි (Instant Fail)**.
• **ක්ලච් මඟින් වේගය පාලනය:** ඉතා අඩු වේගයකින් (ඇවිදින වේගයෙන්) රථය පාලනය කරන්න.
• **කණ්නාඩි නිරීක්ෂණය:** දෙපස කණ්නාඩි නිරන්තරයෙන් නිරීක්ෂණය කරන්න. දොරවල් විවෘත කිරීම හෝ සීට්බෙල්ට් ගැලවීම නොකරන්න.
• **සුක්කානම හැසිරවීම:** පළමු වංගුවේ සිට දෙවන වංගුවට සුක්කානම සුමටව කරකවන්න.`,
      ta: `🔄 **Reverse S-Bend பரீட்சை குறிப்புகள்:**

• கூம்புகளில் முட்டக்கூடாது (முட்டினால் உடனடி தோல்வி).
• கிளட்ச் மூலம் மிகக் குறைந்த வேகத்தில் வாகனத்தைக் கட்டுப்படுத்துங்கள்.
• பக்கவாட்டுக் கண்ணாடிகளைத் தொடர்ந்து கவனியுங்கள்.`,
    },
  },

  // --- DMT PERMIT & REGULATIONS ---
  {
    id: 'kb-permits-regulations',
    category: 'permits_regulations',
    keywords: [
      'permit',
      'learner permit',
      'permit validity',
      '6 months',
      'ntmi',
      'medical',
      'ntmi medical',
      'renew permit',
      'license classes',
      'class b',
      'class a',
      'waiting period',
    ],
    question: {
      en: 'What are the rules regarding DMT Learner Permits, NTMI Medical, and license classes in Sri Lanka?',
      si: 'ශ්‍රී ලංකාවේ DMT ආධුනික බලපත්‍ර, NTMI වෛද්‍ය සහතික සහ බලපත්‍ර පන්ති පිළිබඳ නීති මොනවාද?',
      ta: 'DMT பயிலுனர் அனுமதிப்பத்திரம், NTMI மருத்துவம் மற்றும் உரிமப் பிரிவுகள் பற்றிய விதிகள் யாவை?',
    },
    answer: {
      en: `📋 **DMT Permits, Medical & Licensing Regulations in Sri Lanka:**

1. **NTMI Medical Certificate:**
   • Issued by the National Transport Medical Institute (e.g. Nugegoda, Werahara, Kandy).
   • Valid for **6 months**. Tests eyesight, color blindness, physical coordination, and blood group.

2. **DMT Learner Permit Validity:**
   • Valid for **6 months (180 days)** from the date of issue.
   • Mandatory waiting period: You can appear for your practical trial **3 months** after receiving your learner permit.
   • If your permit expires, you must renew it at the DMT before taking the trial.

3. **Common License Classes:**
   • **Class B:** Dual Purpose Vehicles / Cars up to 3500kg (Manual or Auto).
   • **Class B1:** Auto-rickshaw (Three-wheeler).
   • **Class A / A1:** Motorcycles (A: $>100\text{cc}$, A1: $\le 100\text{cc}$).
   • **Class C / C1:** Commercial Heavy Vehicles / Lorries.`,
      si: `📋 **DMT ආධුනික බලපත්‍ර සහ වෛද්‍ය සහතික නීති:**

1. **NTMI වෛද්‍ය සහතිකය:**
   • ජාතික ප්‍රවාහන වෛද්‍ය ආයතනය (NTMI) මඟින් නිකුත් කෙරේ.
   • වලංගු කාලය: **මාස 6කි**. ඇස් පෙනීම, වර්ණ අන්ධතාව සහ රුධිර ගණය පරීක්ෂා කෙරේ.

2. **DMT ආධුනික බලපත්‍රය (Learner Permit):**
   • වලංගු කාලය: **මාස 6කි (දින 180)**.
   • බලපත්‍රය ලබාගෙන **මාස 3කට පසුව** ප්‍රායෝගික පරීක්ෂණයට (Trial) පෙනී සිටිය හැක.
   • කල් ඉකුත් වුවහොත් DMT කාර්යාලයෙන් අලුත් කරගත යුතුය.

3. **ප්‍රධාන බලපත්‍ර පන්ති:**
   • **Class B:** මෝටර් රථ සහ වෑන් (Manual / Auto).
   • **Class B1:** ත්‍රිරෝද රථ.
   • **Class A / A1:** යතුරුපැදි.`,
      ta: `📋 **DMT பயிலுனர் அனுமதிப்பத்திரம் & மருத்துவ விதிகள்:**

1. **NTMI மருத்துவச் சான்றிதழ்:** 6 மாதங்களுக்குச் செல்லுபடியாகும்.
2. **பயிலுனர் அனுமதிப்பத்திரம்:** 6 மாதங்கள் (180 நாட்கள்) செல்லுபடியாகும். அனுமதிப்பத்திரம் பெற்று 3 மாதங்களின் பின் செய்முறைப் பரீட்சைக்குத் தோற்றலாம்.
3. **உரிமப் பிரிவுகள்:** Class B (கார்கள்), Class B1 (முச்சக்கர வண்டி), Class A (மோட்டார் சைக்கிள்).`,
    },
  },
]
