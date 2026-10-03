import { supabase } from '../../../lib/supabase'
import {
  setStoredData,
  STORAGE_KEYS,
} from '../../../lib/persistentStorage'

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
        email: 'nugegoda@royaldriving.lk',
        address: 'No. 142 High Level Road, Nugegoda',
        is_active: true,
      },
      {
        id: 'ba222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        name: 'Gampaha Branch (Yakkala)',
        phone: '+94 33 222 4110',
        email: 'gampaha@royaldriving.lk',
        address: 'No. 88 Kandy Road, Yakkala, Gampaha',
        is_active: true,
      },
      {
        id: 'ba333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        name: 'Kandy City Branch (Peradeniya)',
        phone: '+94 81 238 7200',
        email: 'kandy@royaldriving.lk',
        address: 'No. 204 Peradeniya Road, Kandy',
        is_active: true,
      },
    ]
    setStoredData(STORAGE_KEYS.BRANCHES, branches)
    try {
      await supabase.from('branches').upsert(branches, { onConflict: 'id' })
    } catch (e) {
      console.warn('Branches upsert notice:', e)
    }

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
    setStoredData(STORAGE_KEYS.LICENCE_CATEGORIES, categories)
    try {
      await supabase.from('licence_categories').upsert(categories, { onConflict: 'id' })
    } catch (e) {
      console.warn('Licence categories upsert notice:', e)
    }

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
        year_of_manufacture: 2020,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-01-15',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 42150,
        next_service_date: '2026-11-15',
        internal_notes: 'Primary manual training hatchback in Colombo Central.',
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
        licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
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
        year_of_manufacture: 2022,
        transmission_type: 'automatic',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-03-10',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 28400,
        next_service_date: '2026-12-01',
        internal_notes: 'Primary auto training car in Colombo Central.',
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
        licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
      },
      {
        id: '22222222-2222-2222-2222-333333333333',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        licence_category_id: 'ca333333-3333-3333-3333-333333333333',
        registration_number: 'CP BC-3042',
        display_name: 'Yamaha FZ 150 Training Bike',
        manufacturer: 'Yamaha',
        model: 'FZ 150',
        year_of_manufacture: 2021,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-04-01',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 19800,
        next_service_date: '2026-10-30',
        internal_notes: 'Category A motorcycle practical training.',
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
        licence_category: { id: 'ca333333-3333-3333-3333-333333333333', code: 'A', name: 'Heavy Motor Cycle (> 250cc)' },
      },
      {
        id: '22222222-2222-2222-2222-444444444444',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        licence_category_id: 'ca222222-2222-2222-2222-222222222222',
        registration_number: 'WP LY-9120',
        display_name: 'Bajaj RE 4-Stroke Three Wheeler',
        manufacturer: 'Bajaj',
        model: 'RE 205 Auto',
        year_of_manufacture: 2020,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-05-15',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 31200,
        next_service_date: '2026-11-20',
        internal_notes: 'Category B1 three wheeler training in Gampaha.',
        branch: { id: 'ba222222-2222-2222-2222-222222222222', name: 'Gampaha Branch (Yakkala)' },
        licence_category: { id: 'ca222222-2222-2222-2222-222222222222', code: 'B1', name: 'Light Motor Cycle & Three Wheeler' },
      },
      {
        id: '22222222-2222-2222-2222-555555555555',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba333333-3333-3333-3333-333333333333',
        licence_category_id: 'ca444444-4444-4444-4444-444444444444',
        registration_number: 'WP GA-7712',
        display_name: 'Isuzu Elf Heavy Dual-Control Lorry',
        manufacturer: 'Isuzu',
        model: 'Elf NPR Dual-Control',
        year_of_manufacture: 2017,
        transmission_type: 'manual',
        fuel_type: 'diesel',
        photo_path: null,
        date_added: '2025-06-01',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 84300,
        next_service_date: '2026-10-28',
        internal_notes: 'Category C heavy vehicle training in Kandy City.',
        branch: { id: 'ba333333-3333-3333-3333-333333333333', name: 'Kandy City Branch (Peradeniya)' },
        licence_category: { id: 'ca444444-4444-4444-4444-444444444444', code: 'C', name: 'Dual Control Heavy Commercial Truck' },
      },
    ]
    setStoredData(STORAGE_KEYS.VEHICLES, vehicles)
    try {
      await supabase.from('vehicles').upsert(vehicles.map(({ branch, licence_category, ...v }) => v), { onConflict: 'id' })
    } catch (e) {
      console.warn('Vehicles upsert notice:', e)
    }

    onProgress?.('Seeding Certified DMT Instructors...', 35)

    // 4. Instructors
    const instructors = [
      {
        id: '33333333-3333-3333-3333-111111111111',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        employee_code: 'INS-WP-001',
        full_name: 'Nimal Jayasuriya',
        nic: '197812345678',
        phone: '+94 77 234 5678',
        email: 'nimal@royaldriving.lk',
        driving_licence_number: 'B8291032',
        driving_licence_expiry_date: '2028-12-31',
        joined_date: '2020-01-15',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-222222222222',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        employee_code: 'INS-WP-002',
        full_name: 'Sunil Perera',
        nic: '198234567890',
        phone: '+94 71 345 6789',
        email: 'sunil@royaldriving.lk',
        driving_licence_number: 'B7192019',
        driving_licence_expiry_date: '2027-08-30',
        joined_date: '2021-03-01',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        employee_code: 'INS-WP-003',
        full_name: 'Chaminda Silva',
        nic: '198545678901',
        phone: '+94 76 456 7890',
        email: 'chaminda@royaldriving.lk',
        driving_licence_number: 'B6491028',
        driving_licence_expiry_date: '2029-05-15',
        joined_date: '2022-06-10',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-444444444444',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba333333-3333-3333-3333-333333333333',
        employee_code: 'INS-WP-004',
        full_name: 'Kanthi Wickramasinghe',
        nic: '198056789012',
        phone: '+94 70 567 8901',
        email: 'kanthi@royaldriving.lk',
        driving_licence_number: 'B9102938',
        driving_licence_expiry_date: '2027-11-20',
        joined_date: '2023-01-05',
        is_active: true,
      },
    ]
    setStoredData(STORAGE_KEYS.INSTRUCTORS, instructors)
    try {
      await supabase.from('instructors').upsert(instructors, { onConflict: 'id' })
    } catch (e) {
      console.warn('Instructors upsert notice:', e)
    }

    onProgress?.('Configuring 5 Distinct DMT Learner Personas...', 50)

    // 5. Students
    const students = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        primary_instructor_id: '33333333-3333-3333-3333-111111111111',
        student_code: 'ADM-2026-0042',
        full_name: 'Amaya Fernando',
        nic: '200178901234',
        date_of_birth: '2001-08-14',
        phone: '+94 77 123 4567',
        email: 'amaya.fernando@gmail.com',
        address: 'No. 45/2 Galle Road, Colombo 03',
        emergency_contact_name: 'Dr. Rohan Fernando (Father)',
        emergency_contact_phone: '+94 71 987 6543',
        registration_date: '2026-01-10',
        is_active: true,
      },
      {
        id: '11111111-1111-1111-1111-222222222222',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        primary_instructor_id: '33333333-3333-3333-3333-222222222222',
        student_code: 'ADM-2026-0058',
        full_name: 'Ravindu Wickramasinghe',
        nic: '199923405678',
        date_of_birth: '1999-04-20',
        phone: '+94 71 456 7890',
        email: 'ravindu.wick@gmail.com',
        address: 'No. 12 Temple Road, Maharagama',
        emergency_contact_name: 'Chitra Wickramasinghe (Mother)',
        emergency_contact_phone: '+94 77 333 4444',
        registration_date: '2026-02-01',
        is_active: true,
      },
      {
        id: '11111111-1111-1111-1111-333333333333',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        primary_instructor_id: '33333333-3333-3333-3333-333333333333',
        student_code: 'ADM-2026-0071',
        full_name: 'Sanduni Jayawardena',
        nic: '200256708912',
        date_of_birth: '2002-11-05',
        phone: '+94 76 890 1234',
        email: 'sanduni.jaya@yahoo.com',
        address: 'No. 88 Kandy Road, Yakkala, Gampaha',
        emergency_contact_name: 'Kamal Jayawardena (Father)',
        emergency_contact_phone: '+94 70 222 1111',
        registration_date: '2026-03-01',
        is_active: true,
      },
      {
        id: '11111111-1111-1111-1111-444444444444',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        primary_instructor_id: '33333333-3333-3333-3333-111111111111',
        student_code: 'ADM-2026-0089',
        full_name: 'Dinesh Kumara',
        nic: '200012304567',
        date_of_birth: '2000-06-18',
        phone: '+94 72 345 6789',
        email: 'dinesh.kumara@outlook.com',
        address: 'No. 31 High Level Road, Nugegoda',
        emergency_contact_name: 'Sunil Kumara (Brother)',
        emergency_contact_phone: '+94 75 444 8888',
        registration_date: '2026-03-15',
        is_active: true,
      },
      {
        id: '11111111-1111-1111-1111-555555555555',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba333333-3333-3333-3333-333333333333',
        primary_instructor_id: '33333333-3333-3333-3333-444444444444',
        student_code: 'ADM-2026-0094',
        full_name: 'Kavindi Perera',
        nic: '200389012345',
        date_of_birth: '2003-01-25',
        phone: '+94 78 901 2345',
        email: 'kavindi.perera@gmail.com',
        address: 'No. 204 Peradeniya Road, Kandy',
        emergency_contact_name: 'Malkanthi Perera (Mother)',
        emergency_contact_phone: '+94 71 777 9999',
        registration_date: '2026-02-15',
        is_active: true,
      },
    ]
    setStoredData(STORAGE_KEYS.STUDENTS, students)
    try {
      await supabase.from('students').upsert(students, { onConflict: 'id' })
    } catch (e) {
      console.warn('Students upsert notice:', e)
    }

    onProgress?.('Seeding Official DMT Permits with Countdown Timers...', 65)

    // 6. Permits
    const permits = [
      {
        id: 'per-001',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-111111111111',
        permit_number: 'DMT-WP-2026-08129',
        issue_date: '2026-01-20',
        expiry_date: '2027-01-20',
        dmt_reference: 'WER-2026-PER-0042',
        status: 'active',
        is_current: true,
        notes: 'Valid DMT Learner Permit (Dual Control Category B & A)',
      },
      {
        id: 'per-002',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-222222222222',
        permit_number: 'DMT-WP-2026-09412',
        issue_date: '2026-02-10',
        expiry_date: '2027-02-10',
        dmt_reference: 'WER-2026-PER-0058',
        status: 'active',
        is_current: true,
        notes: 'Valid DMT Learner Permit (Category B)',
      },
      {
        id: 'per-003',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-333333333333',
        permit_number: 'DMT-CP-2026-04189',
        issue_date: '2026-03-05',
        expiry_date: '2027-03-05',
        dmt_reference: 'GAM-2026-PER-0071',
        status: 'active',
        is_current: true,
        notes: 'Valid DMT Learner Permit (Category B1 Three Wheeler)',
      },
    ]
    setStoredData(STORAGE_KEYS.PERMITS, permits)

    onProgress?.('Generating Verified NTMI Medical Fitness Certificates...', 75)

    // 7. Medicals
    const medicals = [
      {
        id: 'med-001',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-111111111111',
        status: 'passed',
        appointment_date: '2026-01-15',
        certificate_number: 'NTMI-COL-2026-01824',
        issued_date: '2026-01-15',
        expiry_date: '2026-07-15',
        ntmi_branch: 'Nugegoda NTMI Center',
        blood_group: 'A+',
        restrictions: 'Corrective lenses required for driving',
      },
      {
        id: 'med-002',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-222222222222',
        status: 'passed',
        appointment_date: '2026-02-05',
        certificate_number: 'NTMI-COL-2026-02910',
        issued_date: '2026-02-05',
        expiry_date: '2026-08-05',
        ntmi_branch: 'Werahera Main Medical Institute',
        blood_group: 'B+',
        restrictions: 'None',
      },
      {
        id: 'med-003',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-333333333333',
        status: 'passed',
        appointment_date: '2026-03-02',
        certificate_number: 'NTMI-GAM-2026-03118',
        issued_date: '2026-03-02',
        expiry_date: '2026-09-02',
        ntmi_branch: 'Gampaha Hospital Medical Unit',
        blood_group: 'O+',
        restrictions: 'None',
      },
    ]
    setStoredData(STORAGE_KEYS.MEDICALS, medicals)

    // 8. Exam Trials
    const exams = [
      {
        id: 'ex-001',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-111111111111',
        exam_type: 'theory',
        attempt_number: 1,
        scheduled_date: '2026-03-10',
        status: 'passed',
        score: 38,
        location: 'DMT Werahera Computerized Hall',
        examiner_notes: 'Passed with high score (38/40)',
      },
      {
        id: 'ex-002',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-111111111111',
        exam_type: 'practical_trial',
        attempt_number: 1,
        scheduled_date: '2026-10-18',
        status: 'scheduled',
        score: null,
        location: 'Werahera DMT Trial Ground',
        examiner_notes: 'Eligible for final practical trial assessment.',
      },
      {
        id: 'ex-003',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-222222222222',
        exam_type: 'theory',
        attempt_number: 1,
        scheduled_date: '2026-04-12',
        status: 'passed',
        score: 35,
        location: 'DMT Werahera Computerized Hall',
        examiner_notes: 'Passed theory test on first attempt.',
      },
    ]
    setStoredData(STORAGE_KEYS.EXAMS, exams)

    onProgress?.('Enrolling Course Packages & Recording Payments...', 85)

    // 9. Packages
    const packages = [
      {
        id: 'pa111111-1111-1111-1111-111111111111',
        driving_school_id: drivingSchoolId,
        name: 'Dual Combo (Car B Manual + Bike A)',
        code: 'PKG-COMBO-BM',
        description: 'Comprehensive package with 20 practical driving hours, 5 theory classes, and DMT exam trial preparation.',
        fee: 65000,
        practical_hours_included: 20,
        theory_classes_included: 5,
        is_active: true,
      },
      {
        id: 'pa222222-2222-2222-2222-222222222222',
        driving_school_id: drivingSchoolId,
        name: 'Light Motor Car (Auto Only)',
        code: 'PKG-CAR-AUTO',
        description: '15 practical sessions in automatic dual-control hatchback with complete Highway Code classes.',
        fee: 48000,
        practical_hours_included: 15,
        theory_classes_included: 5,
        is_active: true,
      },
      {
        id: 'pa333333-3333-3333-3333-333333333333',
        driving_school_id: drivingSchoolId,
        name: 'Motorcycle & Three Wheeler (B1 + A)',
        code: 'PKG-BIKE-3WH',
        description: '10 practical riding & maneuvering sessions, NTMI medical support, and trial vehicle provision.',
        fee: 32000,
        practical_hours_included: 10,
        theory_classes_included: 3,
        is_active: true,
      },
    ]
    setStoredData(STORAGE_KEYS.PACKAGES, packages)

    // 10. Payments
    const payments = [
      {
        id: 'pay-001',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-111111111111',
        receipt_number: 'REC-20260610-0101',
        payment_date: '2026-06-10',
        amount: 45000,
        payment_method: 'bank_transfer',
        payment_reference: 'BOC-TXN-881920',
        notes: 'Advance Registration Fee',
      },
      {
        id: 'pay-002',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-111111111111',
        receipt_number: 'REC-20260715-0102',
        payment_date: '2026-07-15',
        amount: 20000,
        payment_method: 'cash',
        payment_reference: null,
        notes: 'Final Settlement (Fully Paid)',
      },
      {
        id: 'pay-003',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-222222222222',
        receipt_number: 'REC-20260601-0201',
        payment_date: '2026-06-01',
        amount: 30000,
        payment_method: 'card',
        payment_reference: 'POS-AUTH-44129',
        notes: '1st & 2nd Instalment',
      },
      {
        id: 'pay-004',
        driving_school_id: drivingSchoolId,
        student_id: '11111111-1111-1111-1111-333333333333',
        receipt_number: 'REC-20260715-0301',
        payment_date: '2026-07-15',
        amount: 20000,
        payment_method: 'cash',
        payment_reference: null,
        notes: 'Advance Fee Payment',
      },
    ]
    setStoredData(STORAGE_KEYS.PAYMENTS, payments)

    onProgress?.('Generating Practical Driving Sessions & Today Agenda...', 92)

    // 11. Practical Sessions
    const sessions = [
      {
        id: 'ses-001',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '11111111-1111-1111-1111-111111111111',
        instructor_id: '33333333-3333-3333-3333-111111111111',
        vehicle_id: '22222222-2222-2222-2222-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: '2026-08-10',
        start_time: '08:00:00',
        end_time: '09:15:00',
        status: 'completed',
        attendance_status: 'present',
        instructor_feedback: 'Excellent clutch control and hill start.',
        student_rating: 5,
        skills_covered: ['Clutch Control & Gears', 'Hill Start / Gradient'],
        student: { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', student_code: 'ADM-2026-0042', phone: '+94 77 123 4567' },
        instructor: { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', employee_code: 'INS-WP-001', phone: '+94 77 234 5678' },
        vehicle: { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', display_name: 'Toyota Vitz Dual-Control', manufacturer: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
        licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
      },
      {
        id: 'ses-002',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '11111111-1111-1111-1111-111111111111',
        instructor_id: '33333333-3333-3333-3333-111111111111',
        vehicle_id: '22222222-2222-2222-2222-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: '2026-08-14',
        start_time: '08:00:00',
        end_time: '09:15:00',
        status: 'completed',
        attendance_status: 'present',
        instructor_feedback: 'Clean parallel parking on both sides.',
        student_rating: 5,
        skills_covered: ['Parallel Parking', '3-Point Turn'],
        student: { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', student_code: 'ADM-2026-0042', phone: '+94 77 123 4567' },
        instructor: { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', employee_code: 'INS-WP-001', phone: '+94 77 234 5678' },
        vehicle: { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', display_name: 'Toyota Vitz Dual-Control', manufacturer: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
        licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
      },
      {
        id: 'ses-003',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '11111111-1111-1111-1111-111111111111',
        instructor_id: '33333333-3333-3333-3333-111111111111',
        vehicle_id: '22222222-2222-2222-2222-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: todayStr,
        start_time: '08:30:00',
        end_time: '09:45:00',
        status: 'scheduled',
        attendance_status: 'unmarked',
        instructor_feedback: null,
        student_rating: null,
        skills_covered: ['Mock DMT Trial Simulation', 'Reverse S-Bend Master'],
        student: { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', student_code: 'ADM-2026-0042', phone: '+94 77 123 4567' },
        instructor: { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', employee_code: 'INS-WP-001', phone: '+94 77 234 5678' },
        vehicle: { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', display_name: 'Toyota Vitz Dual-Control', manufacturer: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
        licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
      },
      {
        id: 'ses-004',
        driving_school_id: drivingSchoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        student_id: '11111111-1111-1111-1111-222222222222',
        instructor_id: '33333333-3333-3333-3333-111111111111',
        vehicle_id: '22222222-2222-2222-2222-222222222222',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        session_date: todayStr,
        start_time: '10:00:00',
        end_time: '11:15:00',
        status: 'scheduled',
        attendance_status: 'unmarked',
        instructor_feedback: null,
        student_rating: null,
        skills_covered: ['Reverse S-Bend', 'Hill Start Clutch Balance'],
        student: { id: '11111111-1111-1111-1111-222222222222', full_name: 'Ravindu Wickramasinghe', student_code: 'ADM-2026-0058', phone: '+94 71 456 7890' },
        instructor: { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', employee_code: 'INS-WP-001', phone: '+94 77 234 5678' },
        vehicle: { id: '22222222-2222-2222-2222-222222222222', registration_number: 'WP CBC-8821', display_name: 'Suzuki Swift Auto Dual-Control', manufacturer: 'Suzuki', model: 'Swift Auto Dual-Control', transmission_type: 'automatic' },
        licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
      },
    ]
    setStoredData(STORAGE_KEYS.SESSIONS, sessions)

    // 12. Announcements
    const announcements = [
      {
        id: 'ann-001',
        driving_school_id: drivingSchoolId,
        title: 'DMT Werahera Practical Trial Ground Schedule',
        content: 'Notice to all DMT practical driving candidates: Trial sessions at Werahera ground will proceed as scheduled on Tuesday and Thursday mornings. All candidates must present original NIC, DMT Permit, and NTMI medical slips.',
        target_audience: 'all',
        is_pinned: true,
        author_name: 'Principal Instructor Nimal',
        created_at: new Date().toISOString(),
      },
      {
        id: 'ann-002',
        driving_school_id: drivingSchoolId,
        title: 'Weekend Computerized Theory Mock Test Workshop',
        content: 'Intensive Sri Lanka Highway Code practice sessions will be held every Saturday from 09:00 AM in the main audio-visual training hall.',
        target_audience: 'students',
        is_pinned: false,
        author_name: 'Chief Theory Instructor',
        created_at: new Date().toISOString(),
      },
    ]
    setStoredData(STORAGE_KEYS.ANNOUNCEMENTS, announcements)

    onProgress?.('Done! Academy Demo Data is 100% loaded and persistent.', 100)
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
