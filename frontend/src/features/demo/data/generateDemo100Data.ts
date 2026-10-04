export interface DemoStudent {
  id: string
  driving_school_id: string
  branch_id: string
  primary_instructor_id: string
  student_code: string
  full_name: string
  nic: string
  date_of_birth: string
  phone: string
  email: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  registration_date: string
  is_active: boolean
  branch?: { id: string; name: string }
}

export const UNIQUE_100_SRI_LANKAN_NAMES: string[] = [
  'Amaya Fernando',
  'Ravindu Rathnayaka',
  'Sanduni Wickramasinghe',
  'Dinesh Perera',
  'Kavindi Silva',
  'Nethmi Jayasekara',
  'Dilshan Bandara',
  'Malith Karunaratne',
  'Kaveesha Gunaratne',
  'Hasini Senanayake',
  'Chamod Fonseka',
  'Oshadi Mendis',
  'Lakshan Dissanayake',
  'Anuki Wickrama',
  'Prabath Kariyawasam',
  'Dilini Rajapaksha',
  'Nuwan Samaraweera',
  'Tharaka Alwis',
  'Ruwini Pathirana',
  'Damith Jayalath',
  'Asanka Wijesinghe',
  'Shalini Cooray',
  'Thisara Abeysekara',
  'Amal Madushanka',
  'Nimasha Ranasinghe',
  'Kasun Hettiarachchi',
  'Isuru Jayasuriya',
  'Sachini Weerasinghe',
  'Pramod Liyanage',
  'Dinithi Kulatunga',
  'Supun Amarasinghe',
  'Hiruni Gamage',
  'Charith Nanayakkara',
  'Kaveen Siriwardena',
  'Nipuni Ekanayake',
  'Pathum Gunasekara',
  'Hansani Herath',
  'Maleesha Tennekoon',
  'Dhanushka Attanayake',
  'Janani Subasinghe',
  'Dinuka Wijeratne',
  'Kanchana Basnayake',
  'Duminda Dassanayake',
  'Madhavi Senaratne',
  'Gayan Weerakkody',
  'Malsha Ratwatte',
  'Harsha Illangakoon',
  'Nelum Munasinghe',
  'Indika Ranatunga',
  'Nilmini Lokuge',
  'Janaka Bogahawatta',
  'Pavithra Welikala',
  'Lahiru Medagoda',
  'Poornima Halpe',
  'Mahesh Rambukwella',
  'Sewwandi Pilapitiya',
  'Malinda Molamure',
  'Shanika Delgoda',
  'Nadeesha Keppetipola',
  'Subhashini Madugalle',
  'Nalaka Dunuwille',
  'Sujani Hulangamuwa',
  'Prasanna Meedeniya',
  'Tharushi Aluvihare',
  'Roshan Kobbekaduwa',
  'Upeksha Giragama',
  'Ruwan Marapana',
  'Vihara Panabokke',
  'Sachith Nugawela',
  'Vindya Divakara',
  'Sajith Weragama',
  'Yashodha Halangoda',
  'Saman Paranagama',
  'Yenuki Ellepola',
  'Sandun Amunugama',
  'Anoma Walalgoda',
  'Sanjeewa Kadigawa',
  'Champa Dodanwela',
  'Sarath Galagoda',
  'Chitra Dehigama',
  'Shehan Madawala',
  'Geetha Batugedara',
  'Udara Molagoda',
  'Kanthi Iriyagolle',
  'Upul Hendeniya',
  'Malkanthi Godamunne',
  'Viraj Kalugampitiya',
  'Manel Weligodapola',
  'Vishwa Alawatugoda',
  'Priyanthi Bowala',
  'Yohan Danthurebandara',
  'Renuka Gunnepana',
  'Chamath Mediwake',
  'Sunethra Udalagama',
  'Bawantha Weerasekara',
  'Dilani Kirinde',
  'Minoli Samarajeewa',
  'Ishani Kahawatta',
  'Tharindu Jayawardena',
  'Kusal Kumara',
]


const STREETS_BY_BRANCH: Record<number, { city: string; streets: string[] }> = {
  0: {
    city: 'Colombo',
    streets: [
      'Galle Road, Colombo 03', 'High Level Road, Nugegoda', 'Duplication Road, Kollupitiya', 'Havelock Road, Colombo 05',
      'Stanley Thilakarathne Mawatha, Nugegoda', 'Baseline Road, Colombo 09', 'Nawala Road, Rajagiriya', 'Cotta Road, Borella',
      'Elvitigala Mawatha, Colombo 08', 'Thimbirigasyaya Road, Colombo 05'
    ]
  },
  1: {
    city: 'Gampaha',
    streets: [
      'Kandy Road, Yakkala', 'Miriswatta Junction, Gampaha', 'Station Road, Veyangoda', 'Minuwangoda Road, Ja-Ela',
      'Negombo Road, Wattala', 'Aluthgama Road, Radawana', 'Asgiriya Road, Gampaha', 'Orutota Road, Gampaha',
      'Weliweriya Road, Delgoda', 'Kirindiwela Road, Dompe'
    ]
  },
  2: {
    city: 'Kandy',
    streets: [
      'Peradeniya Road, Kandy', 'William Gopallawa Mawatha, Kandy', 'Katugastota Road, Kandy', 'Ampitiya Road, Kandy',
      'D.S. Senanayake Veediya, Kandy', 'Galaha Road, Peradeniya', 'Aniwatta Circular Road, Kandy', 'Tennekumbura Road, Kandy',
      'Kings Street, Kandy', 'Rajapihilla Mawatha, Kandy'
    ]
  },
  3: {
    city: 'Kurunegala',
    streets: [
      'Dambulla Road, Kurunegala', 'Colombo Road, Kurunegala', 'Negombo Road, Kurunegala', 'Kandy Road, Mallawapitiya',
      'Puttalam Road, Kurunegala', 'Wathhimi Road, Kurunegala', 'South Circular Road, Kurunegala', 'Bauddhaloka Mawatha, Kurunegala',
      'Maspotha Road, Kurunegala', 'Ibbagamuwa Road, Kurunegala'
    ]
  },
  4: {
    city: 'Galle',
    streets: [
      'Matara Road, Galle', 'Wakwella Road, Galle', 'Richmond Hill Road, Galle', 'Talpe Coast Road, Unawatuna',
      'Hirimbura Cross Road, Galle', 'Hikkaduwa Marine Drive, Hikkaduwa', 'Fort Lighthouse Street, Galle Fort',
      'Karapitiya Hospital Road, Galle', 'Kaluwella Main Street, Galle', 'Baddegama Road, Galle'
    ]
  }
}

export function generate100SriLankanStudents(
  schoolId: string,
  branches: Array<{ id: string; name: string }>,
  instructors: Array<{ id: string; full_name: string }>
): DemoStudent[] {
  const students: DemoStudent[] = []

  for (let i = 1; i <= 100; i++) {
    const fullName = UNIQUE_100_SRI_LANKAN_NAMES[i - 1]
    const [firstName, surname] = fullName.split(' ')

    const isMale = i % 2 === 0
    const branchIdx = (i - 1) % (branches.length || 1)
    const branch = branches[branchIdx] || branches[0] || { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' }
    const instructor = instructors[(i - 1) % (instructors.length || 1)] || instructors[0] || { id: '11111111-1111-1111-1111-111111111111', full_name: 'Nimal Jayasuriya' }

    const branchStreetInfo = STREETS_BY_BRANCH[branchIdx] || STREETS_BY_BRANCH[0]
    const street = branchStreetInfo.streets[(i * 3) % branchStreetInfo.streets.length]
    const houseNumber = ((i * 13) % 180) + 1
    const address = i === 1 ? 'No. 45/2 Galle Road, Colombo 03' : `No. ${houseNumber}, ${street}`

    const birthYear = 1996 + ((i * 3) % 9)
    const birthMonth = String(((i * 5) % 12) + 1).padStart(2, '0')
    const birthDay = String(((i * 7) % 27) + 1).padStart(2, '0')
    const dateOfBirth = i === 1 ? '2001-08-14' : `${birthYear}-${birthMonth}-${birthDay}`

    // Authentic Sri Lankan NIC
    const nic = i === 1 ? '200178901234' : `${birthYear}${String(((i * 37) % 800) + 100).padStart(3, '0')}${String(((i * 19) % 8000) + 1000).padStart(4, '0')}1`

    // Sri Lankan mobile number
    const prefixes = ['77', '71', '76', '75', '78', '70', '72']
    const prefix = prefixes[i % prefixes.length]
    const phoneSuffix = String(100000 + ((i * 8421) % 899999)).slice(0, 7)
    const phone = i === 1 ? '+94 77 123 4567' : `+94 ${prefix} ${phoneSuffix.slice(0, 3)} ${phoneSuffix.slice(3)}`

    // Email
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '')
    const cleanLast = surname.toLowerCase().replace(/[^a-z]/g, '')
    const emailDomain = i % 3 === 0 ? 'yahoo.com' : i % 5 === 0 ? 'outlook.com' : 'gmail.com'
    const email = i === 1 ? 'amaya.fernando@gmail.com' : `${cleanFirst}.${cleanLast}@${emailDomain}`

    // Emergency Contact
    const relativeRelation = isMale ? 'Mother' : 'Father'
    const emergencyContactName = i === 1 ? 'Dr. Rohan Fernando (Father)' : `${surname} (${relativeRelation})`
    const emergencyPhone = i === 1 ? '+94 71 987 6543' : `+94 77 ${String(200000 + ((i * 7321) % 799999)).slice(0, 3)} ${String(1000 + ((i * 4913) % 8999))}`

    // Registration date (staggered from Jan 2026 to Mar 2026)
    const regMonth = String(((i % 3) + 1)).padStart(2, '0')
    const regDay = String(((i * 2) % 26) + 1).padStart(2, '0')
    const registrationDate = i === 1 ? '2026-01-10' : `2026-${regMonth}-${regDay}`

    const studentCodeNum = String(100 + i).padStart(4, '0')
    const studentCode = `ADM-2026-${studentCodeNum}`

    const paddedId = i <= 5
      ? `${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}`
      : String(i).padStart(12, '0')
    const id = `33333333-3333-3333-3333-${paddedId}`

    students.push({
      id,
      driving_school_id: schoolId,
      branch_id: branch.id,
      primary_instructor_id: instructor.id,
      student_code: studentCode,
      full_name: fullName,
      nic,
      date_of_birth: dateOfBirth,
      phone,
      email,
      address,
      emergency_contact_name: emergencyContactName,
      emergency_contact_phone: emergencyPhone,
      registration_date: registrationDate,
      is_active: i !== 88 && i !== 94, // 98 active, 2 inactive
      branch
    })
  }

  return students
}

export function generate100StudentCategoryEnrolments(
  schoolId: string,
  students: DemoStudent[],
  categories: Array<{ id: string; code: string }>
) {
  const enrolments: any[] = []

  students.forEach((st, idx) => {
    // Primary category (mostly Class B car)
    const primaryCat = categories[idx % categories.length] || categories[0]
    enrolments.push({
      student_id: st.id,
      licence_category_id: primaryCat.id,
      driving_school_id: schoolId,
      enrolled_at: `${st.registration_date}T08:00:00Z`,
      is_active: true,
      licence_category: primaryCat,
    })

    // 40% of students also enrol in a second category (e.g., Bike or 3-Wheeler)
    if (idx % 2 === 0) {
      const secondCat = categories[(idx + 2) % categories.length] || categories[1]
      enrolments.push({
        student_id: st.id,
        licence_category_id: secondCat.id,
        driving_school_id: schoolId,
        enrolled_at: `${st.registration_date}T08:00:00Z`,
        is_active: true,
        licence_category: secondCat,
      })
    }
  })

  return enrolments
}

export function generate100Permits(
  schoolId: string,
  students: DemoStudent[]
) {
  const provinces = ['WP', 'CP', 'SP', 'NW']
  const permits: any[] = []

  // 70 students have active DMT Learner Permits
  students.slice(0, 70).forEach((st, idx) => {
    const prov = provinces[idx % provinces.length]
    const permitNum = `DMT-${prov}-2026-${String(10000 + idx * 83).slice(0, 5)}`
    const isExpiringSoon = idx === 13 || idx === 29 || idx === 47

    permits.push({
      id: `per-${String(idx + 1).padStart(3, '0')}`,
      driving_school_id: schoolId,
      student_id: st.id,
      permit_number: permitNum,
      issue_date: st.registration_date,
      expiry_date: isExpiringSoon ? '2026-10-18' : '2027-01-15',
      dmt_reference: `${prov}-2026-PER-${st.student_code.replace('ADM-', '')}`,
      status: isExpiringSoon ? 'expiring_soon' : 'active',
      is_current: true,
      notes: `Valid DMT Learner Permit (${prov} Division)`
    })
  })

  return permits
}

export function generate100Medicals(
  schoolId: string,
  students: DemoStudent[]
) {
  const ntmiCentres = ['NTMI Nugegoda', 'NTMI Gampaha', 'NTMI Kandy', 'NTMI Kurunegala', 'NTMI Galle']
  const bloodGroups = ['A_POSITIVE', 'B_POSITIVE', 'O_POSITIVE', 'AB_POSITIVE', 'O_NEGATIVE']
  const medicals: any[] = []

  // 80 students have NTMI medical certificates
  students.slice(0, 80).forEach((st, idx) => {
    const centre = ntmiCentres[idx % ntmiCentres.length]
    const bg = bloodGroups[idx % bloodGroups.length]
    const certNum = `NTMI-2026-${String(20000 + idx * 71).slice(0, 6)}`
    const withGlasses = idx % 4 === 0

    medicals.push({
      id: `med-${String(idx + 1).padStart(3, '0')}`,
      driving_school_id: schoolId,
      student_id: st.id,
      status: 'passed',
      certificate_number: certNum,
      issued_date: st.registration_date,
      expiry_date: '2027-01-15',
      appointment_date: st.registration_date,
      ntmi_branch: centre,
      blood_group: bg,
      restrictions: withGlasses ? 'corrective_lenses' : 'none',
      notes: withGlasses ? 'Vision corrected with prescription glasses.' : 'Certified medically fit for motor driving.'
    })
  })

  return medicals
}

export function generate100Exams(
  schoolId: string,
  students: DemoStudent[]
) {
  const examHalls = [
    'DMT Werahera Computerized Hall',
    'DMT Gampaha Computerized Hall',
    'DMT Kandy Computerized Hall',
    'DMT Kurunegala Hall',
    'DMT Galle Computerized Hall'
  ]
  const trialGrounds = [
    'DMT Werahera Trial Ground',
    'DMT Gampaha Trial Ground',
    'DMT Kandy Trial Ground',
    'DMT Kurunegala Trial Ground',
    'DMT Galle Trial Ground'
  ]

  const exams: any[] = []

  // Theory exams for 65 students
  students.slice(0, 65).forEach((st, idx) => {
    const hall = examHalls[idx % examHalls.length]
    const score = 35 + (idx % 6) // 35 - 40 out of 40
    exams.push({
      id: `ex-th-${String(idx + 1).padStart(3, '0')}`,
      driving_school_id: schoolId,
      student_id: st.id,
      exam_type: 'theory',
      attempt_number: 1,
      scheduled_date: '2026-05-15',
      status: 'passed',
      score,
      location: hall,
      examiner_notes: `Passed Highway Code computerized theory on first attempt (${score}/40).`
    })

    // Practical trials for 30 students
    if (idx < 30) {
      const ground = trialGrounds[idx % trialGrounds.length]
      const isPassed = idx % 3 === 0
      exams.push({
        id: `ex-pr-${String(idx + 1).padStart(3, '0')}`,
        driving_school_id: schoolId,
        student_id: st.id,
        exam_type: 'practical_trial',
        attempt_number: 1,
        scheduled_date: isPassed ? '2026-08-20' : '2026-10-12',
        status: isPassed ? 'passed' : 'scheduled',
        score: isPassed ? 92 : null,
        location: ground,
        examiner_notes: isPassed ? 'PASSED DMT Practical Trial! Driving licence issued.' : 'Practical driving trial board confirmed.'
      })
    }
  })

  return exams
}

export function generate100PackageEnrolments(
  schoolId: string,
  students: DemoStudent[],
  packages: Array<{ id: string; fee: number }>
) {
  const enrolments: any[] = []

  // 80 students enrolled in packages
  students.slice(0, 80).forEach((st, idx) => {
    const pkg = packages[idx % packages.length] || packages[0]
    enrolments.push({
      id: `penr-${String(idx + 1).padStart(3, '0')}`,
      driving_school_id: schoolId,
      student_id: st.id,
      package_id: pkg.id,
      enrolment_date: st.registration_date,
      agreed_fee: pkg.fee,
      status: 'active',
      discount_amount: idx % 5 === 0 ? 3000 : 0,
      is_active: true,
      package: pkg
    })
  })

  return enrolments
}

export function generate100Payments(
  schoolId: string,
  students: DemoStudent[]
) {
  const paymentMethods = ['cash', 'card', 'bank_transfer', 'online']
  const payments: any[] = []

  // 100 payments across students (average LKR 35,000 each = ~LKR 3,500,000 total revenue)
  students.forEach((st, idx) => {
    const method = paymentMethods[idx % paymentMethods.length]
    const amount = (idx % 2 === 0) ? 65000 : (idx % 3 === 0) ? 48000 : 25000
    const receiptNum = `REC-20260${((idx % 8) + 1)}-${String(1000 + idx)}`

    payments.push({
      id: `pay-${String(idx + 1).padStart(3, '0')}`,
      driving_school_id: schoolId,
      student_id: st.id,
      receipt_number: receiptNum,
      payment_date: st.registration_date,
      amount,
      payment_method: method,
      payment_reference: method === 'cash' ? 'CASH-COL-001' : `TXN-LK-${idx * 941}`,
      notes: 'Course fee installment payment receipt'
    })
  })

  return payments
}

export function generate100Sessions(
  schoolId: string,
  students: DemoStudent[],
  instructors: any[],
  vehicles: any[],
  categories: any[],
  branches: any[]
) {
  const sessions: any[] = []

  // Pre-configured daily schedules across the two key weeks (Sep 28 – Oct 11, 2026)
  // Week 1: 2026-09-28 to 2026-10-04 (Mon – Sun)
  // Week 2: 2026-10-05 to 2026-10-11 (Mon – Sun, including Oct 6 VIVA PRESENTATION DAY)
  const schedulePlan: Array<{
    date: string
    startTime: string
    endTime: string
    studentIdx: number
    instructorIdx: number
    vehicleIdx: number
    catIdx: number
    branchIdx: number
    status: 'completed' | 'scheduled' | 'in_progress' | 'cancelled' | 'no_show'
    attendance: 'present' | 'unmarked' | 'absent'
    feedback: string | null
    rating: number | null
    skills: string[]
    reason?: string
  }> = [
    // --- WEEK 1 ---
    // Monday, Sep 28, 2026
    {
      date: '2026-09-28',
      startTime: '08:00:00',
      endTime: '09:15:00',
      studentIdx: 0,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Excellent clutch bite point control and smooth take-off.',
      rating: 5,
      skills: ['Clutch Control & Gears', 'Hill Start / Gradient'],
    },
    {
      date: '2026-09-28',
      startTime: '09:45:00',
      endTime: '11:00:00',
      studentIdx: 1,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Good mirror checks and lane positioning in Colombo traffic.',
      rating: 5,
      skills: ['Highway & City Traffic', 'Road Signs & Signals'],
    },
    {
      date: '2026-09-28',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 2,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'completed',
      attendance: 'present',
      feedback: 'Steering stability steady, needs slight focus on blind spot checks.',
      rating: 4,
      skills: ['Clutch Control & Gears', 'Lane Discipline & Roundabouts'],
    },
    {
      date: '2026-09-28',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 3,
      instructorIdx: 3,
      vehicleIdx: 4,
      catIdx: 3,
      branchIdx: 1,
      status: 'completed',
      attendance: 'present',
      feedback: 'Heavy commercial air-brake feel mastered without jerking.',
      rating: 5,
      skills: ['Emergency Braking', 'Clutch Control & Gears'],
    },

    // Tuesday, Sep 29, 2026
    {
      date: '2026-09-29',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 4,
      instructorIdx: 4,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Clean reverse S-bend within marked cones without stopping.',
      rating: 5,
      skills: ['Reverse S-Bend', 'Parallel Parking'],
    },
    {
      date: '2026-09-29',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 5,
      instructorIdx: 5,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 3,
      status: 'completed',
      attendance: 'present',
      feedback: 'Accurate 3-point turn on narrow road with proper indicator use.',
      rating: 5,
      skills: ['3-Point Turn', 'Road Signs & Signals'],
    },
    {
      date: '2026-09-29',
      startTime: '14:00:00',
      endTime: '15:15:00',
      studentIdx: 6,
      instructorIdx: 6,
      vehicleIdx: 2,
      catIdx: 2,
      branchIdx: 2,
      status: 'completed',
      attendance: 'present',
      feedback: 'Category A motorcycle figure-8 balance completed flawlessly.',
      rating: 5,
      skills: ['Road Signs & Signals', 'Highway & City Traffic'],
    },
    {
      date: '2026-09-29',
      startTime: '15:45:00',
      endTime: '17:00:00',
      studentIdx: 7,
      instructorIdx: 7,
      vehicleIdx: 3,
      catIdx: 1,
      branchIdx: 4,
      status: 'completed',
      attendance: 'present',
      feedback: 'Three-wheeler sharp turning radius and throttle modulation solid.',
      rating: 4,
      skills: ['Clutch Control & Gears', '3-Point Turn'],
    },

    // Wednesday, Sep 30, 2026
    {
      date: '2026-09-30',
      startTime: '08:00:00',
      endTime: '09:15:00',
      studentIdx: 8,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Hill start completed with zero rollback on 15-degree gradient.',
      rating: 5,
      skills: ['Hill Start / Gradient', 'Clutch Control & Gears'],
    },
    {
      date: '2026-09-30',
      startTime: '09:45:00',
      endTime: '11:00:00',
      studentIdx: 9,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Automatic transmission speed regulation and smooth deceleration.',
      rating: 5,
      skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'],
    },
    {
      date: '2026-09-30',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 10,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'completed',
      attendance: 'present',
      feedback: 'Multi-lane roundabout navigation and timely lane exit signals.',
      rating: 4,
      skills: ['Lane Discipline & Roundabouts', 'Road Signs & Signals'],
    },
    {
      date: '2026-09-30',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 11,
      instructorIdx: 3,
      vehicleIdx: 4,
      catIdx: 3,
      branchIdx: 1,
      status: 'completed',
      attendance: 'present',
      feedback: 'Heavy truck reversing into loading bay with side mirror guidance.',
      rating: 5,
      skills: ['Reverse S-Bend', 'Parallel Parking'],
    },

    // Thursday, Oct 1, 2026
    {
      date: '2026-10-01',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 12,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Full DMT trial simulation completed with zero minor infractions.',
      rating: 5,
      skills: ['Hill Start / Gradient', 'Reverse S-Bend'],
    },
    {
      date: '2026-10-01',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 13,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Emergency braking test executed with prompt stopping distance.',
      rating: 5,
      skills: ['Emergency Braking', 'Road Signs & Signals'],
    },
    {
      date: '2026-10-01',
      startTime: '14:00:00',
      endTime: '15:15:00',
      studentIdx: 14,
      instructorIdx: 5,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 3,
      status: 'completed',
      attendance: 'present',
      feedback: 'Urban congestion driving with smooth pedestrian crossing stop.',
      rating: 4,
      skills: ['Highway & City Traffic', 'Road Signs & Signals'],
    },
    {
      date: '2026-10-01',
      startTime: '15:45:00',
      endTime: '17:00:00',
      studentIdx: 15,
      instructorIdx: 7,
      vehicleIdx: 3,
      catIdx: 1,
      branchIdx: 4,
      status: 'completed',
      attendance: 'present',
      feedback: 'Three wheeler passenger safety maneuvers and horn etiquette.',
      rating: 5,
      skills: ['Highway & City Traffic', '3-Point Turn'],
    },

    // Friday, Oct 2, 2026
    {
      date: '2026-10-02',
      startTime: '08:00:00',
      endTime: '09:15:00',
      studentIdx: 16,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Southern Expressway entrance protocol & high-speed cruising lane.',
      rating: 5,
      skills: ['Highway & City Traffic', 'Lane Discipline & Roundabouts'],
    },
    {
      date: '2026-10-02',
      startTime: '09:45:00',
      endTime: '11:00:00',
      studentIdx: 17,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Tight space parallel parking on Colombo High Level road.',
      rating: 5,
      skills: ['Parallel Parking', '3-Point Turn'],
    },
    {
      date: '2026-10-02',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 18,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'completed',
      attendance: 'present',
      feedback: 'Downshifting on steep slope before hairpin turn in Kandy.',
      rating: 4,
      skills: ['Clutch Control & Gears', 'Hill Start / Gradient'],
    },
    {
      date: '2026-10-02',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 19,
      instructorIdx: 6,
      vehicleIdx: 2,
      catIdx: 2,
      branchIdx: 3,
      status: 'completed',
      attendance: 'present',
      feedback: 'Motorcycle wet weather braking and emergency hazard avoidance.',
      rating: 5,
      skills: ['Emergency Braking', 'Road Signs & Signals'],
    },

    // Saturday, Oct 3, 2026
    {
      date: '2026-10-03',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 20,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Mock trial exam session: Candidate ready for official DMT trial.',
      rating: 5,
      skills: ['Hill Start / Gradient', 'Reverse S-Bend', 'Parallel Parking'],
    },
    {
      date: '2026-10-03',
      startTime: '10:00:00',
      endTime: '11:15:00',
      studentIdx: 21,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'completed',
      attendance: 'present',
      feedback: 'Smooth hill starts and precise lane following under test conditions.',
      rating: 5,
      skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'],
    },
    {
      date: '2026-10-03',
      startTime: '11:30:00',
      endTime: '12:45:00',
      studentIdx: 22,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'completed',
      attendance: 'present',
      feedback: 'Reverse S-bend trial without hitting any boundary markers.',
      rating: 5,
      skills: ['Reverse S-Bend', '3-Point Turn'],
    },
    {
      date: '2026-10-03',
      startTime: '14:00:00',
      endTime: '15:15:00',
      studentIdx: 23,
      instructorIdx: 3,
      vehicleIdx: 4,
      catIdx: 3,
      branchIdx: 1,
      status: 'completed',
      attendance: 'present',
      feedback: 'Commercial vehicle dual clutch downshifting and grade restart.',
      rating: 5,
      skills: ['Clutch Control & Gears', 'Hill Start / Gradient'],
    },
    {
      date: '2026-10-03',
      startTime: '15:30:00',
      endTime: '16:45:00',
      studentIdx: 24,
      instructorIdx: 7,
      vehicleIdx: 3,
      catIdx: 1,
      branchIdx: 4,
      status: 'completed',
      attendance: 'present',
      feedback: 'Coastal highway route driving and hazard anticipation.',
      rating: 4,
      skills: ['Highway & City Traffic', 'Road Signs & Signals'],
    },

    // Sunday, Oct 4, 2026
    {
      date: '2026-10-04',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 25,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Hill Start / Gradient', 'Reverse S-Bend'],
    },
    {
      date: '2026-10-04',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 26,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Highway & City Traffic', 'Lane Discipline & Roundabouts'],
    },
    {
      date: '2026-10-04',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 27,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Parallel Parking', '3-Point Turn'],
    },
    {
      date: '2026-10-04',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 28,
      instructorIdx: 5,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 3,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Emergency Braking', 'Clutch Control & Gears'],
    },

    // --- WEEK 2 (Viva Week) ---
    // Monday, Oct 5, 2026
    {
      date: '2026-10-05',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 29,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Hill Start / Gradient', 'Reverse S-Bend'],
    },
    {
      date: '2026-10-05',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 30,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Parallel Parking', '3-Point Turn'],
    },
    {
      date: '2026-10-05',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 31,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'],
    },
    {
      date: '2026-10-05',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 32,
      instructorIdx: 3,
      vehicleIdx: 4,
      catIdx: 3,
      branchIdx: 1,
      status: 'cancelled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Emergency Braking', 'Clutch Control & Gears'],
      reason: 'Candidate requested cancellation due to university exam.',
    },

    // Tuesday, Oct 6, 2026
    {
      date: '2026-10-06',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 0,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Hill Start / Gradient', 'Clutch Control & Gears'],
    },
    {
      date: '2026-10-06',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 1,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Reverse S-Bend', 'Parallel Parking'],
    },
    {
      date: '2026-10-06',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 4,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'],
    },
    {
      date: '2026-10-06',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 5,
      instructorIdx: 3,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 1,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['3-Point Turn', 'Emergency Braking'],
    },

    // Wednesday, Oct 7, 2026
    {
      date: '2026-10-07',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 33,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Clutch Control & Gears', 'Hill Start / Gradient'],
    },
    {
      date: '2026-10-07',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 34,
      instructorIdx: 3,
      vehicleIdx: 4,
      catIdx: 3,
      branchIdx: 1,
      status: 'cancelled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Reverse S-Bend', 'Emergency Braking'],
      reason: 'Vehicle WP LL-4029 scheduled for routine inspection.',
    },
    {
      date: '2026-10-07',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 35,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Parallel Parking', '3-Point Turn'],
    },
    {
      date: '2026-10-07',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 36,
      instructorIdx: 6,
      vehicleIdx: 2,
      catIdx: 2,
      branchIdx: 2,
      status: 'no_show',
      attendance: 'absent',
      feedback: null,
      rating: null,
      skills: ['Road Signs & Signals', 'Highway & City Traffic'],
      reason: 'Candidate did not attend scheduled lesson (No show).',
    },

    // Thursday, Oct 8, 2026
    {
      date: '2026-10-08',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 37,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Hill Start / Gradient', 'Reverse S-Bend'],
    },
    {
      date: '2026-10-08',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 38,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'],
    },
    {
      date: '2026-10-08',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 39,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Parallel Parking', '3-Point Turn'],
    },
    {
      date: '2026-10-08',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 40,
      instructorIdx: 7,
      vehicleIdx: 3,
      catIdx: 1,
      branchIdx: 4,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['3-Point Turn', 'Road Signs & Signals'],
    },

    // Friday, Oct 9, 2026
    {
      date: '2026-10-09',
      startTime: '08:00:00',
      endTime: '09:15:00',
      studentIdx: 41,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Clutch Control & Gears', 'Hill Start / Gradient'],
    },
    {
      date: '2026-10-09',
      startTime: '09:45:00',
      endTime: '11:00:00',
      studentIdx: 42,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Highway & City Traffic', 'Emergency Braking'],
    },
    {
      date: '2026-10-09',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 43,
      instructorIdx: 5,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 3,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Reverse S-Bend', 'Parallel Parking'],
    },
    {
      date: '2026-10-09',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 44,
      instructorIdx: 3,
      vehicleIdx: 4,
      catIdx: 3,
      branchIdx: 1,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Clutch Control & Gears', 'Emergency Braking'],
    },

    // Saturday, Oct 10, 2026
    {
      date: '2026-10-10',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 45,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Hill Start / Gradient', 'Reverse S-Bend'],
    },
    {
      date: '2026-10-10',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 46,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Parallel Parking', '3-Point Turn'],
    },
    {
      date: '2026-10-10',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 47,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'],
    },
    {
      date: '2026-10-10',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 48,
      instructorIdx: 7,
      vehicleIdx: 3,
      catIdx: 1,
      branchIdx: 4,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['3-Point Turn', 'Emergency Braking'],
    },

    // Sunday, Oct 11, 2026
    {
      date: '2026-10-11',
      startTime: '08:30:00',
      endTime: '09:45:00',
      studentIdx: 49,
      instructorIdx: 0,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Hill Start / Gradient', 'Parallel Parking'],
    },
    {
      date: '2026-10-11',
      startTime: '10:15:00',
      endTime: '11:30:00',
      studentIdx: 50,
      instructorIdx: 1,
      vehicleIdx: 1,
      catIdx: 0,
      branchIdx: 0,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Highway & City Traffic', 'Road Signs & Signals'],
    },
    {
      date: '2026-10-11',
      startTime: '13:30:00',
      endTime: '14:45:00',
      studentIdx: 51,
      instructorIdx: 2,
      vehicleIdx: 0,
      catIdx: 0,
      branchIdx: 2,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Reverse S-Bend', '3-Point Turn'],
    },
    {
      date: '2026-10-11',
      startTime: '15:15:00',
      endTime: '16:30:00',
      studentIdx: 52,
      instructorIdx: 6,
      vehicleIdx: 2,
      catIdx: 2,
      branchIdx: 3,
      status: 'scheduled',
      attendance: 'unmarked',
      feedback: null,
      rating: null,
      skills: ['Emergency Braking', 'Road Signs & Signals'],
    },
  ]

  schedulePlan.forEach((plan, idx) => {
    const student = students[plan.studentIdx % students.length] || students[0]
    const instructor = instructors[plan.instructorIdx % instructors.length] || instructors[0]
    const vehicle = vehicles[plan.vehicleIdx % vehicles.length] || vehicles[0]
    const cat = categories[plan.catIdx % categories.length] || categories[0]
    const branch = branches[plan.branchIdx % branches.length] || branches[0]

    sessions.push({
      id: `ses-${String(idx + 1).padStart(3, '0')}`,
      driving_school_id: schoolId,
      branch_id: branch.id,
      student_id: student.id,
      instructor_id: instructor.id,
      vehicle_id: vehicle.id,
      licence_category_id: cat.id,
      session_date: plan.date,
      start_time: plan.startTime,
      end_time: plan.endTime,
      status: plan.status,
      attendance_status: plan.attendance,
      instructor_feedback: plan.feedback,
      student_rating: plan.rating,
      cancellation_reason: (plan as any).reason || null,
      skills_covered: plan.skills,
      created_at: `${plan.date}T${plan.startTime}.000Z`,
      updated_at: `${plan.date}T${plan.endTime}.000Z`,
      student,
      instructor,
      vehicle,
      licence_category: cat,
      branch,
    })
  })

  return sessions
}
