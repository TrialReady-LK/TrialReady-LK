import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
} from '../../../lib/persistentStorage'
import {
  generate100SriLankanStudents,
  generate100StudentCategoryEnrolments,
  generate100Permits,
  generate100Medicals,
  generate100Exams,
  generate100PackageEnrolments,
  generate100Payments,
  generate100Sessions,
} from '../data/generateDemo100Data'

export interface SeedProgressCallback {
  (step: string, percentage: number): void
}

export async function seedDemoAcademyData(
  drivingSchoolId: string,
  onProgress?: SeedProgressCallback,
): Promise<{ success: boolean; message: string }> {
  try {
    const schoolId = drivingSchoolId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

    onProgress?.('Initializing 5 Academy Branches across Sri Lanka...', 5)

    // ========================================================
    // 1. Branches (5 Regional Training Centres)
    // ========================================================
    const branches = [
      {
        id: 'ba111111-1111-1111-1111-111111111111',
        driving_school_id: schoolId,
        name: 'Colombo Central (Nugegoda)',
        phone: '+94 11 281 9001',
        email: 'nugegoda@royaldriving.lk',
        address: 'No. 142 High Level Road, Nugegoda',
        is_active: true,
      },
      {
        id: 'ba222222-2222-2222-2222-222222222222',
        driving_school_id: schoolId,
        name: 'Gampaha Branch (Yakkala)',
        phone: '+94 33 222 4110',
        email: 'gampaha@royaldriving.lk',
        address: 'No. 88 Kandy Road, Yakkala, Gampaha',
        is_active: true,
      },
      {
        id: 'ba333333-3333-3333-3333-333333333333',
        driving_school_id: schoolId,
        name: 'Kandy City Branch (Peradeniya)',
        phone: '+94 81 238 7200',
        email: 'kandy@royaldriving.lk',
        address: 'No. 204 Peradeniya Road, Kandy',
        is_active: true,
      },
      {
        id: 'ba444444-4444-4444-4444-444444444444',
        driving_school_id: schoolId,
        name: 'Kurunegala Branch (Dambulla Road)',
        phone: '+94 37 222 9840',
        email: 'kurunegala@royaldriving.lk',
        address: 'No. 56 Dambulla Road, Kurunegala',
        is_active: true,
      },
      {
        id: 'ba555555-5555-5555-5555-555555555555',
        driving_school_id: schoolId,
        name: 'Galle Coastal Branch (Matara Road)',
        phone: '+94 91 223 8812',
        email: 'galle@royaldriving.lk',
        address: 'No. 112 Matara Road, Galle Fort',
        is_active: true,
      },
    ]
    setStoredData(STORAGE_KEYS.BRANCHES, branches)
    try {
      await supabase.from('branches').upsert(branches, { onConflict: 'id' })
    } catch (e) {
      console.warn('Branches upsert notice:', e)
    }

    onProgress?.('Configuring Sri Lanka DMT Official Licence Categories...', 12)

    // ========================================================
    // 2. Licence Categories
    // ========================================================
    const categories = [
      {
        id: 'ca111111-1111-1111-1111-111111111111',
        driving_school_id: schoolId,
        code: 'B',
        name: 'Dual Purpose / Light Motor Car (Auto & Manual)',
        description: 'Motor vehicles with seating capacity up to 9 persons & gross weight <= 3,500 kg',
        is_active: true,
      },
      {
        id: 'ca222222-2222-2222-2222-222222222222',
        driving_school_id: schoolId,
        code: 'B1',
        name: 'Light Motor Cycle & Three Wheeler',
        description: 'Motor tricycles and light motorcycles with tare weight up to 500 kg',
        is_active: true,
      },
      {
        id: 'ca333333-3333-3333-3333-333333333333',
        driving_school_id: schoolId,
        code: 'A',
        name: 'Heavy Motor Cycle (> 250cc)',
        description: 'Motorcycles with engine capacity exceeding 250cc without sidecar',
        is_active: true,
      },
      {
        id: 'ca444444-4444-4444-4444-444444444444',
        driving_school_id: schoolId,
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

    onProgress?.('Provisioning 12 Dual-Control Fleet Vehicles with Maintenance Logs...', 22)

    // ========================================================
    // 3. Vehicles (12 Fleet Vehicles across 5 branches)
    // ========================================================
    const vehicles = [
      {
        id: '22222222-2222-2222-2222-111111111111',
        driving_school_id: schoolId,
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
        licence_category: categories[0],
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        driving_school_id: schoolId,
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
        licence_category: categories[0],
      },
      {
        id: '22222222-2222-2222-2222-333333333333',
        driving_school_id: schoolId,
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
        licence_category: categories[2],
      },
      {
        id: '22222222-2222-2222-2222-444444444444',
        driving_school_id: schoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        licence_category_id: 'ca222222-2222-2222-2222-222222222222',
        registration_number: 'WP ABF-1904',
        display_name: 'Bajaj RE 4-Stroke 3-Wheeler',
        manufacturer: 'Bajaj',
        model: 'RE 205',
        year_of_manufacture: 2019,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-05-15',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 51200,
        next_service_date: '2026-11-20',
        internal_notes: 'Category B1 three wheeler training unit in Gampaha.',
        branch: { id: 'ba222222-2222-2222-2222-222222222222', name: 'Gampaha Branch (Yakkala)' },
        licence_category: categories[1],
      },
      {
        id: '22222222-2222-2222-2222-555555555555',
        driving_school_id: schoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        licence_category_id: 'ca444444-4444-4444-4444-444444444444',
        registration_number: 'WP LL-4029',
        display_name: 'Isuzu Elf Heavy Dual-Control Truck',
        manufacturer: 'Isuzu',
        model: 'Elf NLR 4.5T',
        year_of_manufacture: 2018,
        transmission_type: 'manual',
        fuel_type: 'diesel',
        photo_path: null,
        date_added: '2025-02-01',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 88400,
        next_service_date: '2026-11-10',
        internal_notes: 'Certified heavy lorry trainer with dual air brakes.',
        branch: { id: 'ba222222-2222-2222-2222-222222222222', name: 'Gampaha Branch (Yakkala)' },
        licence_category: categories[3],
      },
      {
        id: '22222222-2222-2222-2222-666666666666',
        driving_school_id: schoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        registration_number: 'WP NB-5921',
        display_name: 'Nissan Caravan Training Van',
        manufacturer: 'Nissan',
        model: 'Caravan NV350',
        year_of_manufacture: 2019,
        transmission_type: 'manual',
        fuel_type: 'diesel',
        photo_path: null,
        date_added: '2025-06-10',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 67300,
        next_service_date: '2026-12-10',
        internal_notes: 'Dual purpose commercial van trainer.',
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
        licence_category: categories[0],
      },
      {
        id: '22222222-2222-2222-2222-777777777777',
        driving_school_id: schoolId,
        branch_id: 'ba333333-3333-3333-3333-333333333333',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        registration_number: 'CP CAH-5012',
        display_name: 'Honda Vezel Hybrid Dual-Control',
        manufacturer: 'Honda',
        model: 'Vezel e:HEV Dual-Control',
        year_of_manufacture: 2021,
        transmission_type: 'automatic',
        fuel_type: 'hybrid',
        photo_path: null,
        date_added: '2025-07-01',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 31200,
        next_service_date: '2026-11-25',
        internal_notes: 'Kandy branch automatic SUV trainer with hill start assist.',
        branch: { id: 'ba333333-3333-3333-3333-333333333333', name: 'Kandy City Branch (Peradeniya)' },
        licence_category: categories[0],
      },
      {
        id: '22222222-2222-2222-2222-888888888888',
        driving_school_id: schoolId,
        branch_id: 'ba444444-4444-4444-4444-444444444444',
        licence_category_id: 'ca222222-2222-2222-2222-222222222222',
        registration_number: 'NW AA-3912',
        display_name: 'TVS King Deluxe 3-Wheeler',
        manufacturer: 'TVS',
        model: 'King 200',
        year_of_manufacture: 2020,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-08-01',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 39500,
        next_service_date: '2026-12-05',
        internal_notes: 'Kurunegala branch three-wheeler practical trainer.',
        branch: { id: 'ba444444-4444-4444-4444-444444444444', name: 'Kurunegala Branch (Dambulla Road)' },
        licence_category: categories[1],
      },
      {
        id: '22222222-2222-2222-2222-999999999999',
        driving_school_id: schoolId,
        branch_id: 'ba444444-4444-4444-4444-444444444444',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        registration_number: 'NW CAC-1049',
        display_name: 'Suzuki Alto 800 Dual-Control',
        manufacturer: 'Suzuki',
        model: 'Alto 800 LXi',
        year_of_manufacture: 2021,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-08-15',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 26800,
        next_service_date: '2026-11-18',
        internal_notes: 'Kurunegala manual driving car.',
        branch: { id: 'ba444444-4444-4444-4444-444444444444', name: 'Kurunegala Branch (Dambulla Road)' },
        licence_category: categories[0],
      },
      {
        id: '22222222-2222-2222-2222-aaaaaaaaaaaa',
        driving_school_id: schoolId,
        branch_id: 'ba555555-5555-5555-5555-555555555555',
        licence_category_id: 'ca333333-3333-3333-3333-333333333333',
        registration_number: 'SP BE-1204',
        display_name: 'Honda CB160 Hornet Training Bike',
        manufacturer: 'Honda',
        model: 'CB Hornet 160R',
        year_of_manufacture: 2022,
        transmission_type: 'manual',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-09-15',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 14500,
        next_service_date: '2026-12-05',
        internal_notes: 'Southern province coastal motorcycle trainer.',
        branch: { id: 'ba555555-5555-5555-5555-555555555555', name: 'Galle Coastal Branch (Matara Road)' },
        licence_category: categories[2],
      },
      {
        id: '22222222-2222-2222-2222-bbbbbbbbbbbb',
        driving_school_id: schoolId,
        branch_id: 'ba555555-5555-5555-5555-555555555555',
        licence_category_id: 'ca444444-4444-4444-4444-444444444444',
        registration_number: 'SP LK-8091',
        display_name: 'Mitsubishi Canter Heavy Commercial',
        manufacturer: 'Mitsubishi',
        model: 'Canter FE 4.2T',
        year_of_manufacture: 2019,
        transmission_type: 'manual',
        fuel_type: 'diesel',
        photo_path: null,
        date_added: '2025-10-01',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 74200,
        next_service_date: '2026-11-28',
        internal_notes: 'Heavy commercial training lorry in Galle.',
        branch: { id: 'ba555555-5555-5555-5555-555555555555', name: 'Galle Coastal Branch (Matara Road)' },
        licence_category: categories[3],
      },
      {
        id: '22222222-2222-2222-2222-cccccccccccc',
        driving_school_id: schoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        licence_category_id: 'ca111111-1111-1111-1111-111111111111',
        registration_number: 'WP PE-6060',
        display_name: 'Toyota HiAce Dual Control Van',
        manufacturer: 'Toyota',
        model: 'HiAce Commuter Dual-Control',
        year_of_manufacture: 2021,
        transmission_type: 'automatic',
        fuel_type: 'diesel',
        photo_path: null,
        date_added: '2025-10-15',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 36400,
        next_service_date: '2026-12-15',
        internal_notes: 'Automatic passenger transporter and driving trainer.',
        branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)' },
        licence_category: categories[0],
      },
    ]
    setStoredData(STORAGE_KEYS.VEHICLES, vehicles)
    try {
      await supabase.from('vehicles').upsert(vehicles, { onConflict: 'id' })
    } catch (e) {
      console.warn('Vehicles upsert notice:', e)
    }

    onProgress?.('Enrolling 8 Certified DMT Senior Instructors & Qualifications...', 35)

    // ========================================================
    // 4. Instructors (8 DMT Instructors)
    // ========================================================
    const instructors = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        driving_school_id: schoolId,
        branch_id: 'ba111111-1111-1111-1111-111111111111',
        employee_code: 'INS-WP-001',
        full_name: 'Nimal Jayasuriya',
        nic: '197812345678',
        phone: '+94 77 234 5678',
        email: 'nimal@royaldriving.lk',
        driving_licence_number: 'B8291029',
        driving_licence_expiry_date: '2028-12-31',
        joined_date: '2020-01-15',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-222222222222',
        driving_school_id: schoolId,
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
        driving_school_id: schoolId,
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
        driving_school_id: schoolId,
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
      {
        id: '33333333-3333-3333-3333-555555555555',
        driving_school_id: schoolId,
        branch_id: 'ba222222-2222-2222-2222-222222222222',
        employee_code: 'INS-WP-005',
        full_name: 'Rohan Fernando',
        nic: '197945612389',
        phone: '+94 72 678 1234',
        email: 'rohan.fernando@royaldriving.lk',
        driving_licence_number: 'C1092847',
        driving_licence_expiry_date: '2028-09-14',
        joined_date: '2021-08-15',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-666666666666',
        driving_school_id: schoolId,
        branch_id: 'ba444444-4444-4444-4444-444444444444',
        employee_code: 'INS-NW-006',
        full_name: 'Priyantha Kumara',
        nic: '198398765432',
        phone: '+94 77 889 0123',
        email: 'priyantha@royaldriving.lk',
        driving_licence_number: 'B4491028',
        driving_licence_expiry_date: '2027-04-20',
        joined_date: '2022-11-01',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-777777777777',
        driving_school_id: schoolId,
        branch_id: 'ba333333-3333-3333-3333-333333333333',
        employee_code: 'INS-CP-007',
        full_name: 'Anura Bandara',
        nic: '198112349087',
        phone: '+94 71 890 2345',
        email: 'anura.bandara@royaldriving.lk',
        driving_licence_number: 'B7812904',
        driving_licence_expiry_date: '2029-01-30',
        joined_date: '2023-04-12',
        is_active: true,
      },
      {
        id: '33333333-3333-3333-3333-888888888888',
        driving_school_id: schoolId,
        branch_id: 'ba555555-5555-5555-5555-555555555555',
        employee_code: 'INS-SP-008',
        full_name: 'Dilshan Senanayake',
        nic: '198645671239',
        phone: '+94 75 901 3456',
        email: 'dilshan.s@royaldriving.lk',
        driving_licence_number: 'B9018274',
        driving_licence_expiry_date: '2028-06-25',
        joined_date: '2024-02-01',
        is_active: true,
      },
    ]
    setStoredData(STORAGE_KEYS.INSTRUCTORS, instructors)
    try {
      await supabase.from('instructors').upsert(instructors, { onConflict: 'id' })
    } catch (e) {
      console.warn('Instructors upsert notice:', e)
    }

    // Instructor Licence Category mappings
    const instructorLicenceCategories = [
      { instructor_id: instructors[0].id, licence_category_id: categories[0].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[0] },
      { instructor_id: instructors[0].id, licence_category_id: categories[1].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[1] },
      { instructor_id: instructors[0].id, licence_category_id: categories[2].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[2] },
      { instructor_id: instructors[1].id, licence_category_id: categories[0].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[0] },
      { instructor_id: instructors[1].id, licence_category_id: categories[3].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[3] },
      { instructor_id: instructors[2].id, licence_category_id: categories[1].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[1] },
      { instructor_id: instructors[2].id, licence_category_id: categories[2].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[2] },
      { instructor_id: instructors[3].id, licence_category_id: categories[0].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[0] },
      { instructor_id: instructors[4].id, licence_category_id: categories[3].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[3] },
      { instructor_id: instructors[5].id, licence_category_id: categories[0].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[0] },
      { instructor_id: instructors[5].id, licence_category_id: categories[1].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[1] },
      { instructor_id: instructors[6].id, licence_category_id: categories[0].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[0] },
      { instructor_id: instructors[7].id, licence_category_id: categories[0].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[0] },
      { instructor_id: instructors[7].id, licence_category_id: categories[2].id, driving_school_id: schoolId, created_at: '2026-08-01T00:00:00Z', licence_category: categories[2] },
    ]
    setStoredData(STORAGE_KEYS.INSTRUCTOR_LICENCE_CATEGORIES, instructorLicenceCategories)

    onProgress?.('Generating 100 Realistic DMT Learner Profiles across All 5 Branches...', 45)

    // ========================================================
    // 5. Students (100 Diverse Sri Lankan Learner Personas)
    // ========================================================
    const students = generate100SriLankanStudents(schoolId, branches, instructors)
    setStoredData(STORAGE_KEYS.STUDENTS, students)
    try {
      await supabase.from('students').upsert(students, { onConflict: 'id' })
    } catch (e) {
      console.warn('Students upsert notice:', e)
    }

    // Student Licence Enrolments (140+ enrolments)
    const studentLicenceEnrolments = generate100StudentCategoryEnrolments(schoolId, students, categories)
    setStoredData(STORAGE_KEYS.STUDENT_LICENCE_ENROLMENTS, studentLicenceEnrolments)

    onProgress?.('Generating 70 Official DMT Permits with Live Expiry Timers...', 58)

    // ========================================================
    // 6. Permits (70 Official DMT Learner Permits)
    // ========================================================
    const permits = generate100Permits(schoolId, students)
    setStoredData(STORAGE_KEYS.PERMITS, permits)

    onProgress?.('Recording 80 NTMI Official Medical Examination Certificates...', 68)

    // ========================================================
    // 7. Medicals (80 NTMI Medical Records)
    // ========================================================
    const medicals = generate100Medicals(schoolId, students)
    setStoredData(STORAGE_KEYS.MEDICALS, medicals)

    onProgress?.('Scheduling 95 DMT Computerized Theory & Practical Trials...', 78)

    // ========================================================
    // 8. Exams (95 Theory & Practical Trial Milestones)
    // ========================================================
    const exams = generate100Exams(schoolId, students)
    setStoredData(STORAGE_KEYS.EXAMS, exams)

    onProgress?.('Configuring 5 Course Packages & 80 Student Enrolments...', 84)

    // ========================================================
    // 9. Packages & Enrolments
    // ========================================================
    const packages = [
      {
        id: 'pa111111-1111-1111-1111-111111111111',
        driving_school_id: schoolId,
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
        driving_school_id: schoolId,
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
        driving_school_id: schoolId,
        name: 'Motorcycle & Three Wheeler (B1 + A)',
        code: 'PKG-BIKE-3WH',
        description: '10 practical riding & maneuvering sessions, NTMI medical support, and trial vehicle provision.',
        fee: 32000,
        practical_hours_included: 10,
        theory_classes_included: 3,
        is_active: true,
      },
      {
        id: 'pa444444-4444-4444-4444-444444444444',
        driving_school_id: schoolId,
        name: 'Professional Heavy Commercial (Truck C)',
        code: 'PKG-HEAVY-C',
        description: '25 intensive driving hours on dual-control Isuzu Elf/Canter, air-brake systems, reversing docks.',
        fee: 75000,
        practical_hours_included: 25,
        theory_classes_included: 8,
        is_active: true,
      },
      {
        id: 'pa555555-5555-5555-5555-555555555555',
        driving_school_id: schoolId,
        name: 'Express Theory & Highway Code Fast-Track',
        code: 'PKG-THEORY-FAST',
        description: 'Computerized mock test bank access, bilingual study aids, Highway Code flashcards.',
        fee: 15000,
        practical_hours_included: 0,
        theory_classes_included: 10,
        is_active: true,
      },
    ]
    setStoredData(STORAGE_KEYS.PACKAGES, packages)

    const enrolments = generate100PackageEnrolments(schoolId, students, packages)
    setStoredData(STORAGE_KEYS.ENROLMENTS, enrolments)

    onProgress?.('Generating 100 Verified Financial Receipts & Revenue Ledger...', 89)

    // ========================================================
    // 10. Payments (100 Real Student Fee Receipts)
    // ========================================================
    const payments = generate100Payments(schoolId, students)
    setStoredData(STORAGE_KEYS.PAYMENTS, payments)

    onProgress?.('Scheduling 60 Practical Training Sessions & Competency Evaluations...', 94)

    // ========================================================
    // 11. Practical Sessions (60 Completed, Scheduled & Active)
    // ========================================================
    const sessions = generate100Sessions(schoolId, students, instructors, vehicles, categories, branches)
    setStoredData(STORAGE_KEYS.SESSIONS, sessions)

    onProgress?.('Publishing 6 Official DMT Academy Broadcasts...', 98)

    // ========================================================
    // 12. Announcements (6 Academy Broadcasts)
    // ========================================================
    const announcements = [
      {
        id: 'ann-001',
        driving_school_id: schoolId,
        title: 'DMT Werahera Practical Trial Ground Schedule',
        content: 'Notice to all DMT practical driving candidates: Trial sessions at Werahera ground proceed as scheduled on Tuesday and Thursday mornings. All candidates must bring original NIC, DMT Permit, and NTMI medical slips.',
        target_audience: 'all',
        is_pinned: true,
        author_name: 'Principal Instructor Nimal',
        created_at: new Date().toISOString(),
      },
      {
        id: 'ann-002',
        driving_school_id: schoolId,
        title: 'Weekend Computerized Theory Mock Test Workshop',
        content: 'Intensive Sri Lanka Highway Code practice sessions will be held every Saturday from 09:00 AM in the main audio-visual training hall.',
        target_audience: 'students',
        is_pinned: true,
        author_name: 'Chief Theory Instructor',
        created_at: new Date().toISOString(),
      },
      {
        id: 'ann-003',
        driving_school_id: schoolId,
        title: 'New Dual-Control Fleet Addition in Colombo Central',
        content: 'We are pleased to introduce the new Toyota HiAce Dual-Control training van (WP PE-6060) to our Colombo Central fleet for specialized passenger transport coaching.',
        target_audience: 'all',
        is_pinned: false,
        author_name: 'Fleet Supervisor',
        created_at: new Date().toISOString(),
      },
      {
        id: 'ann-004',
        driving_school_id: schoolId,
        title: 'NTMI Medical Examination Schedule for October 2026',
        content: 'Transport Medical appointments for the upcoming batch are scheduled for Wednesday at NTMI Nugegoda and Gampaha centres. Please submit passport size photos by Monday.',
        target_audience: 'students',
        is_pinned: false,
        author_name: 'Student Liaison Officer',
        created_at: new Date().toISOString(),
      },
      {
        id: 'ann-005',
        driving_school_id: schoolId,
        title: 'Heavy Vehicle Trial Preparation Workshop in Gampaha',
        content: 'Specialized pre-trial briefing on air-brake inspection and reversing bay parking for Category C commercial lorry candidates will take place this Sunday at 10:00 AM.',
        target_audience: 'students',
        is_pinned: false,
        author_name: 'Heavy Vehicle Division',
        created_at: new Date().toISOString(),
      },
      {
        id: 'ann-006',
        driving_school_id: schoolId,
        title: 'Instructor Compliance: Bi-Weekly Logbook Verification',
        content: 'All certified instructors are requested to submit physical and digital DMT student logbook verification signatures by the 15th of every month.',
        target_audience: 'instructors',
        is_pinned: false,
        author_name: 'DMT Academy Director',
        created_at: new Date().toISOString(),
      },
    ]
    setStoredData(STORAGE_KEYS.ANNOUNCEMENTS, announcements)

    onProgress?.('Complete! Royal Driving Academy 100+ dataset loaded across all 3 portals.', 100)
    return {
      success: true,
      message: 'Royal Driving Academy demo dataset (100 students & full ecosystem) successfully seeded and persistent!',
    }
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to seed demo data.'
    return { success: false, message: errorMsg }
  }
}

export async function ensureInitialDemoDataSeeded(
  drivingSchoolId?: string,
): Promise<boolean> {
  try {
    const existingStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
    const uniqueNames = new Set(
      existingStudents
        .map((s) => s.full_name?.trim().toLowerCase())
        .filter(Boolean),
    )
    if (existingStudents.length !== 100 || uniqueNames.size < 100) {
      await seedDemoAcademyData(
        drivingSchoolId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      )
      return true
    }
    return false
  } catch (e) {
    console.warn('Initial demo data seeding check error:', e)
    return false
  }
}

export default seedDemoAcademyData
