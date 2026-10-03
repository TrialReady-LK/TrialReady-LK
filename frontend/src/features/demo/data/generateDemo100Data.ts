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
  const todayStr = new Date().toISOString().split('T')[0]
  const sessions: any[] = []

  // 60 Practical Sessions
  students.slice(0, 60).forEach((st, idx) => {
    const instructor = instructors[idx % instructors.length] || instructors[0]
    const vehicle = vehicles[idx % vehicles.length] || vehicles[0]
    const cat = categories[idx % categories.length] || categories[0]
    const branch = branches[idx % branches.length] || branches[0]

    const isToday = idx >= 4 && idx <= 10
    const isCompleted = idx < 4 || idx > 15

    const sessionDate = isToday
      ? todayStr
      : isCompleted
      ? '2026-08-15'
      : '2026-10-08'

    const status = isToday ? 'scheduled' : isCompleted ? 'completed' : 'scheduled'
    const attendance = isCompleted ? 'present' : 'unmarked'

    sessions.push({
      id: `ses-${String(idx + 1).padStart(3, '0')}`,
      driving_school_id: schoolId,
      branch_id: branch.id,
      student_id: st.id,
      instructor_id: instructor.id,
      vehicle_id: vehicle.id,
      licence_category_id: cat.id,
      session_date: sessionDate,
      start_time: '08:30:00',
      end_time: '09:45:00',
      status,
      attendance_status: attendance,
      instructor_feedback: isCompleted ? 'Good clutch control and road discipline.' : null,
      student_rating: isCompleted ? 5 : null,
      skills_covered: ['Clutch Control & Gears', 'Hill Start / Gradient'],
      student: st,
      instructor,
      vehicle,
      licence_category: cat,
      branch
    })
  })

  return sessions
}
