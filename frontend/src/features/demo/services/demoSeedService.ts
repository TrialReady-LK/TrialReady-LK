import { supabase } from '../../../lib/supabase'

export interface SeedProgressCallback {
  (step: string, percentage: number): void
}

export async function seedDemoAcademyData(
  drivingSchoolId: string,
  onProgress?: SeedProgressCallback,
): Promise<{ success: boolean; message: string }> {
  try {
    const todayStr = new Date().toISOString().split('T')[0]

    onProgress?.('Initializing Driving School & Branches...', 10)

    // 1. Branches
    const branches = [
      {
        id: 'ba111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        name: 'Colombo Central (Nugegoda)',
        phone: '+94 11 281 9001',
        address: 'No. 142 High Level Road, Nugegoda',
        is_active: true,
      },
      {
        id: 'ba222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        name: 'Gampaha Branch (Yakkala)',
        phone: '+94 33 222 4110',
        address: 'No. 88 Kandy Road, Yakkala, Gampaha',
        is_active: true,
      },
      {
        id: 'ba333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        name: 'Kandy City Branch (Peradeniya)',
        phone: '+94 81 238 7200',
        address: 'No. 204 Peradeniya Road, Kandy',
        is_active: true,
      },
    ]
    await supabase.from('branches').upsert(branches, { onConflict: 'id' })

    onProgress?.('Seeding Licence Categories & Training Fleet...', 20)

    // 2. Licence Categories
    const categories = [
      {
        id: 'ca111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        code: 'B',
        name: 'Dual Purpose / Light Motor Car (Auto & Manual)',
        description: 'Motor vehicles with seating capacity up to 9 persons & gross weight <= 3,500 kg',
        is_active: true,
      },
      {
        id: 'ca222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        code: 'B1',
        name: 'Light Motor Cycle & Three Wheeler',
        description: 'Motor tricycles and light motorcycles',
        is_active: true,
      },
      {
        id: 'ca333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        code: 'A',
        name: 'Heavy Motor Cycle (> 250cc)',
        description: 'Motorcycles with engine capacity exceeding 250cc',
        is_active: true,
      },
      {
        id: 'ca444444-4444-4444-4444-444444444444',
        driving_school_id: drivingSchoolId,
        code: 'C',
        name: 'Dual Control Heavy Commercial Truck',
        description: 'Heavy motor lorries with gross vehicle weight exceeding 3,500 kg',
        is_active: true,
      },
    ]
    await supabase.from('licence_categories').upsert(categories, { onConflict: 'id' })

    // 3. Vehicles
    const vehicles = [
      {
        id: '22222222-2222-2222-2222-111111111111',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        registration_number: 'WP CAB-4921',
        display_name: 'Toyota Vitz Dual-Control',
        manufacturer: 'Toyota',
        model: 'Vitz Dual-Control',
        year_of_manufacture: 2018,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        operational_status: 'active',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        registration_number: 'WP CBC-8821',
        display_name: 'Suzuki Swift Auto Dual-Control',
        manufacturer: 'Suzuki',
        model: 'Swift Auto Dual-Control',
        year_of_manufacture: 2019,
        transmission_type: 'automatic',
        fuel_type: 'petrol',
        operational_status: 'active',
      },
      {
        id: '22222222-2222-2222-2222-333333333333',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        licence_category_id: 'ca333333-3333-3333-3333-333333333333',
        registration_number: 'CP BC-3042',
        display_name: 'Yamaha FZ 150 Training Bike',
        manufacturer: 'Yamaha',
        model: 'FZ 150 Training Bike',
        year_of_manufacture: 2020,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        operational_status: 'active',
      },
      {
        id: '22222222-2222-2222-2222-444444444444',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        registration_number: 'WP NA-1120',
        display_name: 'Toyota HiAce Dual-Purpose Van',
        manufacturer: 'Toyota',
        model: 'HiAce Dual-Purpose Van',
        year_of_manufacture: 2017,
        transmission_type: 'manual',
        fuel_type: 'diesel',
        operational_status: 'active',
      },
      {
        id: '22222222-2222-2222-2222-555555555555',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba333333-3333-3333-3333-333333333333',
        licence_category_id: 'ca444444-4444-4444-4444-444444444444',
        registration_number: 'WP PB-6031',
        display_name: 'Isuzu ELF Heavy Truck',
        manufacturer: 'Isuzu',
        model: 'ELF Heavy Dual-Control Truck',
        year_of_manufacture: 2016,
        transmission_type: 'manual',
        fuel_type: 'diesel',
        operational_status: 'active',
      },
    ]
    await supabase.from('vehicles').upsert(vehicles, { onConflict: 'id' })

    onProgress?.('Seeding Certified DMT Instructors...', 35)

    // 4. Instructors
    const instructors = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        full_name: 'Nimal Jayawardena',
        employee_code: 'INS-WP-001',
        nic: '197814209812',
        phone: '+94 77 123 4567',
        email: 'nimal@royaldriving.lk',
        is_active: true,
      },
      {
        id: '11111111-1111-1111-1111-222222222222',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        full_name: 'Sunil Shantha',
        employee_code: 'INS-WP-002',
        nic: '198223104928',
        phone: '+94 71 987 6543',
        email: 'sunil@royaldriving.lk',
        is_active: true,
      },
      {
        id: '11111111-1111-1111-1111-333333333333',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        full_name: 'Kasun Perera',
        employee_code: 'INS-WP-003',
        nic: '198934102914',
        phone: '+94 76 543 2198',
        email: 'kasun@royaldriving.lk',
        is_active: true,
      },
      {
        id: '11111111-1111-1111-1111-444444444444',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba333333-3333-3333-3333-333333333333',
        full_name: 'Mohamed Rizwan',
        employee_code: 'INS-WP-004',
        nic: '198512304910',
        phone: '+94 72 345 6789',
        email: 'rizwan@royaldriving.lk',
        is_active: true,
      },
    ]
    await supabase.from('instructors').upsert(instructors, { onConflict: 'id' })

    onProgress?.('Configuring 5 Distinct DMT Learner Personas...', 50)

    // 5. Students
    const students = [
      {
        id: '33333333-3333-3333-3333-111111111111',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        full_name: 'Amaya Fernando',
        student_code: 'ADM-2026-0101',
        nic: '200178401923',
        phone: '+94 77 456 7890',
        email: 'amaya.fernando@gmail.com',
        registration_date: '2026-05-10',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-222222222222',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        full_name: 'Ravindu Rathnayaka',
        student_code: 'ADM-2026-0102',
        nic: '199923405812',
        phone: '+94 71 234 5678',
        email: 'ravindu.rathnayaka@gmail.com',
        registration_date: '2026-06-01',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        full_name: 'Sanduni Wickramasinghe',
        student_code: 'ADM-2026-0103',
        nic: '200265109432',
        phone: '+94 76 890 1234',
        email: 'sanduni.w@gmail.com',
        registration_date: '2026-07-15',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-444444444444',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        full_name: 'Dinesh Perera',
        student_code: 'ADM-2026-0104',
        nic: '199834208914',
        phone: '+94 75 678 9012',
        email: 'dinesh.perera@gmail.com',
        registration_date: '2026-03-20',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-555555555555',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba333333-3333-3333-3333-333333333333',
        full_name: 'Kavindi Silva',
        student_code: 'ADM-2026-0105',
        nic: '200384102941',
        phone: '+94 78 901 2345',
        email: 'kavindi.silva@gmail.com',
        registration_date: '2026-08-20',
        is_active: true,
      },
    ]
    await supabase.from('students').upsert(students, { onConflict: 'id' })

    onProgress?.('Seeding Learner Permits, Medicals & Exam Trials...', 65)

    // 6. Permits
    const permits = [
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-111111111111',
        permit_number: 'WP-992140',
        issue_date: '2026-05-15',
        expiry_date: '2026-11-15',
        status: 'active',
        is_current: true,
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-222222222222',
        permit_number: 'WP-884102',
        issue_date: '2026-06-05',
        expiry_date: '2026-12-05',
        status: 'active',
        is_current: true,
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-333333333333',
        permit_number: 'WP-772109',
        issue_date: '2026-07-20',
        expiry_date: '2027-01-20',
        status: 'active',
        is_current: true,
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-444444444444',
        permit_number: 'WP-661203',
        issue_date: '2026-03-25',
        expiry_date: '2026-09-17',
        status: 'active',
        is_current: true,
      },
    ]
    await supabase.from('student_permits').upsert(permits, { onConflict: 'student_id,driving_school_id' })

    // 7. Medicals
    const medicals = [
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-111111111111',
        certificate_number: 'MED-NTMI-9812',
        issued_date: '2026-05-02',
        expiry_date: '2026-11-02',
        ntmi_branch: 'NTMI Nugegoda',
        status: 'passed',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-222222222222',
        certificate_number: 'MED-NTMI-8411',
        issued_date: '2026-05-28',
        expiry_date: '2026-11-28',
        ntmi_branch: 'NTMI Werahera',
        status: 'passed',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-333333333333',
        certificate_number: 'MED-NTMI-7712',
        issued_date: '2026-07-10',
        expiry_date: '2027-01-10',
        ntmi_branch: 'NTMI Colombo',
        status: 'passed',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-444444444444',
        certificate_number: 'MED-NTMI-6601',
        issued_date: '2026-03-15',
        expiry_date: '2026-09-15',
        ntmi_branch: 'NTMI Gampaha',
        status: 'passed',
      },
    ]
    await supabase.from('student_medical_records').upsert(medicals, { onConflict: 'student_id,driving_school_id' })

    // 8. Exam Trials
    const examTrials = [
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-111111111111',
        exam_type: 'theory',
        attempt_number: 1,
        scheduled_date: '2026-05-20',
        status: 'passed',
        score: 92,
        location: 'DMT Werahera',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-222222222222',
        exam_type: 'theory',
        attempt_number: 1,
        scheduled_date: '2026-06-12',
        status: 'passed',
        score: 85,
        location: 'DMT Werahera',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-333333333333',
        exam_type: 'theory',
        attempt_number: 1,
        scheduled_date: '2026-07-25',
        status: 'passed',
        score: 78,
        location: 'DMT Werahera',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-444444444444',
        exam_type: 'theory',
        attempt_number: 1,
        scheduled_date: '2026-04-02',
        status: 'passed',
        score: 75,
        location: 'DMT Gampaha',
      },
    ]
    await supabase.from('student_exam_trials').upsert(examTrials, { onConflict: 'student_id,driving_school_id,exam_type,attempt_number' })

    onProgress?.('Configuring Course Packages, Ledger & Fee Instalments...', 80)

    // 9. Packages
    const packages = [
      {
        id: '44444444-4444-4444-4444-111111111111',
        driving_school_id: drivingSchoolId,
        name: 'Comprehensive Dual-Control Car (Auto + Manual)',
        code: 'PKG-CAR-01',
        description: 'Full DMT syllabus with hill start, reverse S-bend, and trial car',
        fee: 45000,
        practical_hours_included: 15,
        theory_classes_included: 5,
        is_active: true,
      },
      {
        id: '44444444-4444-4444-4444-222222222222',
        driving_school_id: drivingSchoolId,
        name: 'Motorcycle & Three-Wheeler Combo',
        code: 'PKG-BIKE-02',
        description: 'Complete training for Class A & B1 licences including slalom track practice',
        fee: 25000,
        practical_hours_included: 10,
        theory_classes_included: 3,
        is_active: true,
      },
      {
        id: '44444444-4444-4444-4444-333333333333',
        driving_school_id: drivingSchoolId,
        name: 'Commercial Heavy Vehicle Pro (Class C)',
        code: 'PKG-HEAVY-03',
        description: 'Dual control lorry training for heavy vehicle driver certification',
        fee: 65000,
        practical_hours_included: 20,
        theory_classes_included: 5,
        is_active: true,
      },
    ]
    await supabase.from('packages').upsert(packages, { onConflict: 'id' })

    // 10. Enrolments & Payments
    const enrolments = [
      {
        id: 'ea111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-111111111111',
        package_id: '44444444-4444-4444-4444-111111111111',
        agreed_total_fee: 45000,
        enrolled_date: '2026-05-10',
        status: 'active',
      },
      {
        id: 'ea222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-222222222222',
        package_id: '44444444-4444-4444-4444-111111111111',
        agreed_total_fee: 45000,
        enrolled_date: '2026-06-01',
        status: 'active',
      },
      {
        id: 'ea333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-333333333333',
        package_id: '44444444-4444-4444-4444-111111111111',
        agreed_total_fee: 45000,
        enrolled_date: '2026-07-15',
        status: 'active',
      },
      {
        id: 'ea444444-4444-4444-4444-444444444444',
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-444444444444',
        package_id: '44444444-4444-4444-4444-111111111111',
        agreed_total_fee: 45000,
        enrolled_date: '2026-03-20',
        status: 'active',
      },
    ]
    await supabase.from('student_package_enrolments').upsert(enrolments, { onConflict: 'id' })

    const payments = [
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-111111111111',
        enrolment_id: 'ea111111-1111-1111-1111-111111111111',
        amount: 25000,
        payment_date: '2026-05-10',
        payment_method: 'bank_transfer',
        receipt_number: 'REC-20260510-0101',
        notes: 'Initial Registration & Medical Fee',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-111111111111',
        enrolment_id: 'ea111111-1111-1111-1111-111111111111',
        amount: 20000,
        payment_date: '2026-07-15',
        payment_method: 'cash',
        receipt_number: 'REC-20260715-0102',
        notes: 'Final Settlement (Fully Paid)',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-222222222222',
        enrolment_id: 'ea222222-2222-2222-2222-222222222222',
        amount: 30000,
        payment_date: '2026-06-01',
        payment_method: 'card',
        receipt_number: 'REC-20260601-0201',
        notes: '1st & 2nd Instalment',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-333333333333',
        enrolment_id: 'ea333333-3333-3333-3333-333333333333',
        amount: 20000,
        payment_date: '2026-07-15',
        payment_method: 'cash',
        receipt_number: 'REC-20260715-0301',
        notes: 'Advance Fee Payment',
      },
      {
        driving_school_id: drivingSchoolId,
        student_id: '33333333-3333-3333-3333-444444444444',
        enrolment_id: 'ea444444-4444-4444-4444-444444444444',
        amount: 10000,
        payment_date: '2026-03-20',
        payment_method: 'cash',
        receipt_number: 'REC-20260320-0401',
        notes: 'Initial Registration (Overdue balance)',
      },
    ]
    await supabase.from('student_payments').upsert(payments, { onConflict: 'driving_school_id,receipt_number' })

    onProgress?.('Generating Practical Driving Sessions & Today Agenda...', 92)

    // 11. Practical Sessions
    const sessions = [
      // Completed sessions for Amaya
      {
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '33333333-3333-3333-3333-111111111111',
        instructor_id: '11111111-1111-1111-1111-111111111111',
        vehicle_id: '22222222-2222-2222-2222-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: '2026-08-10',
        start_time: '08:00:00',
        end_time: '09:15:00',
        status: 'completed',
        attendance_status: 'present',
        student_rating: 5,
        skills_covered: ['Clutch Control & Gears', 'Hill Start / Gradient'],
      },
      {
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '33333333-3333-3333-3333-111111111111',
        instructor_id: '11111111-1111-1111-1111-111111111111',
        vehicle_id: '22222222-2222-2222-2222-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: '2026-08-14',
        start_time: '08:00:00',
        end_time: '09:15:00',
        status: 'completed',
        attendance_status: 'present',
        student_rating: 5,
        skills_covered: ['Parallel Parking', '3-Point Turn'],
      },
      {
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '33333333-3333-3333-3333-111111111111',
        instructor_id: '11111111-1111-1111-1111-111111111111',
        vehicle_id: '22222222-2222-2222-2222-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: '2026-08-18',
        start_time: '08:00:00',
        end_time: '09:15:00',
        status: 'completed',
        attendance_status: 'present',
        student_rating: 5,
        skills_covered: ['Reverse S-Bend', 'Emergency Braking', 'Highway & City Traffic'],
      },

      // Completed sessions for Ravindu
      {
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '33333333-3333-3333-3333-222222222222',
        instructor_id: '11111111-1111-1111-1111-111111111111',
        vehicle_id: '22222222-2222-2222-2222-222222222222',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: '2026-08-12',
        start_time: '10:00:00',
        end_time: '11:15:00',
        status: 'completed',
        attendance_status: 'present',
        student_rating: 4,
        skills_covered: ['Hill Start / Gradient', 'Parallel Parking'],
      },

      // Today's Live Scheduled Sessions for Lecturer Demonstration
      {
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '33333333-3333-3333-3333-111111111111',
        instructor_id: '11111111-1111-1111-1111-111111111111',
        vehicle_id: '22222222-2222-2222-2222-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: todayStr,
        start_time: '08:30:00',
        end_time: '09:45:00',
        status: 'scheduled',
        attendance_status: 'unmarked',
        student_rating: null,
        skills_covered: ['Mock DMT Trial Simulation', 'Reverse S-Bend Master'],
      },
      {
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '33333333-3333-3333-3333-222222222222',
        instructor_id: '11111111-1111-1111-1111-111111111111',
        vehicle_id: '22222222-2222-2222-2222-222222222222',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: todayStr,
        start_time: '10:00:00',
        end_time: '11:15:00',
        status: 'scheduled',
        attendance_status: 'unmarked',
        student_rating: null,
        skills_covered: ['Reverse S-Bend', 'Hill Start Clutch Balance'],
      },
      {
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '33333333-3333-3333-3333-333333333333',
        instructor_id: '11111111-1111-1111-1111-222222222222',
        vehicle_id: '22222222-2222-2222-2222-222222222222',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: todayStr,
        start_time: '14:00:00',
        end_time: '15:15:00',
        status: 'scheduled',
        attendance_status: 'unmarked',
        student_rating: null,
        skills_covered: ['Parallel Parking', '3-Point Turn in Narrow Lanes'],
      },
    ]
    await supabase.from('practical_sessions').insert(sessions)

    // 12. Announcements
    const announcements = [
      {
        driving_school_id: drivingSchoolId,
        title: 'DMT Werahera Practical Trial Ground Schedule',
        content: 'Notice to all DMT practical driving candidates: Trial sessions at Werahera ground will proceed as scheduled on Tuesday and Thursday mornings. All candidates must present original NIC, DMT Permit, and NTMI medical slips.',
        target_audience: 'all',
        is_pinned: true,
        author_name: 'Principal Instructor Nimal',
      },
      {
        driving_school_id: drivingSchoolId,
        title: 'Weekend Computerized Theory Mock Test Workshop',
        content: 'Intensive Sri Lanka Highway Code practice sessions will be held every Saturday from 09:00 AM in the main audio-visual training hall.',
        target_audience: 'students',
        is_pinned: false,
        author_name: 'Chief Theory Instructor',
      },
    ]
    await supabase.from('academy_announcements').insert(announcements)

    onProgress?.('Done! Academy Demo Data is 100% loaded.', 100)
    return {
      success: true,
      message: 'Royal Driving Academy demo dataset successfully loaded across all 3 portals!',
    }
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to seed demo data.'
    return { success: false, message: errorMsg }
  }
}

export default seedDemoAcademyData
