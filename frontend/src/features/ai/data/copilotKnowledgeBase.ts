export interface KnowledgeItem {
  id: string
  category:
    | 'greetings'
    | 'student_portal'
    | 'instructor_admin'
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
    | 'emergencies_safety'
    | 'maintenance_mechanics'
    | 'insurance_police'
    | 'general_knowledge'
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
    ],
    question: {
      en: 'Hello! How can you help me today?',
      si: 'ආයුබෝවන්! අද මට ඔබට උදව් කළ හැක්කේ කෙසේද?',
      ta: 'வணக்கம்! இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    },
    answer: {
      en: `👋 **Ayubowan / Vanakkam! Welcome to TrialReady.LK AI Copilot!**

I am your 24/7 intelligent driving and general assistant. Here is what I can help you with:

🎓 **Student Portal & Progress:**
• Check booked driving lessons, assigned instructor, and vehicles.
• Track your Trial Readiness Score & Learner Journey milestones.
• View payment plans, installment receipts, and balance dues.

🚦 **Sri Lanka Highway Code & Theory:**
• Ask about Speed Limits, Traffic Lights, Road Signs, and Roundabouts.
• Practice Computerized DMT Mock Exams (40 questions in EN/SI/TA).

🚗 **DMT Practical Trial Mastery:**
• Step-by-step techniques for Hill Start, Reverse S-Bend, and 3-Point Turns.
• Examiner scoring rubrics and common mistakes to avoid on trial day.

🔧 **Safety, Emergencies & Vehicle Care:**
• What to do in accidents, brake failures, tyre punctures, jumpstarts, and warning lights.

Feel free to ask me any question!`,
      si: `👋 **ආයුබෝවන්! TrialReady.LK AI Copilot වෙත සාදරයෙන් පිළිගනිමු!**

මම ඔබේ 24/7 බුද්ධිමත් රියදුරු සහ සාමාන්‍ය දැනුම සහායකයා වෙමි:

🎓 **ශිෂ්‍ය පෝර්ටලය (Student Portal) සහ ප්‍රගතිය:**
• නියමිත ප්‍රායෝගික පුහුණු සැසි, උපදේශක සහ වාහන තොරතුරු බැලීම.
• Trial Readiness ලකුණු මට්ටම සහ Learner Journey පියවර පරීක්ෂා කිරීම.
• ගෙවීම් වාරික, රිසිට්පත් සහ ඉතිරි මුදල් විස්තර.

🚦 **ශ්‍රී ලංකා මාර්ග නීති සංග්‍රහය (Highway Code) & Theory:**
• වේග සීමා, මාර්ග සංඥා, වටරවුම් නීති සහ මාර්ග සලකුණු.
• DMT ආදර්ශ පරිගණක ප්‍රශ්න පත්‍ර පුහුණුව (ප්‍රශ්න 40 - සිංහල/දෙමළ/ඉංග්‍රීසි).

🚗 **DMT ප්‍රායෝගික පරීක්ෂණය (Practical Trial):**
• කඳු නැගීම (Hill Start), ප්‍රතිවිරුද්ධ S-වංගුව (Reverse S-Bend) නිවැරදිව කරන ආකාරය.

🔧 **හදිසි අවස්ථා සහ වාහන නඩත්තුව:**
• තිරිංග අක්‍රිය වීම, ටයර් පිපිරීම්, බැටරි ජම්ප් ස්ටාර්ට් සහ අනතුරු අවස්ථා.`,
      ta: `👋 **வணக்கம்! TrialReady.LK AI Copilot இற்கு உங்களை அன்புடன் வரவேற்கிறோம்!**

நான் உங்கள் 24/7 அறிவார்ந்த சாரதி மற்றும் பொது அறிவு உதவியாளர்:

🎓 **மாணவர் போர்ட்டல் (Student Portal) & முன்னேற்றம்:**
• செய்முறை ஓட்டுநர் அமர்வுகள், பயிற்றுனர் மற்றும் வாகன விவரங்கள்.
• Trial Readiness மதிப்பெண் மற்றும் கற்றல் மைல்கற்கள்.
• கட்டணத் தவணைகள், பற்றுச்சீட்டுகள் மற்றும் நிலுவைத் தொகை.

🚦 **இலங்கை நெடுஞ்சாலை விதிகள் & Theory:**
• வேக வரம்புகள், போக்குவரத்து அடையாளங்கள், DMT மாதிரிப் பரீட்சை.

🚗 **செய்முறைப் பரீட்சை (Practical Trial):**
• Hill Start, Reverse S-Bend நுட்பங்கள் மற்றும் தவறுகளைத் தவிர்த்தல்.

🔧 **அவசரநிலைகள் & வாகனப் பராமரிப்பு:**
• விபத்துக்கள், பிரேக் செயலிழப்பு மற்றும் டயர் வெடிப்பு வழிகாட்டல்.`,
    },
    suggestions: ['Student Portal Features', 'Highway Code Rules', 'Hill Start Tips', 'Accident Procedure'],
  },

  // --- ADMINISTRATOR PORTAL ---
  {
    id: 'kb-admin-portal',
    category: 'instructor_admin' as const,
    keywords: [
      'admin',
      'admin portal',
      'administrator',
      'administrator portal',
      'admin access',
      'how to get access to admin portal',
      'how to get access to the admin portal',
      'how toget access ti the admin portal',
      'admin dashboard',
      'admin role',
      'admin permissions',
      'admin features',
      'academy management',
    ],
    question: {
      en: 'How do I access the Administrator Portal and what can administrators do?',
      si: 'පරිපාලක පෝර්ටලයට (Admin Portal) පිවිසෙන්නේ කෙසේද සහ පරිපාලක බලතල මොනවාද?',
      ta: 'நிர்வாகி போர்ட்டலை (Admin Portal) எவ்வாறு அணுகுவது மற்றும் அதன் அதிகாரங்கள் யாவை?',
    },
    answer: {
      en: `🏢 **Administrator Portal Access & Academy Management:**

To access the **Admin Portal**, log in with an Administrator account credentials at \`/login\` and navigate to the **Main Dashboard (\`/dashboard\`)**.

**Administrator Powers & Capabilities:**
1. **👥 Student & Instructor Management (\`/students\`, \`/instructors\`):**
   • Enroll new learner drivers, verify NIC and NTMI medical records, and assign dedicated instructors.
   • Manage instructor workloads and driving rosters.

2. **🚗 Vehicle Fleet Management (\`/vehicles\`):**
   • Register training vehicles, manage maintenance schedules, fuel logs, and insurance renewals.

3. **💳 Tuition Ledgers & Financials (\`/financials\`):**
   • Set up course package rates, record payment installments (Cash/Card/Bank Transfer), generate official receipts, and monitor arrears.

4. **🚦 Theory Exam & Question Bank Management (\`/theory\`):**
   • Full authority to create, edit, delete, and shuffle DMT theory questions, mock exam papers, and road sign flashcards.

5. **📈 Executive Analytics & DMT Audit (\`/analytics\`):**
   • Monitor first-time trial pass rates, readiness score distributions, and export official government compliance reports.`,
      si: `🏢 **පරිපාලක පෝර්ටලය (Admin Portal) සහ කළමනාකරණ බලතල:**

**Admin Portal** වෙත පිවිසීමට පරිපාලක (Administrator) ගිණුමකින් \`/login\` හරහා ලොග් වී ප්‍රධාන **Dashboard (\`/dashboard\`)** වෙත පිවිසෙන්න.

**පරිපාලකවරයෙකුට ඇති ප්‍රධාන බලතල:**
1. **👥 ශිෂ්‍ය සහ උපදේශක කළමනාකරණය (\`/students\`, \`/instructors\`):** නව සිසුන් ලියාපදිංචිය, ජා.හැ./වෛද්‍ය සහතික පරීක්ෂාව සහ උපදේශකවරුන් අනුයුක්ත කිරීම.
2. **🚗 වාහන කළමනාකරණය (\`/vehicles\`):** පුහුණු වාහන, නඩත්තු කාලසටහන් සහ රක්ෂණ තොරතුරු.
3. **💳 මූල්‍ය සහ ගාස්තු (\`/financials\`):** පාඨමාලා ගාස්තු, වාරික ගෙවීම් වාර්තා කිරීම සහ නිල රිසිට්පත් නිකුත් කිරීම.
4. **🚦 Theory ප්‍රශ්නාවලී කළමනාකරණය (\`/theory\`):** DMT විභාග ප්‍රශ්න සහ මාර්ග සංඥා flashcards සංස්කරණය, එකතු කිරීම සහ පාලනය.
5. **📈 විශ්ලේෂණ වාර්තා (\`/analytics\`):** විභාග සමත් ප්‍රතිශත සහ රජයේ විගණන වාර්තා ලබාගැනීම.`,
      ta: `🏢 **நிர்வாகி போர்ட்டல் (Admin Portal) அணுகல் & அதிகாரங்கள்:**

**Admin Portal** ஐ அணுக நிர்வாகி கணக்கு மூலம் \`/login\` செய்து **Dashboard (\`/dashboard\`)** பக்கத்திற்குச் செல்லவும்.

**நிர்வாகியின் முக்கிய அதிகாரங்கள்:**
1. **👥 மாணவர் & பயிற்றுனர் மேலாண்மை (\`/students\`, \`/instructors\`):** புதிய மாணவர் சேர்க்கை, ஆவண சரிபார்ப்பு.
2. **🚗 வாகனப் பராமரிப்பு (\`/vehicles\`):** பயிற்சி வாகனங்கள் மற்றும் காப்புறுதி விபரங்கள்.
3. **💳 கட்டணங்கள் & நிதி மேலாண்மை (\`/financials\`):** கட்டண வசூல், ரசீதுகள் வழங்கல்.
4. **🚦 Theory பரீட்சை வினாக்கள் மேலாண்மை (\`/theory\`):** DMT வினாக்களைத் திருத்துதல் மற்றும் சேர்த்தல்.
5. **📈 பகுப்பாய்வு அறிக்கைகள் (\`/analytics\`):** தேர்ச்சி விகிதங்கள் மற்றும் அறிக்கைகள்.`,
    },
    suggestions: ['Instructor Portal Features', 'Student Portal Features', 'Financial Management'],
  },

  // --- INSTRUCTOR PORTAL ---
  {
    id: 'kb-instructor-portal',
    category: 'instructor_admin' as const,
    keywords: [
      'instructor portal',
      'instructor dashboard',
      'instructor access',
      'how to access instructor portal',
      'instructor features',
      'instructor role',
      'instructor schedule',
    ],
    question: {
      en: 'How do I access the Instructor Portal and what can instructors do?',
      si: 'උපදේශක පෝර්ටලයට (Instructor Portal) පිවිසෙන්නේ කෙසේද සහ එහි විශේෂාංග මොනවාද?',
      ta: 'பயிற்றுனர் போர்ட்டலை (Instructor Portal) எவ்வாறு அணுகுவது மற்றும் அதன் அம்சங்கள் யாவை?',
    },
    answer: {
      en: `👨‍🏫 **Instructor Portal Access & Daily Agenda:**

To access the **Instructor Portal**, log in with an Instructor account at \`/login\` and navigate to **Instructor Portal (\`/instructor/portal\`)**.

**Instructor Features & Tasks:**
1. **📅 Daily Driving Agenda:** View confirmed student driving lessons for today, assigned vehicles, and pick-up locations.
2. **⭐ Practical Scoring & Feedback:** Log student odometer distance, rate critical maneuvers (Hill Start, Reverse S-Bend, Parallel Parking), and write pedagogical notes.
3. **📊 Readiness Endorsement:** Verify when a student reaches $\ge 80\%$ readiness to recommend them for official government trial tests.`,
      si: `👨‍🏫 **උපදේශක පෝර්ටලය (Instructor Portal):**

**Instructor Portal** වෙත පිවිසීමට උපදේශක ගිණුමකින් \`/login\` හරහා ලොග් වී **Instructor Portal (\`/instructor/portal\`)** වෙත පිවිසෙන්න.

**උපදේශක විශේෂාංග:**
1. **📅 දෛනික කාලසටහන:** අද දිනට නියමිත රියදුරු පාඩම්, සිසුන් සහ වාහන විස්තර.
2. **⭐ ලකුණු සහ ඇගයීම්:** Hill Start, Reverse S-Bend සඳහා ශිෂ්‍යයාට ලකුණු ලබාදීම සහ උපදෙස් සටහන් කිරීම.
3. **📊 Trial සඳහා නිර්දේශ කිරීම:** ලකුණු 80% ඉක්මවූ සිසුන් නිල විභාගයට නිර්දේශ කිරීම.`,
      ta: `👨‍🏫 **பயிற்றுனர் போர்ட்டல் (Instructor Portal):**

**Instructor Portal** ஐ அணுக \`/instructor/portal\` பக்கத்திற்குச் செல்லவும்.
1. **📅 அன்றாட கால அட்டவணை:** இன்றைய ஓட்டுநர் பாடங்கள் மற்றும் மாணவர்கள்.
2. **⭐ மதிப்பீடுகள்:** Hill Start, Reverse S-Bend பயிற்சிகளுக்கு புள்ளிகள் வழங்குதல்.
3. **📊 பரீட்சை பரிந்துரை:** 80% இற்கு மேல் பெற்ற மாணவர்களைப் பரிந்துரைத்தல்.`,
    },
    suggestions: ['Admin Portal Access', 'Student Portal Features', 'Hill Start Tips'],
  },

  // --- STUDENT PORTAL OVERVIEW ---
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
      'my portal',
      'tell me about student portal',
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
   • Tracks your Learner Journey stage (Medical Clearance → Learner Permit → Practical Training → Trial Ready).

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
   • Learner Journey හි ඔබ සිටින වත්මන් පියවර (වෛද්‍ය සහතිකය → ආධුනික බලපත්‍රය → ප්‍රායෝගික පුහුණුව → විභාගයට සුදානම්).

2. **📅 ඉදිරි පුහුණු සැසි (Upcoming Sessions):**
   • වෙන්කරවා ගත් රියදුරු පාඩම්, උපදේශකගේ නම, දුරකථන අංකය, වාහන අංකය.

3. **🚦 DMT Theory Hub & Mock Exam:**
   • ප්‍රශ්න 40 කින් සමන්විත පරිගණකගත ආදර්ශ විභාග.

4. **💳 ගෙවීම් සහ රිසිට්පත්:**
   • පාඨමාලා ගාස්තුව, ගෙවූ වාරික, ඉතිරි මුදල සහ නිල PDF රිසිට්පත් බාගත කිරීම.`,
      ta: `🎓 **மாணவர் போர்ட்டல் (Student Portal) கண்ணோட்டம்:**

**Student Portal** (\`/student/portal\`) உங்கள் ஓட்டுநர் உரிமப் பயணத்தின் பிரதான பக்கமாகும்:

1. **📊 Trial Readiness மற்றும் முன்னேற்றப் பலகை:** உங்கள் AI தயார்நிலை மதிப்பெண் (0-100%).
2. **📅 வரவிருக்கும் செய்முறை அமர்வுகள்:** பதிவு செய்யப்பட்ட ஓட்டுநர் பாடங்கள் மற்றும் பயிற்றுனர் விவரங்கள்.
3. **🚦 DMT கணினி மாதிரிப் பரீட்சை:** 40 வினாக்கள் கொண்ட மாதிரிப் பரீட்சைகள்.
4. **💳 கட்டணங்கள் மற்றும் பற்றுச்சீட்டுகள்:** செலுத்தப்பட்ட தவணைகள் மற்றும் PDF ரசீதுகள்.`,
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
  ප්‍රධාන පුවරුවේ ඇති **"Upcoming Practical Sessions"** කොටසෙන් ඔබේ පුහුණු දිනය, වේලාව, උපදේශකවරයා සහ පුහුණු වාහනය බලාගත හැක.

• **Sessions & Calendar පිටුවෙන් (\`/sessions\`):**
  සම්පූර්ණ කළ පුහුණු පැය ගණන සහ උපදේශකවරයා ලබාදුන් ලකුණු සවිස්තරාත්මකව බැලිය හැක.`,
      ta: `📅 **செய்முறை ஓட்டுநர் அமர்வுகளைப் பார்வையிடல்:**

• **மாணவர் போர்ட்டலில் (\`/student/portal\`):** வரவிருக்கும் பயிற்சி திகதி, நேரம் மற்றும் பயிற்றுனர் விவரங்களைக் காணலாம்.
• **Sessions Calendar பக்கத்தில் (\`/sessions\`):** நிறைவு செய்யப்பட்ட மணித்தியாலங்கள் மற்றும் மதிப்பீடுகளைப் பார்க்கலாம்.`,
    },
  },

  // --- PAYMENTS, FINANCES & RECEIPTS ---
  {
    id: 'kb-payments-fees',
    category: 'payments_fees' as const,
    keywords: [
      'finance',
      'finances',
      'financials',
      'receipt',
      'receipts',
      'reciept',
      'reciepts',
      'payment',
      'payments',
      'fee',
      'fees',
      'cost',
      'installment',
      'balance',
      'how to pay',
      'how to go to finance and receipts',
      'course package',
      'pending fee',
      'how to view receipt',
    ],
    question: {
      en: 'How do I go to the Finance & Receipts section in the Student Portal and view/download receipts?',
      si: 'ශිෂ්‍ය පෝර්ටලයේ ගෙවීම් සහ රිසිට්පත් (Finance & Receipts) කොටසට යන්නේ කෙසේද?',
      ta: 'மாணவர் போர்ட்டலில் கட்டணங்கள் மற்றும் ரசீதுகள் (Finance & Receipts) பகுதிக்கு எவ்வாறு செல்வது?',
    },
    answer: {
      en: `💳 **How to Access Finances & Receipts in the Student Portal:**

To view your payment plan, fee balance, and download official receipts:

1. **Go to Student Portal:**
   • Navigate to **Student Portal (\`/student/portal\`)** from the sidebar or click your role dashboard.

2. **Locate Course Package & Financials:**
   • Scroll to the **"Course Package & Financials"** section (or click **Financials (\`/financials\`)** in the sidebar).
   • You will see your **Total Course Package Fee**, **Total Amount Paid**, and **Remaining Balance**.

3. **View & Download Official Payment Receipts:**
   • In the **Payment History** list, find your installment record.
   • Click the **"View Receipt"** button next to any payment (e.g., \`REC-2026-0089\`).
   • An official digital receipt with academy verification and transaction details will open for you to print or save as PDF.`,
      si: `💳 **ශිෂ්‍ය පෝර්ටලයේ Finance & Receipts වෙත පිවිසෙන ආකාරය:**

1. **Student Portal වෙත පිවිසෙන්න:**
   • Sidebar මඟින් **Student Portal (\`/student/portal\`)** වෙත පිවිසෙන්න.

2. **Course Package & Financials කොටස:**
   • පහළට scroll කර **"Course Package & Financials"** කොටස බලන්න (හෝ **Financials (\`/financials\`)** වෙත යන්න).
   • සම්පූර්ණ පාඨමාලා ගාස්තුව, ගෙවූ මුදල සහ ඉතිරි මුදල දැකගත හැක.

3. **නිල රිසිට්පත් බාගත කිරීම:**
   • Payment History ලැයිස්තුවේ අදාළ ගෙවීම අසල ඇති **"View Receipt"** බොත්තම ක්ලික් කරන්න.
   • නිල PDF රිසිට්පත මුද්‍රණය කරගන්න හෝ සුරක්ෂිත කරගන්න.`,
      ta: `💳 **மாணவர் போர்ட்டலில் Finance & Receipts பகுதிக்குச் செல்லும் முறை:**

1. **Student Portal இற்குச் செல்லுங்கள்:**
   • Sidebar மூலம் **Student Portal (\`/student/portal\`)** இற்குச் செல்லுங்கள்.

2. **Course Package & Financials பகுதி:**
   • மொத்தக் கட்டணம், செலுத்திய தொகை மற்றும் நிலுவைத் தொகையைப் பார்க்கலாம்.

3. **ரசீதுகளைப் பதிவிறக்க:**
   • Payment History இல் உள்ள **"View Receipt"** பொத்தானைக் கிளிக் செய்து உத்தியோகபூர்ව PDF ரசீதைப் பெறலாம்.`,
    },
    suggestions: [
      'How to check my sessions',
      'Student Portal Overview',
      'What is Readiness Score',
    ],
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
2. **උපදේශක ඇගයීම් (35%):** Hill Start, Reverse S-Bend, Parking සහ ක්ලච් පාලනය.
3. **DMT Theory Mock Exam සාමාන්‍යය (20%):** ආදර්ශ විභාගවලින් 30/40 කට වඩා ලබාගැනීම.
4. **පැමිණීම සහ විනය (10%):** නොකඩවා පුහුණු සැසිවලට සහභාගී වීම.

🎯 **ඉලක්කය:** ලකුණු **$\ge 80\%$** ක් ලබාගත් පසු ඔබව නිල DMT විභාගය සඳහා යොමු කෙරේ!`,
      ta: `📊 **AI Trial Readiness மதிப்பெண் முறைமை:**

உங்கள் **Trial Readiness Score** நீங்கள் முதல் முயற்சியிலேயே DMT செய்முறைப் பரීட்சையில் சித்தியடைவதற்கான வாய்ப்பைக் கணிக்கும்.

**4 முக்கிய அம்சங்கள்:**
1. **நடைமுறை பயிற்சி மணித்தியாலங்கள் (35%):** கட்டாய 15+ மணித்தியாலங்கள்.
2. **பயிற்றுனர் மதிப்பீடுகள் (35%):** Hill Start, Reverse S-Bend தேர்ச்சி.
3. **DMT மாதிரிப் பரீட்சை சராசரி (20%):** 30/40 இற்கு மேல் புள்ளிகள்.
4. **வருகை ஒழுக்கம் (10%):** தொடர்ச்சியான பயிற்சி.

🎯 **இலக்கு:** **$\ge 80\%$** பெற்றவுடன் நீங்கள் அரச பரீட்சைக்குத் தகுதி பெறுவீர்கள்!`,
    },
  },

  // --- DMT THEORY EXAM ---
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

💡 **පුහුණු වීමට:** TrialReady.LK හි **Theory Hub (\`/theory\`)** හෝ **Mock Exam (\`/theory/exam\`)** වෙත පිවිසෙන්න!`,
      ta: `🚦 **இலங்கை DMT கோட்பாட்டுப் பரீட்சை முறை:**

• **மொத்த வினாக்கள்:** 40 பல்தேர்வு வினாக்கள் (MCQs).
• **சித்திபெற தேவையான புள்ளிகள்:** **30 சரியான விடைகள்** ($75\%$).
• **நேரம்:** 45 நிமிடங்கள்.
• **மொழிகள்:** தமிழ், சிங்களம், ஆங்கிலம்.

💡 **பயிற்சி பெற:** **Theory Hub (\`/theory\`)** அல்லது **Mock Exam (\`/theory/exam\`)** இற்குச் செல்லுங்கள்!`,
    },
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
2. **දකුණෙන් ඉස්සර කරන්න:** ඉස්සර කිරීම කළ යුත්තේ දකුණු පසින් පමණි. වංගුවලදී, කඳු මුදුන්වලදී, සීබ්‍රා ක්‍රොසිං සහ තනි/ද්විත්ව සුදු ඉරි මතින් කිසිවිටෙක ඉස්සර නොකරන්න.
3. **වටරවුම් ප්‍රමුඛතාව:** වටරවුමක් තුළ ඔබේ **දකුණු පසින්** එන වාහනවලට පළමුව ඉඩ දෙන්න.
4. **2-Second නීතිය:** ඉදිරියෙන් යන වාහනය සමඟ අවම වශයෙන් තත්පර 2ක ආරක්ෂිත දුරක් තබාගන්න (වැසි දිනවල තත්පර 4ක්).
5. **වේග සීමා:** නාගරික 50 km/h, සාමාන්‍ය මාර්ග 70 km/h, අධිවේගී 100 km/h.
6. **ආසන පටි:** රියදුරු සහ මගියාට අනිවාර්ය වේ.
7. **ජංගම දුරකථන:** රිය ධාවනය අතරතුර භාවිතය සපුරා තහනම්ය.`,
      ta: `🛣️ **இலங்கை நெடுஞ்சாலை விதிகளின் முக்கிய அம்சங்கள்:**

1. **இடதுபுறமாக ஓட்டுங்கள்:** எப்போதும் வீதியின் இடதுபுறமாக வாகனத்தைச் செலுத்துங்கள்.
2. **வலதுபுறமாக முந்துங்கள்:** முந்துவது (Overtake) எப்போதும் வலதுபுறமாக மட்டுமே செய்யப்பட வேண்டும்.
3. **வட்டாரப் பாதை முன்னுரிமை:** வட்டாரப் பாதையில் உங்கள் **வலதுபுறத்தில்** இருந்து வரும் வாகனங்களுக்கு முன்னுரிமை அளியுங்கள்.
4. **2-வினாடி விதி:** முன்னால் செல்லும் வாகனத்திற்கும் உங்களுக்கும் இடையில் குறைந்தபட்சம் 2 வினாடி இடைவெளியைப் பேணுங்கள்.
5. **வேக வரம்புகள்:** நகரங்கள் 50 km/h | நெடுஞ்சாலைகள் 70 km/h | அதிவேக நெடுஞ்சாலைகள் 100 km/h.
6. **இருக்கைப்பட்டை:** சாரதியும் முன்பக்கப் பயணியும் சீட்பெல்ட் அணிவது கட்டாயம்.`,
    },
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
   • Maximum Speed: **100 km/h** | Minimum Speed: **50 km/h**
   • Three-wheelers, Motorcycles $<50\text{cc}$, Tractors, and non-motorized vehicles are **strictly prohibited** on expressways.`,
      si: `⚡ **ශ්‍රී ලංකාවේ නීත්‍යානුකූල වේග සීමා:**

1. **නාගරික ප්‍රදේශ:** මෝටර් රථ සහ වෑන්: **50 km/h** | යතුරුපැදි, බස්, ලොරි, ත්‍රිරෝද: **40 km/h**
2. **සාමාන්‍ය මහාමාර්ග:** මෝටර් රථ සහ වෑන්: **70 km/h** | යතුරුපැදි: **60 km/h** | ත්‍රිරෝද: **40 km/h**
3. **අධිවේගී මාර්ග:** උපරිම **100 km/h** | අවම **50 km/h**`,
      ta: `⚡ **இலங்கையின் சட்டபூர்வ வேக வரம்புகள்:**

1. **நகரப் பகுதிகள்:** கார்கள் & வான்கள்: **50 km/h** | மோட்டார் சைக்கிள்கள் & முச்சக்கர வண்டிகள்: **40 km/h**
2. **நெடுஞ்சாலைகள்:** கார்கள் & வான்கள்: **70 km/h** | மோட்டார் சைக்கிள்கள்: **60 km/h**
3. **அதிவேக நெடுஞ்சாலைகள்:** அதிகபட்சம் **100 km/h** | குறைந்தபட்சம் **50 km/h**`,
    },
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
   • **GIVE WAY** to pedestrians who are on the crossing. If no pedestrians, you may proceed with caution.`,
      si: `🚦 **මාර්ග සංඥා ලාම්පු (Traffic Lights) වල අර්ථය:**

1. 🔴 **රතු පැහැය පමණක්:** **නතර වන්න.**
2. 🔴 + 🟡 **රතු සහ කහ එකවර:** **සුදානම් වන්න.** කොළ පැහැය ලැබෙන තුරු නොයන්න.
3. 🟢 **කොළ පැහැය:** **ධාවනය කරන්න.**
4. 🟡 **කහ පැහැය පමණක්:** **නතර වන්න.** හදිසි අනතුරු අවදානමක් ඇත්නම් පමණක් ප්‍රවේශමෙන් යන්න.
5. 🟡✨ **නිවෙමින් දැල්වෙන කහ පැහැය:** පදිකයින්ට ප්‍රමුඛතාව දෙන්න.`,
      ta: `🚦 **போக்குவரத்து சைகை விளக்குகளின் அர்த்தம்:**

1. 🔴 **சிவப்பு:** நில்லுங்கள்.
2. 🔴 + 🟡 **சிவப்பு & மஞ்சள்:** புறப்படத் தயாராகுங்கள்.
3. 🟢 **பச்சை:** முன்னோக்கிச் செல்லுங்கள்.
4. 🟡 **மஞ்சள்:** நில்லுங்கள்.
5. 🟡✨ **மின்னும் மஞ்சள்:** பாதசாரிகளுக்கு முன்னுரிமை அளியுங்கள்.`,
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

4. 🟦 / 🟩 **Rectangular Signs = INFORMATORY / GUIDE:**
   • Provide helpful directions, distances, facilities, and services (Hospital, Parking, Expressway exit).`,
      si: `🛑 **ශ්‍රී ලංකාවේ මාර්ග සංඥා වර්ගීකරණය:**

1. ⭕ **රතු මායිම් සහිත වෘත්තාකාර සංඥා = අනිවාර්ය / තහනම් නියෝග:** නීතියෙන් අනිවාර්යයෙන්ම පිළිපැදිය යුතුය (ඇතුල්වීම තහනම්, වේග සීමා, ඉස්සර කිරීම තහනම්).
2. 🔺 **රතු මායිම් සහිත ත්‍රිකෝණාකාර සංඥා = අනතුරු ඇඟවීමේ සංඥා:** ඉදිරියේ ඇති අනතුරු (තියුණු වංගු, පදික මාරුව, පටු පාලම).
3. 🔵 **නිල් වෘත්තාකාර සංඥා = අනිවාර්ය ක්‍රියාකාරකම්** (වමට පමණක් හැරෙන්න).
4. 🟦 **සෘජුකෝණාස්‍රාකාර සංඥා = තොරතුරු සංඥා** (රෝහල්, වාහන නැවතුම්).`,
      ta: `🛑 **இலங்கை வீதி அடையாளங்களின் வகைகள்:**

1. ⭕ **சிவப்பு வட்ட அடையாளங்கள் = கட்டாய / தடை உத்தரவுகள்:** (எ.கா: உட்செல்ல தடை, வேக வரம்பு).
2. 🔺 **சிவப்பு முக்கோண அடையாளங்கள் = எச்சரிக்கை அடையாளங்கள்:** (எ.கா: வளைவு, பாதசாரி கடவை).
3. 🔵 **நீல வட்ட அடையாளங்கள் = கட்டாய திசை அடையாளங்கள்.**
4. 🟦 **செவ்வக அடையாளங்கள் = தகவல் அடையாளங்கள்.**`,
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
   • **Turning Left (1st Exit):** Approach in LEFT lane, signal LEFT on approach, keep left, exit with left signal.
   • **Going Straight (2nd Exit):** Approach in LEFT or CENTER lane, NO signal on approach. Signal LEFT immediately after passing 1st exit to leave.
   • **Turning Right or U-Turn (3rd+ Exit):** Approach in RIGHT lane, signal RIGHT on approach. Keep right in roundabout, signal LEFT after passing the exit before yours.`,
      si: `🔄 **ශ්‍රී ලංකාවේ වටරවුම් නීති:**

1. **ප්‍රධාන රීතිය:** වටරවුම තුළ ඔබේ **දකුණු පසින්** පැමිණෙන සියලු රථවාහන සඳහා ප්‍රමුඛතාව ලබාදිය යුතුය.
2. **මංතීරු භාවිතය:**
   • **වමට (1 වන පිටවීම):** වම් මංතීරුව, වම් සිග්නල්.
   • **කෙළින්ම (2 වන පිටවීම):** වම් හෝ මැද මංතීරුව, 1 වන පිටවීම පසුකළ පසු වම් සිග්නල්.
   • **දකුණට / U-Turn:** දකුණු මංතීරුව, දකුණු සිග්නල්.`,
      ta: `🔄 **வட்டாரப் பாதை விதிகள்:**

1. **முக்கிய விதி:** உங்கள் **வலதுபுறத்தில்** இருந்து வரும் வாகனங்களுக்கு முன்னுரிமை கொடுங்கள்.
2. **இடது திரும்ப:** இடது ஒழுங்கை, இடது சைகை.
3. **நேராகச் செல்ல:** சைகை இல்லாமல் நுழைந்து, முதல் வெளியேற்றத்தைக் கடந்ததும் இடது சைகை காட்டவும்.
4. **வலது திரும்ப:** வலது ஒழுங்கை, வலது சைகை.`,
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
      'tell me about hill start',
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

1. **රථය නවත්වා තබාගන්න:** හෑන්ඩ්බ්‍රේක් තදින් යොදන්න. ක්ලච් සහ ෆුට්බ්‍රේක් සම්පූර්ණයෙන්ම පාගන්න.
2. **1 වන ගියරය යොදන්න:** ගියර් ලිවරය 1st Gear වෙත දමන්න.
3. **ඇක්සලරේටරය සුදානම් කරන්න:** ඇක්සලරේටරය මඳක් පාගා RPM 1500-2000 මට්ටමක ස්ථාවරව තබාගන්න.
4. **ක්ලච් බයිටිං පොයින්ට්:** ක්ලච් එක සෙමින් උඩට ගන්න. එන්ජින් ශබ්දය මඳක් වෙනස් වී වාහනයේ ඉදිරිපස එසවෙන ස්ථානයේදී දෙපා ස්ථාවරව තබාගන්න.
5. **දෙපස නිරීක්ෂණය:** කණ්නාඩි සහ අන්ධ කලාප පරීක්ෂා කරන්න.
6. **හෑන්ඩ්බ්‍රේක් මුදාහරින්න:** හෑන්ඩ්බ්‍රේක් එක පහතට දමන්න. රථය පසුපසට නොගොස් ඉදිරියට ධාවනය වේ!`,
      ta: `⛰️ **Hill Start மேடேறும் முறை:**

1. ஹேண்ட்பிரேக்கை (Handbrake) உறுதியாக இழுத்து, கிளட்ச் மற்றும் பிரேக்கை அழுத்தவும்.
2. 1வது கியரில் போடவும்.
3. எக்ஸிலேட்டரை 1500-2000 RPM வரை மெதுவாக அழுத்தவும்.
4. கிளட்சை பைட்டிங் பாயிண்ட் (Biting point) வரை மெதுவாக உயர்த்துங்கள்.
5. கண்ணாடிகளைப் பார்த்துவிட்டு, ஹேண்ட்பிரேக்கை மெதுவாக விடுவிக்கவும். வாகனம் பின்னோக்கிச் செல்லாமல் நகரும்!`,
    },
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
• **Smooth Steering Transfer:** Smooth transition of steering wheel locks between the first arc (left) and second arc (right).`,
      si: `🔄 **DMT Reverse S-Bend පරීක්ෂණය:**

• **කෝන් නොහැපීම:** මායිම් කෝන් හෝ කණු ස්පර්ශ කිරීම ක්ෂණික අසමත්වීමකි (Instant Fail).
• **ක්ලච් මඟින් වේගය පාලනය:** ඉතා අඩු වේගයකින් රථය පාලනය කරන්න.
• **කණ්නාඩි නිරීක්ෂණය:** දෙපස කණ්නාඩි නිරන්තරයෙන් නිරීක්ෂණය කරන්න.
• **සුක්කානම හැසිරවීම:** පළමු වංගුවේ සිට දෙවන වංගුවට සුක්කානම සුමටව කරකවන්න.`,
      ta: `🔄 **Reverse S-Bend பரீட்சை குறிப்புகள்:**

• கூம்புகளில் முட்டக்கூடாது (முட்டினால் உடனடி தோல்வி).
• கிளட்ச் மூலம் மிகக் குறைந்த வேகத்தில் வாகனத்தைக் கட்டுப்படுத்துங்கள்.
• பக்கவாட்டுக் கண்ணாடிகளைத் தொடர்ந்து கவனியுங்கள்.`,
    },
  },

  // --- CAR EMERGENCIES & ACCIDENTS ---
  {
    id: 'kb-accidents-procedure',
    category: 'emergencies_safety',
    keywords: [
      'accident',
      'car accident',
      'what to do in accident',
      'crash',
      'police 119',
      'insurance claim',
      'spot claim',
      'hit',
    ],
    question: {
      en: 'What should I do immediately after a motor traffic accident in Sri Lanka?',
      si: 'ශ්‍රී ලංකාවේදී රිය අනතුරක් සිදුවූ වහාම කළ යුත්තේ කුමක්ද?',
      ta: 'இலங்கையில் மோட்டார் வாகன விபத்து ஏற்பட்டால் உடனடியாக என்ன செய்ய வேண்டும்?',
    },
    answer: {
      en: `🚨 **What to Do in a Car Accident in Sri Lanka:**

1. **Stop Immediately & Turn on Hazard Lights:**
   • Never leave the accident scene (hit-and-run is a severe criminal offense under the Motor Traffic Act).
   • Set up emergency hazard warning triangles at least 45 meters behind the vehicle.

2. **Check for Injuries:**
   • If anyone is injured, call **1990 (Suwa Seriya Ambulance)** or **119 (Police Emergency)** immediately.

3. **Call Insurance Hotline on the Spot:**
   • Contact your insurer's 24/7 hotline (e.g. Sri Lanka Insurance, Ceylinco, Allianz, AIA, Fairfirst) to request an on-site inspection (Spot Claim).

4. **Document the Scene:**
   • Take clear photos of vehicle positions, number plates, impact points, skid marks, and road surroundings before moving vehicles.

5. **Exchange Information:**
   • Exchange Name, Driver's License Number, NIC, Insurance Policy Number, and Vehicle Registration with the other driver.

6. **Do Not Admit Fault:**
   • Keep calm, do not argue or sign informal liabilities on the road. Let the police and insurance assessors evaluate the scene.`,
      si: `🚨 **රිය අනතුරක් සිදුවූ විට කළ යුතු දෑ:**

1. **වහාම රථය නවතා Hazard Lights දල්වන්න:** අනතුර වූ ස්ථානයෙන් පලා නොයන්න.
2. **තුවාලකරුවන් සිටී නම්:** **1990 සුවසැරිය ගිලන්රථ** සේවය හෝ **119 පොලිස් හදිසි ඇමතුම්** අමතන්න.
3. **ක්ෂණිකව රක්ෂණ සමාගම අමතන්න:** Spot Claim ලබාගැනීම සඳහා ඔබේ රක්ෂණ සමාගමේ ක්ෂණික ඇමතුම් අංකය අමතන්න.
4. **ඡායාරූප ලබාගන්න:** වාහනවල පිහිටීම, අංක තහඩු, හානියට පත් ස්ථාන සහ මාර්ගය ඡායාරූපගත කරන්න.
5. **විස්තර හුවමාරු කරගන්න:** අනෙක් රියදුරුගේ නම, රියදුරු බලපත්‍ර අංකය, ජා.හැ. අංකය සහ රක්ෂණ විස්තර සටහන් කරගන්න.`,
      ta: `🚨 **விபத்து ஏற்பட்டால் செய்ய வேண்டியவை:**

1. **உடனடியாக நிறுத்தி Hazard விளக்குகளைப் போடுங்கள்:**
2. **காயமடைந்தவர்கள் இருந்தால்:** **1990 (சுவசரிய அம்புலன்ஸ்)** அல்லது **119 (பொலிஸ்)** அழையுங்கள்.
3. **காப்புறுதி நிறுவனத்தை அழையுங்கள்:** Spot Claim இற்காக உங்கள் காப்புறுதி நிறுவனத்தை அழையுங்கள்.
4. **புகைப்படம் எடுங்கள்:** வாகனங்களின் நிலை, இலக்கத் தகடு மற்றும் சேதங்களை புகைப்படம் எடுங்கள்.
5. **விவரங்களைப் பரிமாறிக் கொள்ளுங்கள்:** சாரதி அனுமதிப்பத்திரம் மற்றும் காப்புறுதி விவரங்கள்.`,
    },
    suggestions: ['Brake Failure Emergency', 'Tyre Burst at High Speed', 'Insurance Types'],
  },

  // --- BRAKE FAILURE EMERGENCY ---
  {
    id: 'kb-brake-failure',
    category: 'emergencies_safety',
    keywords: [
      'brake failure',
      'brakes fail',
      'no brakes',
      'brakes not working',
      'stop without brakes',
    ],
    question: {
      en: 'What should I do if my vehicle brakes fail while driving?',
      si: 'රිය ධාවනය අතරතුර තිරිංග (Brakes) අක්‍රිය වුවහොත් කුමක් කළ යුතුද?',
      ta: 'வாகனம் ஓட்டும்போது பிரேக் செயலிழந்தால் என்ன செய்ய வேண்டும்?',
    },
    answer: {
      en: `🛑 **Emergency Action Plan for Brake Failure:**

1. **Pump the Footbrake Rapidly:**
   • Rapid pumping can sometimes build hydraulic pressure to restore partial braking.

2. **Downshift to Lower Gears (Engine Braking):**
   • Shift down progressively: $4^{\text{th}} \rightarrow 3^{\text{rd}} \rightarrow 2^{\text{nd}} \rightarrow 1^{\text{st}}$ gear.
   • In automatic cars, switch to Manual/Sport mode or $L/2$ to force engine braking.

3. **Gently Apply Handbrake (Emergency Brake):**
   • Gradually pull the handbrake while holding the release button.
   • *Warning:* Do not yank it violently at high speed, as this could lock rear wheels and cause a spin.

4. **Warn Others:**
   • Turn on hazard lights and honk your horn to alert pedestrians and oncoming vehicles.

5. **Look for an Escape Route:**
   • Steer towards an open grassy verge, uphill gradient, gravel runaway ramp, or scrub bushes to slow down safely.`,
      si: `🛑 **තිරිංග අක්‍රිය වූ විට කළ යුතු දෑ:**

1. **බ්‍රේක් පැඩලය වේගයෙන් කිහිපවරක් පාගන්න:** හයිඩ්‍රොලික් පීඩනය යථා තත්ත්වයට පත් විය හැක.
2. **ගියර් පහළට දමන්න (Engine Braking):** 4 $\rightarrow$ 3 $\rightarrow$ 2 $\rightarrow$ 1 ලෙස ක්‍රමයෙන් ගියර් අඩු කර වේගය පාලනය කරන්න.
3. **හෑන්ඩ්බ්‍රේක් එක සෙමින් යොදන්න:** රිලීස් බොත්තම ඔබාගෙන සෙමින් හෑන්ඩ්බ්‍රේක් එක උඩට ගන්න (එකවර තදින් අදින්න එපා).
4. **අනතුරු ඇඟවීම්:** Hazard lights දමා හෝන් එක නාද කරන්න.
5. **ආරක්ෂිත බාධක:** තණකොළ සහිත මායිමක් හෝ ඉහළට ඇති බෑවුමක් දෙසට රථය යොමු කරන්න.`,
      ta: `🛑 **பிரேக் செயலிழந்தால் செய்ய வேண்டியவை:**

1. **பிரேக் பெடலை வேகமாக பலமுறை அழுத்துங்கள்.**
2. **கியர்களைக் குறைத்து இன்ஜின் பிரேக்கிங் செய்யுங்கள் (4 $\rightarrow$ 3 $\rightarrow$ 2 $\rightarrow$ 1).**
3. **ஹேண்ட்பிரேக்கை மெதுவாகப் பிரயோகியுங்கள்.**
4. **Hazard விளக்குகளைப் போட்டு எச்சரியுங்கள்.**
5. **பாதுகாப்பான மணல் அல்லது புல்வெளிப் பகுதி நோக்கி வாகனத்தை நகர்த்துங்கள்.**`,
    },
  },

  // --- TYRE BLOWOUT EMERGENCY ---
  {
    id: 'kb-tyre-blowout',
    category: 'emergencies_safety',
    keywords: [
      'tyre blowout',
      'tire burst',
      'flat tyre at high speed',
      'puncture on expressway',
    ],
    question: {
      en: 'How do I handle a tyre blowout or burst at high speed?',
      si: 'අධික වේගයෙන් ධාවනය වන විට ටයරයක් පිපිරී ගියහොත් පාලනය කරන්නේ කෙසේද?',
      ta: 'அதிவேகத்தில் டயர் வெடித்தால் எவ்வாறு வாகனத்தைக் கட்டுப்படுத்துவது?',
    },
    answer: {
      en: `⚠️ **How to Survive a High-Speed Tyre Blowout:**

1. **Grip the Steering Wheel Firmly with BOTH Hands:**
   • A front-tyre blowout will pull the car violently to one side. Keep it pointed straight.

2. **DO NOT Slam on the Brakes:**
   • Slamming brakes during a blowout will cause immediate loss of control or a rollover.

3. **Ease Off the Accelerator Slowly:**
   • Allow engine friction and the blown tyre's rolling resistance to slow the car down naturally.

4. **Maintain Lane & Signal Left:**
   • Once speed drops below $40\text{ km/h}$, gently apply the brakes, activate the left indicator, and steer smoothly onto the hard shoulder or roadside.

5. **Set Hazard Lights & Safety Triangle:**
   • Turn on hazard lights and place the warning triangle $45\text{ m}$ behind your car before changing the tyre.`,
      si: `⚠️ **අධිවේගී ටයර් පිපිරීමකදී කළ යුතු දෑ:**

1. **සුක්කානම දෑතින්ම තදින් අල්ලාගන්න:** රථය එක පැත්තකට ඇදී යාම වැළැක්වීමට කෙළින් තබාගන්න.
2. **එකවර තදින් බ්‍රේක් නොපාගන්න:** එකවර බ්‍රේක් පාගන්නේ නම් රථය පෙරලී යා හැක.
3. **ඇක්සලරේටරයෙන් කකුල සෙමින් ඉවතට ගන්න:** රථය ස්වභාවිකවම වේගය අඩු වීමට ඉඩ හරින්න.
4. **වේගය අඩු වූ පසු සෙමින් බ්‍රේක් කර පසෙකට ගන්න:** වම් සිග්නල් දමා ආරක්ෂිතව මාර්ගයෙන් ඉවතට ගන්න.
5. **Hazard Lights සහ අනතුරු ත්‍රිකෝණය යොදන්න.**`,
      ta: `⚠️ **டயர் வெடித்தால் செய்ய வேண்டியவை:**

1. **ஸ்டீயரிங்கை இரு கைகளாலும் உறுதியாகப் பிடியுங்கள்.**
2. **திடீரென பிரேக்கை அழுத்த வேண்டாம்.**
3. **எக்ஸிலேட்டரை மெதுவாக விடுங்கள்.**
4. **வேகம் குறைந்ததும் மெதுவாக பிரேக் செய்து வீதியோரமாக நிறுத்துங்கள்.**
5. **Hazard விளக்குகளைப் போடுங்கள்.**`,
    },
  },

  // --- DASHBOARD WARNING LIGHTS ---
  {
    id: 'kb-warning-lights',
    category: 'maintenance_mechanics',
    keywords: [
      'warning light',
      'warning lights',
      'check engine',
      'oil light',
      'battery light',
      'abs light',
      'dashboard symbols',
      'red lights on dashboard',
    ],
    question: {
      en: 'What do the main dashboard warning lights mean and what should I do when they light up?',
      si: 'වාහනයේ Dashboard එකේ දැල්වෙන ප්‍රධාන අනතුරු ඇඟවීමේ සංඥා ලාම්පු මොනවාද?',
      ta: 'டாஷ்போர்டு எச்சரிக்கை விளக்குகளின் அர்த்தம் என்ன மற்றும் என்ன செய்ய வேண்டும்?',
    },
    answer: {
      en: `🚗 **Dashboard Warning Lights Guide:**

**🔴 RED LIGHTS = CRITICAL (Stop driving immediately):**
• 🛢️ **Engine Oil Pressure Light:** Oil level critically low or oil pump failure. Stop engine immediately to prevent engine seizure.
• 🔋 **Battery / Alternator Light:** Charging system failed. Car is running purely on battery power and will shut down soon.
• 🌡️ **Engine Temperature / Coolant Light:** Engine is overheating. Pull over and turn off engine to avoid blown head gasket.
• 🛑 **Brake System Warning:** Handbrake is engaged OR brake fluid is critically low.

**🟡 AMBER / YELLOW LIGHTS = WARNING (Service needed soon):**
• ⚙️ **Check Engine Light (MIL):** Engine sensor, catalytic converter, or emission malfunction. Scan with OBD-II scanner.
• 🚫 **ABS Warning Light:** Anti-Lock Braking system disabled (standard brakes still work, but wheels may lock in hard stops).
• ⚠️ **TPMS Light:** Low tyre pressure detected.`,
      si: `🚗 **Dashboard අනතුරු ඇඟවීමේ ලාම්පු:**

**🔴 රතු ලාම්පු = අතිශය හදිසි (වහාම රථය නවත්වන්න):**
• 🛢️ **Engine Oil Light:** එන්ජින් ඔයිල් මට්ටම අඩුයි. එන්ජිම විනාශ වීම වැළැක්වීමට වහාම ක්‍රියා විරහිත කරන්න.
• 🔋 **Battery Light:** Alternator ආරෝපණය අක්‍රියයි.
• 🌡️ **Temperature Light:** එන්ජිම අධික ලෙස රත් වී ඇත.
• 🛑 **Brake Light:** හෑන්ඩ්බ්‍රේක් යොදා ඇත හෝ බ්‍රේක් ඔයිල් අඩුයි.

**🟡 කහ ලාම්පු = අනතුරු ඇඟවීම්:**
• ⚙️ **Check Engine:** එන්ජිමේ සෙන්සරයක දෝෂයක්.
• 🚫 **ABS Light:** ABS පද්ධතිය අක්‍රියයි.`,
      ta: `🚗 **டாஷ்போர்டு எச்சரிக்கை விளக்குகள்:**

**🔴 சிவப்பு விளக்குகள் = அவசரம் (உடனடியாக நிறுத்துங்கள்):**
• 🛢️ **Engine Oil:** என்ஜின் எண்ணெய் குறைவு.
• 🔋 **Battery:** மின்னேற்றம் செயலிழப்பு.
• 🌡️ **Temperature:** என்ஜின் அதிக வெப்பமடைந்துள்ளது.

**🟡 மஞ்சள் விளக்குகள் = எச்சரிக்கை:**
• ⚙️ **Check Engine:** சென்சார் கோளாறு.
• 🚫 **ABS:** ABS அமைப்பு செயலிழந்துள்ளது.`,
    },
  },

  // --- HOW TO JUMPSTART A CAR ---
  {
    id: 'kb-jumpstart-battery',
    category: 'maintenance_mechanics',
    keywords: [
      'jump start',
      'jumpstart',
      'dead battery',
      'battery dead',
      'jump cables',
      'how to jump start a car',
    ],
    question: {
      en: 'How do I safely jumpstart a car with a dead battery?',
      si: 'බැටරිය බැසගිය වාහනයක් Jump Start කරන්නේ නිවැරදිව කෙසේද?',
      ta: 'செயலிழந்த பேட்டரியை எவ்வாறு பாதுகாப்பாக ஜம்ப் ஸ்டார்ட் செய்வது?',
    },
    answer: {
      en: `⚡ **Safe Step-by-Step Battery Jumpstart Guide:**

**Connecting Jumper Cables (Order is crucial):**
1. Park both cars close together with engines OFF (never let the cars touch).
2. Connect **🔴 RED Cable** to the POSITIVE ($+$) terminal of the **DEAD battery**.
3. Connect the other end of **🔴 RED Cable** to the POSITIVE ($+$) terminal of the **DONOR battery**.
4. Connect **⚫ BLACK Cable** to the NEGATIVE ($-$) terminal of the **DONOR battery**.
5. Connect the other end of **⚫ BLACK Cable** to an **unpainted bare metal surface on the engine block/chassis** of the DEAD car (away from battery).

**Starting Procedure:**
• Start the donor car and let it idle for 3-5 minutes.
• Start the dead car. Once running, disconnect cables in the **exact reverse order** (Black from chassis $\rightarrow$ Black from donor $\rightarrow$ Red from donor $\rightarrow$ Red from dead car).
• Keep the revived car running for at least 20 minutes to recharge.`,
      si: `⚡ **බැටරියක් Jump Start කරන නිවැරදි පියවර:**

**කේබල් සවි කිරීමේ අනුපිළිවෙල:**
1. 🔴 **රතු කේබලය:** අක්‍රිය වාහනයේ **ධන ($+$)** අග්‍රයට සවි කරන්න.
2. 🔴 **රතු කේබලයේ අනෙක් කෙළවර:** හොඳ වාහනයේ **ධන ($+$)** අග්‍රයට සවි කරන්න.
3. ⚫ **කළු කේබලය:** හොඳ වාහනයේ **සෘණ ($-$)** අග්‍රයට සවි කරන්න.
4. ⚫ **කළු කේබලයේ අනෙක් කෙළවර:** අක්‍රිය වාහනයේ එන්ජින් බොඩියේ ලෝහමය කොටසකට (Ground) සවි කරන්න.

• හොඳ වාහනය පණගන්වා මිනිත්තු 3ක් තබා අක්‍රිය වාහනය පණගන්වන්න.
• ඉවත් කිරීමේදී සවිකළ පිළිවෙලට විරුද්ධ අතට ගලවන්න.`,
      ta: `⚡ **பேட்டரி ஜம்ப் ஸ்டார்ட் செய்யும் முறை:**

1. 🔴 **சிவப்பு கேபிள்:** பழுதான பேட்டரியின் Positive ($+$) இற்கு.
2. 🔴 **சிவப்பு கேபிளின் மறுமுனை:** நல்ல பேட்டரியின் Positive ($+$) இற்கு.
3. ⚫ **கருப்பு கேபிள்:** நல்ல பேட்டரியின் Negative ($-$) இற்கு.
4. ⚫ **கருப்பு கேபிளின் மறுமுனை:** பழுதான காரின் என்ஜின் உலோகம் (Ground) இற்கு.

• காரை ஸ்டார்ட் செய்து 20 நிமிடங்கள் ஓட விடுங்கள்.`,
    },
  },

  // --- INSURANCE TYPES IN SRI LANKA ---
  {
    id: 'kb-insurance-types',
    category: 'insurance_police',
    keywords: [
      'insurance',
      'third party',
      'full insurance',
      'comprehensive',
      'vehicle insurance in sri lanka',
      'spot claim',
    ],
    question: {
      en: 'What is the difference between Third-Party and Comprehensive (Full) Insurance in Sri Lanka?',
      si: 'ශ්‍රී ලංකාවේ Third-Party සහ Full Insurance අතර වෙනස කුමක්ද?',
      ta: 'இலங்கையில் Third-Party மற்றும் Full Insurance இற்கு இடையிலான வேறுபாடு என்ன?',
    },
    answer: {
      en: `🛡️ **Vehicle Insurance in Sri Lanka:**

1. **Third-Party Insurance (Legal Minimum Requirement):**
   • **What it covers:** Damages, property destruction, bodily injuries, or death caused to OTHER parties (third parties) by your vehicle.
   • **What it does NOT cover:** Your own vehicle damage, theft, or natural disasters.

2. **Comprehensive (Full) Insurance:**
   • **What it covers:** Both third-party liabilities AND damages to your own vehicle (accidents, collisions, fire, theft, flood, vandalism, towing assistance, and spot cash claims).
   • Recommended for all new, leased, and academy vehicles.`,
      si: `🛡️ **ශ්‍රී ලංකාවේ වාහන රක්ෂණ වර්ග:**

1. **Third-Party රක්ෂණය (නීතියෙන් අනිවාර්ය අවම රක්ෂණය):**
   • ආවරණය වන්නේ: ඔබගේ වාහනයෙන් වෙනත් පාර්ශ්වයකට (Third Party) සිදුවන දේපළ හානි, තුවාල හෝ ජීවිත හානි පමණි.
   • ඔබගේ වාහනයට සිදුවන හානි ආවරණය නොවේ.

2. **Comprehensive (Full) රක්ෂණය:**
   • ආවරණය වන්නේ: වෙනත් පාර්ශ්වයන්ගේ හානි මෙන්ම ඔබේ වාහනයට සිදුවන සියලු අනතුරු හානි, ගිනිගැනීම්, සොරකම් සහ ගංවතුර හානි ආවරණය වේ.`,
      ta: `🛡️ **இலங்கை வாகனக் காப்புறுதி வகைகள்:**

1. **Third-Party காப்புறுதி (சட்டபூர்வ கட்டாயம்):** மற்றைய நபர்களுக்கு ஏற்படும் சேதங்களை மட்டுமே ஈடுசெய்யும். உங்கள் வாகனத்திற்கு நட்டஈடு கிடைக்காது.
2. **Full Insurance (முழுக் காப்புறுதி):** உங்கள் வாகனச் சேதம், திருட்டு மற்றும் மற்றைய தரப்பினரின் சேதங்கள் அனைத்தையும் ஈடுசெய்யும்.`,
    },
  },

  // --- OVERCOMING EXAM NERVOUSNESS ---
  {
    id: 'kb-exam-nervousness',
    category: 'trial_tips',
    keywords: [
      'nervous',
      'exam stress',
      'fear',
      'anxiety',
      'scared of trial',
      'how to stay calm',
      'confidence for trial',
    ],
    question: {
      en: 'How can I overcome nervousness and anxiety before my driving trial test?',
      si: 'රියදුරු පරීක්ෂණයට පෙර ඇතිවන බිය සහ නොසන්සුන්තාව පාලනය කරගන්නේ කෙසේද?',
      ta: 'ஓட்டுநர் பரீட்சைக்கு முன் ஏற்படும் பயம் மற்றும் பதற்றத்தை எவ்வாறு குறைப்பது?',
    },
    answer: {
      en: `🧘 **Tips to Conquer Driving Trial Test Anxiety:**

1. **4-7-8 Breathing Technique:**
   • Inhale through your nose for 4 seconds, hold your breath for 7 seconds, and exhale slowly through your mouth for 8 seconds. Repeat 3 times before sitting in the driver's seat.

2. **Focus on the Process, Not the Outcome:**
   • Don't worry about "passing or failing". Treat the trial as a regular practice lesson with your instructor.

3. **Take Your Time on Every Step:**
   • Adjust your seat, check all 3 mirrors, fasten seatbelt, verify handbrake, and take a deep breath before turning the key. Examiners appreciate calm, deliberate routines.

4. **Examiners are Looking for Safety, Not Racing:**
   • Maintain a gentle, controlled speed. Checking mirrors and looking over shoulders is what impresses examiners most!`,
      si: `🧘 **විභාග බිය පාලනය කරගන්නා ආකාරය:**

1. **හුස්ම ගැනීමේ ව්‍යායාමය (4-7-8 ක්‍රමය):** තත්පර 4ක් හුස්ම ඉහළට ගෙන, තත්පර 7ක් තබාගෙන, තත්පර 8කින් පහළට හෙළන්න.
2. **සාමාන්‍ය පුහුණුවක් ලෙස සිතන්න:** විභාගයක් ලෙස නොව උපදේශකවරයා සමඟ කරන සාමාන්‍ය පාඩමක් ලෙස සිතන්න.
3. **පියවරෙන් පියවර සෙමින් කරන්න:** සීට් එක හරිගස්සා, කණ්නාඩි 3ම බලා, සීට්බෙල්ට් දමා සන්සුන්ව ආරම්භ කරන්න.
4. **පරීක්ෂකවරයා බලන්නේ ආරක්ෂාවයි:** අඩු පාලිත වේගයකින් කණ්නාඩි බලමින් ධාවනය කරන්න.`,
      ta: `🧘 **பரீட்சைப் பதற்றத்தைத் தவிர்ப்பது எப்படி:**

1. ஆழமாக மூச்சை இழுத்து விடுங்கள்.
2. வழக்கமான பயிற்சி அமர்வு போல நினையுங்கள்.
3. சீட், கண்ணாடிகள் மற்றும் சீட்பெல்ட்டை நிதானமாகச் சரிபாருங்கள்.
4. வேகத்தை விட பாதுகாப்பான ஓட்டுதலே முக்கியம்!`,
    },
  },
]
