import type { AppRole, SystemTestAccount } from '../types/auth'

export const DEFAULT_DEMO_SCHOOL_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

export const SYSTEM_TEST_ACCOUNTS: Record<AppRole, SystemTestAccount> = {
  administrator: {
    role: 'administrator',
    email: 'admin@drivingschool.lk',
    password: 'Admin@123',
    name: 'Royal Driving Academy Admin',
    badge: 'Academy Owner / Admin',
    portalPath: '/dashboard',
    profileId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    phone: '+94 11 281 9000',
    branchId: 'ba111111-1111-1111-1111-111111111111',
    description: 'Executive Control, Fleet Management, Financials & Audit Submissions',
    credentialsNote: 'Full master privileges across all branches and instructor fleets.',
  },
  instructor: {
    role: 'instructor',
    email: 'instructor@drivingschool.lk',
    password: 'Instructor@123',
    name: 'Nimal Jayawardena',
    badge: 'Senior Instructor (INS-WP-001)',
    portalPath: '/instructor/portal',
    profileId: '11111111-1111-1111-1111-111111111111',
    phone: '+94 77 123 4567',
    branchId: 'ba111111-1111-1111-1111-111111111111',
    description: "Today's Lessons Agenda, Attendance Marking & AI Session Feedback",
    credentialsNote: 'Assigned to Colombo Central Branch with 3 daily scheduled sessions.',
  },
  student: {
    role: 'student',
    email: 'student@drivingschool.lk',
    password: 'Student@123',
    name: 'Amaya Fernando',
    badge: 'Class B Learner (ADM-2026-0101)',
    portalPath: '/student/portal',
    profileId: '33333333-3333-3333-3333-111111111111',
    phone: '+94 77 456 7890',
    branchId: 'ba111111-1111-1111-1111-111111111111',
    description: 'DMT 6-Month Countdown, AI Readiness (88%) & Official A4 Logbook',
    credentialsNote: 'Active DMT Learner Permit (WP-992140) with 16 completed practical sessions.',
  },
}

export function getPortalRouteForRole(role: AppRole): string {
  switch (role) {
    case 'instructor':
      return '/instructor/portal'
    case 'student':
      return '/student/portal'
    case 'administrator':
    default:
      return '/dashboard'
  }
}
