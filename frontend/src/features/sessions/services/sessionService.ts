import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
  upsertStoredItem,
} from '../../../lib/persistentStorage'
import type {
  CreatePracticalSessionInput,
  PracticalSessionWithRelations,
  RecordAttendanceInput,
  SessionBranchSummary,
  SessionCategorySummary,
  SessionInstructorSummary,
  SessionStudentSummary,
  SessionVehicleSummary,
  UpdatePracticalSessionInput,
} from '../types/session'

const SESSIONS_TABLE = 'practical_sessions'

const SESSION_SELECT_RELATIONS = `
  id,
  driving_school_id,
  branch_id,
  student_id,
  instructor_id,
  vehicle_id,
  licence_category_id,
  session_date,
  start_time,
  end_time,
  status,
  attendance_status,
  instructor_feedback,
  student_rating,
  cancellation_reason,
  skills_covered,
  created_at,
  updated_at,
  student:students(id, full_name, student_code, phone),
  instructor:instructors(id, full_name, employee_code, phone),
  vehicle:vehicles(id, registration_number, display_name, manufacturer, model, transmission_type),
  licence_category:licence_categories(id, code, name),
  branch:branches(id, name)
`

export function getDefaultSessions(): PracticalSessionWithRelations[] {
  const schoolId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

  const branches = [
    { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
    { id: 'ba222222-2222-2222-2222-222222222222', name: 'Gampaha Branch (Yakkala)', code: 'GAM-01' },
    { id: 'ba333333-3333-3333-3333-333333333333', name: 'Kandy City Branch (Peradeniya)', code: 'KAN-01' },
    { id: 'ba444444-4444-4444-4444-444444444444', name: 'Kurunegala Branch (Dambulla Road)', code: 'KUR-01' },
    { id: 'ba555555-5555-5555-5555-555555555555', name: 'Galle Coastal Branch (Matara Road)', code: 'GAL-01' },
  ]

  const categories = [
    { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
    { id: 'ca222222-2222-2222-2222-222222222222', code: 'B1', name: 'Light Motor Cycle & Three Wheeler' },
    { id: 'ca333333-3333-3333-3333-333333333333', code: 'A', name: 'Heavy Motor Cycle (> 250cc)' },
    { id: 'ca444444-4444-4444-4444-444444444444', code: 'C', name: 'Dual Control Heavy Commercial Truck' },
  ]

  const instructors = [
    { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
    { id: '33333333-3333-3333-3333-222222222222', full_name: 'Chaminda Senanayake', staff_number: 'INS-WP-002', phone: '+94 71 345 6789' },
    { id: '33333333-3333-3333-3333-333333333333', full_name: 'Kamal Gunawardena', staff_number: 'INS-CP-003', phone: '+94 77 456 7890' },
    { id: '33333333-3333-3333-3333-444444444444', full_name: 'Suneth Bandara', staff_number: 'INS-SP-004', phone: '+94 76 567 8901' },
    { id: '33333333-3333-3333-3333-555555555555', full_name: 'Mahinda Rajapakse', staff_number: 'INS-WP-005', phone: '+94 72 678 9012' },
    { id: '33333333-3333-3333-3333-666666666666', full_name: 'Priyantha Kumara', staff_number: 'INS-NW-006', phone: '+94 77 889 0123' },
    { id: '33333333-3333-3333-3333-777777777777', full_name: 'Anura Bandara', staff_number: 'INS-CP-007', phone: '+94 71 890 2345' },
    { id: '33333333-3333-3333-3333-888888888888', full_name: 'Dilshan Senanayake', staff_number: 'INS-SP-008', phone: '+94 75 901 3456' },
  ]

  const vehicles = [
    { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-222222222222', registration_number: 'WP CBC-8821', make: 'Suzuki', model: 'Swift Auto Dual-Control', transmission_type: 'automatic' },
    { id: '22222222-2222-2222-2222-333333333333', registration_number: 'CP BC-3042', make: 'Yamaha', model: 'FZ 150', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-444444444444', registration_number: 'WP ABF-1904', make: 'Bajaj', model: 'RE 4-Stroke 3-Wheeler', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-555555555555', registration_number: 'WP LL-4029', make: 'Isuzu', model: 'Elf Heavy Dual-Control Truck', transmission_type: 'manual' },
  ]

  const studentPool = [
    { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', admission_number: 'ADM-2026-0042', phone: '+94 77 123 4567' },
    { id: '11111111-1111-1111-1111-222222222222', full_name: 'Ravindu Wickramasinghe', admission_number: 'ADM-2026-0058', phone: '+94 71 456 7890' },
    { id: '11111111-1111-1111-1111-333333333333', full_name: 'Sanduni Wickramasinghe', admission_number: 'ADM-2026-0071', phone: '+94 77 345 6789' },
    { id: '11111111-1111-1111-1111-444444444444', full_name: 'Dinesh Perera', admission_number: 'ADM-2026-0089', phone: '+94 76 456 7890' },
    { id: '11111111-1111-1111-1111-555555555555', full_name: 'Kavindi Silva', admission_number: 'ADM-2026-0103', phone: '+94 72 567 8901' },
    { id: '11111111-1111-1111-1111-666666666666', full_name: 'Nethmi Jayasekara', admission_number: 'ADM-2026-0118', phone: '+94 78 678 9012' },
    { id: '11111111-1111-1111-1111-777777777777', full_name: 'Dilshan Bandara', admission_number: 'ADM-2026-0125', phone: '+94 71 789 0123' },
    { id: '11111111-1111-1111-1111-888888888888', full_name: 'Malith Karunaratne', admission_number: 'ADM-2026-0139', phone: '+94 75 890 1234' },
    { id: '11111111-1111-1111-1111-999999999999', full_name: 'Kaveesha Gunaratne', admission_number: 'ADM-2026-0144', phone: '+94 70 901 2345' },
    { id: '11111111-1111-1111-1111-000000000010', full_name: 'Hasini Senanayake', admission_number: 'ADM-2026-0157', phone: '+94 77 012 3456' },
  ]

  const plan = [
    // --- Week 1 (Sep 28 – Oct 4, 2026) ---
    { date: '2026-09-28', sTime: '08:00:00', eTime: '09:15:00', sIdx: 0, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Excellent clutch control and hill start.', rating: 5, skills: ['Clutch Control & Gears', 'Hill Start / Gradient'] },
    { date: '2026-09-28', sTime: '09:45:00', eTime: '11:00:00', sIdx: 1, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Good mirror checks and lane positioning.', rating: 5, skills: ['Highway & City Traffic', 'Road Signs & Signals'] },
    { date: '2026-09-28', sTime: '13:30:00', eTime: '14:45:00', sIdx: 2, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'completed', att: 'present', fb: 'Roundabout entry and exit signal discipline.', rating: 4, skills: ['Lane Discipline & Roundabouts', 'Clutch Control & Gears'] },
    { date: '2026-09-28', sTime: '15:15:00', eTime: '16:30:00', sIdx: 3, iIdx: 3, vIdx: 4, cIdx: 3, bIdx: 1, status: 'completed', att: 'present', fb: 'Heavy commercial air-brake handling.', rating: 5, skills: ['Emergency Braking', 'Clutch Control & Gears'] },

    { date: '2026-09-29', sTime: '08:30:00', eTime: '09:45:00', sIdx: 4, iIdx: 4, vIdx: 0, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Clean reverse S-bend within marked cones.', rating: 5, skills: ['Reverse S-Bend', 'Parallel Parking'] },
    { date: '2026-09-29', sTime: '10:15:00', eTime: '11:30:00', sIdx: 5, iIdx: 5, vIdx: 1, cIdx: 0, bIdx: 3, status: 'completed', att: 'present', fb: 'Accurate 3-point turn on narrow gradient.', rating: 5, skills: ['3-Point Turn', 'Road Signs & Signals'] },
    { date: '2026-09-29', sTime: '14:00:00', eTime: '15:15:00', sIdx: 6, iIdx: 6, vIdx: 2, cIdx: 2, bIdx: 2, status: 'completed', att: 'present', fb: 'Category A motorcycle figure-8 balance trial.', rating: 5, skills: ['Road Signs & Signals', 'Highway & City Traffic'] },
    { date: '2026-09-29', sTime: '15:45:00', eTime: '17:00:00', sIdx: 7, iIdx: 7, vIdx: 3, cIdx: 1, bIdx: 4, status: 'completed', att: 'present', fb: 'Three-wheeler sharp turning radius control.', rating: 4, skills: ['Clutch Control & Gears', '3-Point Turn'] },

    { date: '2026-09-30', sTime: '08:00:00', eTime: '09:15:00', sIdx: 8, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Hill start completed with zero rollback.', rating: 5, skills: ['Hill Start / Gradient', 'Clutch Control & Gears'] },
    { date: '2026-09-30', sTime: '09:45:00', eTime: '11:00:00', sIdx: 9, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Automatic transmission speed regulation.', rating: 5, skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'] },
    { date: '2026-09-30', sTime: '13:30:00', eTime: '14:45:00', sIdx: 0, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'completed', att: 'present', fb: 'Multi-lane roundabout navigation practice.', rating: 4, skills: ['Lane Discipline & Roundabouts', 'Road Signs & Signals'] },
    { date: '2026-09-30', sTime: '15:15:00', eTime: '16:30:00', sIdx: 1, iIdx: 3, vIdx: 4, cIdx: 3, bIdx: 1, status: 'completed', att: 'present', fb: 'Heavy truck reversing into docking bay.', rating: 5, skills: ['Reverse S-Bend', 'Parallel Parking'] },

    { date: '2026-10-01', sTime: '08:30:00', eTime: '09:45:00', sIdx: 2, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Full DMT trial simulation completed with zero faults.', rating: 5, skills: ['Hill Start / Gradient', 'Reverse S-Bend'] },
    { date: '2026-10-01', sTime: '10:15:00', eTime: '11:30:00', sIdx: 3, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Emergency braking test executed with prompt distance.', rating: 5, skills: ['Emergency Braking', 'Road Signs & Signals'] },
    { date: '2026-10-01', sTime: '14:00:00', eTime: '15:15:00', sIdx: 4, iIdx: 5, vIdx: 0, cIdx: 0, bIdx: 3, status: 'completed', att: 'present', fb: 'Urban congestion driving with pedestrian safety.', rating: 4, skills: ['Highway & City Traffic', 'Road Signs & Signals'] },
    { date: '2026-10-01', sTime: '15:45:00', eTime: '17:00:00', sIdx: 5, iIdx: 7, vIdx: 3, cIdx: 1, bIdx: 4, status: 'completed', att: 'present', fb: 'Three-wheeler passenger safety maneuvers.', rating: 5, skills: ['Highway & City Traffic', '3-Point Turn'] },

    { date: '2026-10-02', sTime: '08:00:00', eTime: '09:15:00', sIdx: 6, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Southern Expressway entrance protocol & cruising.', rating: 5, skills: ['Highway & City Traffic', 'Lane Discipline & Roundabouts'] },
    { date: '2026-10-02', sTime: '09:45:00', eTime: '11:00:00', sIdx: 7, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Tight space parallel parking on High Level Road.', rating: 5, skills: ['Parallel Parking', '3-Point Turn'] },
    { date: '2026-10-02', sTime: '13:30:00', eTime: '14:45:00', sIdx: 8, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'completed', att: 'present', fb: 'Downshifting on steep slope before hairpin turn.', rating: 4, skills: ['Clutch Control & Gears', 'Hill Start / Gradient'] },
    { date: '2026-10-02', sTime: '15:15:00', eTime: '16:30:00', sIdx: 9, iIdx: 6, vIdx: 2, cIdx: 2, bIdx: 3, status: 'completed', att: 'present', fb: 'Motorcycle wet weather braking and hazard test.', rating: 5, skills: ['Emergency Braking', 'Road Signs & Signals'] },

    { date: '2026-10-03', sTime: '08:30:00', eTime: '09:45:00', sIdx: 0, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Mock trial exam session: Candidate ready for DMT trial.', rating: 5, skills: ['Hill Start / Gradient', 'Reverse S-Bend', 'Parallel Parking'] },
    { date: '2026-10-03', sTime: '10:00:00', eTime: '11:15:00', sIdx: 1, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'completed', att: 'present', fb: 'Smooth hill starts and precise lane following.', rating: 5, skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'] },
    { date: '2026-10-03', sTime: '11:30:00', eTime: '12:45:00', sIdx: 2, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'completed', att: 'present', fb: 'Reverse S-bend trial without touching markers.', rating: 5, skills: ['Reverse S-Bend', '3-Point Turn'] },
    { date: '2026-10-03', sTime: '14:00:00', eTime: '15:15:00', sIdx: 3, iIdx: 3, vIdx: 4, cIdx: 3, bIdx: 1, status: 'completed', att: 'present', fb: 'Commercial vehicle dual clutch downshifting.', rating: 5, skills: ['Clutch Control & Gears', 'Hill Start / Gradient'] },
    { date: '2026-10-03', sTime: '15:30:00', eTime: '16:45:00', sIdx: 4, iIdx: 7, vIdx: 3, cIdx: 1, bIdx: 4, status: 'completed', att: 'present', fb: 'Coastal highway route driving and hazard anticipation.', rating: 4, skills: ['Highway & City Traffic', 'Road Signs & Signals'] },

    { date: '2026-10-04', sTime: '08:30:00', eTime: '09:45:00', sIdx: 5, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Hill Start / Gradient', 'Reverse S-Bend'] },
    { date: '2026-10-04', sTime: '10:15:00', eTime: '11:30:00', sIdx: 6, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Highway & City Traffic', 'Lane Discipline & Roundabouts'] },
    { date: '2026-10-04', sTime: '13:30:00', eTime: '14:45:00', sIdx: 7, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Parallel Parking', '3-Point Turn'] },
    { date: '2026-10-04', sTime: '15:15:00', eTime: '16:30:00', sIdx: 8, iIdx: 5, vIdx: 0, cIdx: 0, bIdx: 3, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Emergency Braking', 'Clutch Control & Gears'] },

    // --- Week 2 (Viva Week, Oct 5 – Oct 11, 2026) ---
    { date: '2026-10-05', sTime: '08:30:00', eTime: '09:45:00', sIdx: 9, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Hill Start / Gradient', 'Reverse S-Bend'] },
    { date: '2026-10-05', sTime: '10:15:00', eTime: '11:30:00', sIdx: 0, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Parallel Parking', '3-Point Turn'] },
    { date: '2026-10-05', sTime: '13:30:00', eTime: '14:45:00', sIdx: 1, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'] },
    { date: '2026-10-05', sTime: '15:15:00', eTime: '16:30:00', sIdx: 2, iIdx: 3, vIdx: 4, cIdx: 3, bIdx: 1, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Emergency Braking', 'Clutch Control & Gears'] },

    // Tuesday, Oct 6: Academic Viva Presentation Day
    { date: '2026-10-06', sTime: '08:30:00', eTime: '10:00:00', sIdx: 0, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: 'Viva Evaluation Session 1: Practical Telemetry Defense & Live Gradient Appraisal.', rating: null, skills: ['Hill Start / Gradient', 'Clutch Control & Gears', 'Reverse S-Bend'] },
    { date: '2026-10-06', sTime: '10:00:00', eTime: '11:30:00', sIdx: 1, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: 'Viva Evaluation Session 2: Automatic Dual-Control Hill Start & Sensor Precision.', rating: null, skills: ['Hill Start / Gradient', 'Parallel Parking', 'Road Signs & Signals'] },
    { date: '2026-10-06', sTime: '11:30:00', eTime: '13:00:00', sIdx: 4, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'scheduled', att: 'unmarked', fb: 'Viva Evaluation Session 3: Precision Reverse S-Bend & Tight Bay Maneuver Defense.', rating: null, skills: ['Reverse S-Bend', '3-Point Turn', 'Parallel Parking'] },
    { date: '2026-10-06', sTime: '13:30:00', eTime: '15:00:00', sIdx: 5, iIdx: 3, vIdx: 1, cIdx: 0, bIdx: 1, status: 'scheduled', att: 'unmarked', fb: 'Viva Evaluation Session 4: DMT Trial Simulation & Examiner Scoring Defense.', rating: null, skills: ['Highway & City Traffic', 'Lane Discipline & Roundabouts', 'Road Signs & Signals'] },
    { date: '2026-10-06', sTime: '15:00:00', eTime: '16:30:00', sIdx: 6, iIdx: 6, vIdx: 2, cIdx: 2, bIdx: 2, status: 'scheduled', att: 'unmarked', fb: 'Viva Evaluation Session 5: Two-Wheeler Slalom & DMT Examiner Scorecard Audit.', rating: null, skills: ['Road Signs & Signals', 'Emergency Braking', 'Highway & City Traffic'] },
    { date: '2026-10-06', sTime: '16:30:00', eTime: '18:00:00', sIdx: 7, iIdx: 7, vIdx: 3, cIdx: 1, bIdx: 4, status: 'scheduled', att: 'unmarked', fb: 'Viva Evaluation Session 6: Night Driving Appraisal & Hazard Perception Defense.', rating: null, skills: ['Night Driving', 'Emergency Braking', 'Road Signs & Signals'] },

    { date: '2026-10-07', sTime: '08:30:00', eTime: '09:45:00', sIdx: 3, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Clutch Control & Gears', 'Hill Start / Gradient'] },
    { date: '2026-10-07', sTime: '10:15:00', eTime: '11:30:00', sIdx: 4, iIdx: 3, vIdx: 4, cIdx: 3, bIdx: 1, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Reverse S-Bend', 'Emergency Braking'] },
    { date: '2026-10-07', sTime: '13:30:00', eTime: '14:45:00', sIdx: 5, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Parallel Parking', '3-Point Turn'] },
    { date: '2026-10-07', sTime: '15:15:00', eTime: '16:30:00', sIdx: 6, iIdx: 6, vIdx: 2, cIdx: 2, bIdx: 2, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Road Signs & Signals', 'Highway & City Traffic'] },

    { date: '2026-10-08', sTime: '08:30:00', eTime: '09:45:00', sIdx: 7, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Hill Start / Gradient', 'Reverse S-Bend'] },
    { date: '2026-10-08', sTime: '10:15:00', eTime: '11:30:00', sIdx: 8, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'] },
    { date: '2026-10-08', sTime: '13:30:00', eTime: '14:45:00', sIdx: 9, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Parallel Parking', '3-Point Turn'] },
    { date: '2026-10-08', sTime: '15:15:00', eTime: '16:30:00', sIdx: 0, iIdx: 7, vIdx: 3, cIdx: 1, bIdx: 4, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['3-Point Turn', 'Road Signs & Signals'] },

    { date: '2026-10-09', sTime: '08:00:00', eTime: '09:15:00', sIdx: 1, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Clutch Control & Gears', 'Hill Start / Gradient'] },
    { date: '2026-10-09', sTime: '09:45:00', eTime: '11:00:00', sIdx: 2, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Highway & City Traffic', 'Emergency Braking'] },
    { date: '2026-10-09', sTime: '13:30:00', eTime: '14:45:00', sIdx: 3, iIdx: 5, vIdx: 0, cIdx: 0, bIdx: 3, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Reverse S-Bend', 'Parallel Parking'] },
    { date: '2026-10-09', sTime: '15:15:00', eTime: '16:30:00', sIdx: 4, iIdx: 3, vIdx: 4, cIdx: 3, bIdx: 1, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Clutch Control & Gears', 'Emergency Braking'] },

    { date: '2026-10-10', sTime: '08:30:00', eTime: '09:45:00', sIdx: 5, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Hill Start / Gradient', 'Reverse S-Bend'] },
    { date: '2026-10-10', sTime: '10:15:00', eTime: '11:30:00', sIdx: 6, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Parallel Parking', '3-Point Turn'] },
    { date: '2026-10-10', sTime: '13:30:00', eTime: '14:45:00', sIdx: 7, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Lane Discipline & Roundabouts', 'Highway & City Traffic'] },
    { date: '2026-10-10', sTime: '15:15:00', eTime: '16:30:00', sIdx: 8, iIdx: 7, vIdx: 3, cIdx: 1, bIdx: 4, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['3-Point Turn', 'Emergency Braking'] },

    { date: '2026-10-11', sTime: '08:30:00', eTime: '09:45:00', sIdx: 9, iIdx: 0, vIdx: 0, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Hill Start / Gradient', 'Parallel Parking'] },
    { date: '2026-10-11', sTime: '10:15:00', eTime: '11:30:00', sIdx: 0, iIdx: 1, vIdx: 1, cIdx: 0, bIdx: 0, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Highway & City Traffic', 'Road Signs & Signals'] },
    { date: '2026-10-11', sTime: '13:30:00', eTime: '14:45:00', sIdx: 1, iIdx: 2, vIdx: 0, cIdx: 0, bIdx: 2, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Reverse S-Bend', '3-Point Turn'] },
    { date: '2026-10-11', sTime: '15:15:00', eTime: '16:30:00', sIdx: 2, iIdx: 6, vIdx: 2, cIdx: 2, bIdx: 3, status: 'scheduled', att: 'unmarked', fb: null, rating: null, skills: ['Emergency Braking', 'Road Signs & Signals'] },
  ]

  return plan.map((p, idx) => {
    const student = studentPool[p.sIdx % studentPool.length]
    const instructor = instructors[p.iIdx % instructors.length]
    const vehicle = vehicles[p.vIdx % vehicles.length]
    const cat = categories[p.cIdx % categories.length]
    const branch = branches[p.bIdx % branches.length]

    return {
      id: `ses-${String(idx + 1).padStart(3, '0')}`,
      driving_school_id: schoolId,
      branch_id: branch.id,
      student_id: student.id,
      instructor_id: instructor.id,
      vehicle_id: vehicle.id,
      licence_category_id: cat.id,
      session_date: p.date,
      start_time: p.sTime,
      end_time: p.eTime,
      status: p.status as PracticalSessionWithRelations['status'],
      attendance_status: p.att as PracticalSessionWithRelations['attendance_status'],
      instructor_feedback: p.fb,
      student_rating: p.rating,
      cancellation_reason: null,
      skills_covered: p.skills,
      created_at: `${p.date}T${p.sTime}.000Z`,
      updated_at: `${p.date}T${p.eTime}.000Z`,
      student,
      instructor,
      vehicle,
      licence_category: cat,
      branch,
    }
  })
}

export async function getPracticalSessions(
  drivingSchoolId: string,
  options?: {
    startDate?: string
    endDate?: string
    branchId?: string
    instructorId?: string
    studentId?: string
    vehicleId?: string
  },
): Promise<PracticalSessionWithRelations[]> {
  const defaults = getDefaultSessions()
  let localList = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    defaults,
  )

  // If local list is empty or legacy low count, refresh with comprehensive multi-day schedule
  if (!localList || localList.length < 30) {
    localList = defaults
    setStoredData(STORAGE_KEYS.SESSIONS, defaults)
  }

  try {
    let query = supabase
      .from(SESSIONS_TABLE)
      .select(SESSION_SELECT_RELATIONS)
      .eq('driving_school_id', drivingSchoolId)
      .order('session_date', { ascending: true })
      .order('start_time', { ascending: true })

    if (options?.startDate) query = query.gte('session_date', options.startDate)
    if (options?.endDate) query = query.lte('session_date', options.endDate)
    if (options?.branchId) query = query.eq('branch_id', options.branchId)
    if (options?.instructorId) query = query.eq('instructor_id', options.instructorId)
    if (options?.studentId) query = query.eq('student_id', options.studentId)
    if (options?.vehicleId) query = query.eq('vehicle_id', options.vehicleId)

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return filterSessionsLocally(localList, options)
    }

    const remote = data as unknown as PracticalSessionWithRelations[]
    const merged = [...localList]
    for (const r of remote) {
      const idx = merged.findIndex((m) => m.id === r.id)
      if (idx !== -1) {
        merged[idx] = { ...r, ...merged[idx] }
      } else {
        merged.push(r)
      }
    }
    setStoredData(STORAGE_KEYS.SESSIONS, merged)
    return filterSessionsLocally(merged, options)
  } catch {
    return filterSessionsLocally(localList, options)
  }
}

function filterSessionsLocally(
  list: PracticalSessionWithRelations[],
  options?: {
    startDate?: string
    endDate?: string
    branchId?: string
    instructorId?: string
    studentId?: string
    vehicleId?: string
  },
): PracticalSessionWithRelations[] {
  let filtered = [...list]
  if (options?.startDate) {
    filtered = filtered.filter((s) => s.session_date >= options.startDate!)
  }
  if (options?.endDate) {
    filtered = filtered.filter((s) => s.session_date <= options.endDate!)
  }
  if (options?.branchId) {
    filtered = filtered.filter((s) => s.branch_id === options.branchId)
  }
  if (options?.instructorId) {
    filtered = filtered.filter((s) => s.instructor_id === options.instructorId)
  }
  if (options?.studentId) {
    filtered = filtered.filter((s) => s.student_id === options.studentId)
  }
  if (options?.vehicleId) {
    filtered = filtered.filter((s) => s.vehicle_id === options.vehicleId)
  }
  return filtered
}

export async function getPracticalSessionById(
  sessionId: string,
): Promise<PracticalSessionWithRelations> {
  const localList = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    getDefaultSessions(),
  )
  const cached = localList.find((s) => s.id === sessionId)

  try {
    const { data } = await supabase
      .from(SESSIONS_TABLE)
      .select(SESSION_SELECT_RELATIONS)
      .eq('id', sessionId)
      .single()

    if (data) {
      const remote = data as unknown as PracticalSessionWithRelations
      upsertStoredItem(STORAGE_KEYS.SESSIONS, remote)
      return remote
    }
  } catch {
    // fallback
  }

  if (cached) return cached
  throw new Error('Practical session not found')
}

export async function createPracticalSession(
  input: CreatePracticalSessionInput,
): Promise<PracticalSessionWithRelations> {
  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `ses-${Date.now()}`
  const newSession: PracticalSessionWithRelations = {
    id: generatedId,
    driving_school_id: input.driving_school_id,
    branch_id: input.branch_id,
    student_id: input.student_id,
    instructor_id: input.instructor_id,
    vehicle_id: input.vehicle_id || null,
    licence_category_id: input.licence_category_id,
    session_date: input.session_date,
    start_time: input.start_time,
    end_time: input.end_time,
    status: 'scheduled',
    attendance_status: 'unmarked',
    instructor_feedback: null,
    student_rating: null,
    cancellation_reason: null,
    skills_covered: input.skills_covered || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    student: { id: input.student_id, full_name: 'Amaya Fernando', admission_number: 'ADM-2026-0042', phone: '+94 77 123 4567' },
    instructor: { id: input.instructor_id, full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
    vehicle: input.vehicle_id
      ? { id: input.vehicle_id, registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' }
      : null,
    licence_category: { id: input.licence_category_id, code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
    branch: { id: input.branch_id, name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
  }

  upsertStoredItem(STORAGE_KEYS.SESSIONS, newSession)

  try {
    await supabase.from(SESSIONS_TABLE).insert([
      {
        id: generatedId,
        driving_school_id: input.driving_school_id,
        branch_id: input.branch_id,
        student_id: input.student_id,
        instructor_id: input.instructor_id,
        vehicle_id: input.vehicle_id || null,
        licence_category_id: input.licence_category_id,
        session_date: input.session_date,
        start_time: input.start_time,
        end_time: input.end_time,
        status: 'scheduled',
        attendance_status: 'unmarked',
        skills_covered: input.skills_covered || [],
      },
    ])
  } catch (err) {
    console.warn('Supabase session schedule notice:', err)
  }

  return newSession
}

export async function updatePracticalSession(
  sessionId: string,
  input: UpdatePracticalSessionInput,
): Promise<PracticalSessionWithRelations> {
  const localList = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    getDefaultSessions(),
  )
  const existing = localList.find((s) => s.id === sessionId) || getDefaultSessions()[0]

  const updated: PracticalSessionWithRelations = {
    ...existing,
    ...input,
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.SESSIONS, updated)

  try {
    await supabase.from(SESSIONS_TABLE).update(input).eq('id', sessionId)
  } catch (err) {
    console.warn('Supabase session update notice:', err)
  }

  return updated
}

export async function recordSessionAttendance(
  sessionId: string,
  input: RecordAttendanceInput,
): Promise<PracticalSessionWithRelations> {
  const updatePayload: UpdatePracticalSessionInput = {
    attendance_status: input.attendance_status,
    status: input.attendance_status === 'present' ? 'completed' : 'scheduled',
    instructor_feedback: input.instructor_feedback ?? null,
    student_rating: input.student_rating ?? null,
    skills_covered: input.skills_covered,
  }

  return updatePracticalSession(sessionId, updatePayload)
}

export async function cancelPracticalSession(
  sessionId: string,
  cancellationReason: string,
): Promise<PracticalSessionWithRelations> {
  return updatePracticalSession(sessionId, {
    status: 'cancelled',
    cancellation_reason: cancellationReason,
  })
}

export async function deletePracticalSession(sessionId: string): Promise<void> {
  const localList = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    getDefaultSessions(),
  )
  setStoredData(
    STORAGE_KEYS.SESSIONS,
    localList.filter((s) => s.id !== sessionId),
  )

  try {
    await supabase.from(SESSIONS_TABLE).delete().eq('id', sessionId)
  } catch (err) {
    console.warn('Supabase delete session notice:', err)
  }
}

export async function getBranchesForSessions(
  _drivingSchoolId: string,
): Promise<SessionBranchSummary[]> {
  return [
    { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
    { id: 'ba222222-2222-2222-2222-222222222222', name: 'Gampaha Branch (Yakkala)', code: 'GAM-01' },
    { id: 'ba333333-3333-3333-3333-333333333333', name: 'Kandy City Branch (Peradeniya)', code: 'KAN-01' },
  ]
}

export async function getCategoriesForSessions(
  _drivingSchoolId: string,
): Promise<SessionCategorySummary[]> {
  return [
    { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
    { id: 'ca222222-2222-2222-2222-222222222222', code: 'B1', name: 'Light Motor Cycle & Three Wheeler' },
    { id: 'ca333333-3333-3333-3333-333333333333', code: 'A', name: 'Heavy Motor Cycle (> 250cc)' },
    { id: 'ca444444-4444-4444-4444-444444444444', code: 'C', name: 'Dual Control Heavy Commercial Truck' },
  ]
}

export async function getInstructorsForSessions(
  _drivingSchoolId: string,
): Promise<SessionInstructorSummary[]> {
  return [
    { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
    { id: '33333333-3333-3333-3333-222222222222', full_name: 'Sunil Perera', staff_number: 'INS-WP-002', phone: '+94 71 345 6789' },
    { id: '33333333-3333-3333-3333-333333333333', full_name: 'Chaminda Silva', staff_number: 'INS-WP-003', phone: '+94 76 456 7890' },
    { id: '33333333-3333-3333-3333-444444444444', full_name: 'Kanthi Wickramasinghe', staff_number: 'INS-WP-004', phone: '+94 70 567 8901' },
  ]
}

export async function getStudentsForSessions(
  _drivingSchoolId: string,
): Promise<SessionStudentSummary[]> {
  return [
    { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', admission_number: 'ADM-2026-0042', phone: '+94 77 123 4567' },
    { id: '11111111-1111-1111-1111-222222222222', full_name: 'Ravindu Wickramasinghe', admission_number: 'ADM-2026-0058', phone: '+94 71 456 7890' },
    { id: '11111111-1111-1111-1111-333333333333', full_name: 'Sanduni Jayawardena', admission_number: 'ADM-2026-0071', phone: '+94 76 890 1234' },
    { id: '11111111-1111-1111-1111-444444444444', full_name: 'Dinesh Kumara', admission_number: 'ADM-2026-0089', phone: '+94 72 345 6789' },
    { id: '11111111-1111-1111-1111-555555555555', full_name: 'Kavindi Perera', admission_number: 'ADM-2026-0094', phone: '+94 78 901 2345' },
  ]
}

export async function getVehiclesForSessions(
  _drivingSchoolId: string,
): Promise<SessionVehicleSummary[]> {
  return [
    { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-222222222222', registration_number: 'WP CBC-8821', make: 'Suzuki', model: 'Swift Auto Dual-Control', transmission_type: 'automatic' },
    { id: '22222222-2222-2222-2222-333333333333', registration_number: 'CP BC-3042', make: 'Yamaha', model: 'FZ 150', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-444444444444', registration_number: 'WP LY-9120', make: 'Bajaj', model: 'RE 205 Auto', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-555555555555', registration_number: 'WP GA-7712', make: 'Isuzu', model: 'Elf NPR Dual-Control', transmission_type: 'manual' },
  ]
}
