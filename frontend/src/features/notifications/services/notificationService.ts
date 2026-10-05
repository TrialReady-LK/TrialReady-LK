import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
} from '../../../lib/persistentStorage'
import type {
  AcademyAnnouncement,
  AppNotification,
  CreateAnnouncementInput,
  CreateNotificationInput,
} from '../types/notifications'

export const DEFAULT_ACADEMY_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    recipient_type: 'all_staff',
    type: 'permit_expiring',
    title: "DMT 6-Month Learner's Permit Expiry Warning",
    message:
      'Dinesh Gunawardena (Permit #LP-WP-89210) has only 18 days remaining before permit lapses. Immediate trial booking or 3-month extension application required.',
    channel: 'in_app',
    priority: 'urgent',
    status: 'unread',
    action_url: '/journey',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'notif-002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    recipient_type: 'all_students',
    type: 'session_reminder',
    title: 'Practical Driving Lesson Scheduled',
    message:
      'Dual-control practical session booked for tomorrow at 08:30 AM (Vehicle: WP CAB-4921) with Senior Instructor Nimal Jayasuriya.',
    channel: 'sms',
    priority: 'medium',
    status: 'read',
    action_url: '/sessions',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'notif-003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    recipient_type: 'all_staff',
    type: 'permit_expiring',
    title: 'Statutory 90-Day Waiting Period Completed',
    message:
      'Sanduni Wickramasinghe has completed the mandatory 90-day waiting period post-theory exam. Candidate is now legally eligible for DMT Practical Trial booking at Werahera.',
    channel: 'whatsapp',
    priority: 'high',
    status: 'unread',
    action_url: '/journey',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'notif-004',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    recipient_type: 'all_staff',
    type: 'medical_expiring',
    title: 'NTMI Medical Clearance Renewal Required',
    message:
      "Kavindi Silva's NTMI Medical Fitness Certificate (Cert #MED-2025-4412) expires in 12 days. Candidate must renew medical clearance prior to practical trial endorsement.",
    channel: 'sms',
    priority: 'urgent',
    status: 'unread',
    action_url: '/students',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 'notif-005',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    recipient_type: 'all_students',
    type: 'payment_due',
    title: 'Course Fee Final Settlement Notice',
    message:
      'Amal Madushanka has an outstanding course balance of LKR 15,000 due prior to official DMT practical trial day vehicle allocation.',
    channel: 'whatsapp',
    priority: 'high',
    status: 'unread',
    action_url: '/financials',
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
  },
  {
    id: 'notif-006',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    recipient_type: 'student',
    type: 'trial_scheduled',
    title: 'Official DMT Practical Trial Date Confirmed',
    message:
      'Department of Motor Traffic scheduled practical trial for Amaya Fernando on 2026-10-18 at Werahera Trial Grounds. Dual-control vehicle WP CAB-4921 reserved.',
    channel: 'in_app',
    priority: 'urgent',
    status: 'unread',
    action_url: '/readiness',
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
  },
  {
    id: 'notif-007',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    recipient_type: 'student',
    type: 'session_reminder',
    title: 'DMT Computerized Theory Exam Passed',
    message:
      "Ravindu Rathnayaka scored 36/40 in Highway Code Theory Exam. 6-Month Learner's Permit processing initiated with DMT Werahera branch.",
    channel: 'in_app',
    priority: 'medium',
    status: 'read',
    action_url: '/journey',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    read_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
  },
  {
    id: 'notif-008',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    recipient_type: 'all_staff',
    type: 'permit_expiring',
    title: 'Vehicle Revenue Licence & DMT Fitness Due',
    message:
      'Training vehicle WP CAB-4921 (Toyota Vitz Dual-Control) is scheduled for mandatory DMT annual dual-control fitness and emissions inspection next Monday.',
    channel: 'in_app',
    priority: 'high',
    status: 'unread',
    action_url: '/vehicles',
    created_at: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
  },
]

export async function getNotifications(
  drivingSchoolId: string,
): Promise<AppNotification[]> {
  const localList = getStoredData<AppNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    [],
  )

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('driving_school_id', drivingSchoolId)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      if (localList.length === 0) {
        setStoredData(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_ACADEMY_NOTIFICATIONS)
        return DEFAULT_ACADEMY_NOTIFICATIONS
      }
      return localList
    }

    // Merge Supabase with default/local
    const combined = [...data, ...localList.filter((l) => !data.some((d) => d.id === l.id))]
    if (combined.length <= 1) {
      const merged = [
        ...combined,
        ...DEFAULT_ACADEMY_NOTIFICATIONS.filter((d) => !combined.some((c) => c.id === d.id)),
      ]
      setStoredData(STORAGE_KEYS.NOTIFICATIONS, merged)
      return merged
    }

    return combined as AppNotification[]
  } catch {
    if (localList.length === 0) {
      setStoredData(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_ACADEMY_NOTIFICATIONS)
      return DEFAULT_ACADEMY_NOTIFICATIONS
    }
    return localList
  }
}

export async function createNotification(
  input: CreateNotificationInput,
): Promise<AppNotification> {
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    driving_school_id: input.driving_school_id,
    recipient_type: input.recipient_type,
    recipient_id: input.recipient_id ?? null,
    type: input.type,
    title: input.title,
    message: input.message,
    channel: input.channel ?? 'in_app',
    priority: input.priority ?? 'medium',
    action_url: input.action_url ?? null,
    status: 'unread',
    created_at: new Date().toISOString(),
  }

  const localList = getStoredData<AppNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    DEFAULT_ACADEMY_NOTIFICATIONS,
  )
  setStoredData(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...localList])

  try {
    await supabase.from('notifications').insert([newNotif])
  } catch {
    // offline/local storage fallback
  }

  return newNotif
}

export async function markNotificationRead(id: string): Promise<void> {
  const localList = getStoredData<AppNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    DEFAULT_ACADEMY_NOTIFICATIONS,
  )
  const updated = localList.map((n) =>
    n.id === id ? { ...n, status: 'read' as const, read_at: new Date().toISOString() } : n,
  )
  setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated)

  try {
    await supabase
      .from('notifications')
      .update({
        status: 'read',
        read_at: new Date().toISOString(),
      })
      .eq('id', id)
  } catch {
    // offline/fallback
  }
}

export async function markAllNotificationsRead(
  drivingSchoolId: string,
): Promise<void> {
  const localList = getStoredData<AppNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    DEFAULT_ACADEMY_NOTIFICATIONS,
  )
  const updated = localList.map((n) => ({
    ...n,
    status: 'read' as const,
    read_at: new Date().toISOString(),
  }))
  setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated)

  try {
    await supabase
      .from('notifications')
      .update({
        status: 'read',
        read_at: new Date().toISOString(),
      })
      .eq('driving_school_id', drivingSchoolId)
      .eq('status', 'unread')
  } catch {
    // offline/fallback
  }
}

export async function deleteNotification(id: string): Promise<void> {
  const localList = getStoredData<AppNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    DEFAULT_ACADEMY_NOTIFICATIONS,
  )
  const updated = localList.filter((n) => n.id !== id)
  setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated)

  try {
    await supabase.from('notifications').delete().eq('id', id)
  } catch {
    // offline/fallback
  }
}

// ==========================================
// Announcements / Notice Board
// ==========================================

export async function getAnnouncements(
  drivingSchoolId: string,
): Promise<AcademyAnnouncement[]> {
  const { data, error } = await supabase
    .from('academy_announcements')
    .select('*')
    .eq('driving_school_id', drivingSchoolId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to load announcements: ${error.message}`)
  }

  return (data as AcademyAnnouncement[]) ?? []
}

export async function createAnnouncement(
  input: CreateAnnouncementInput,
): Promise<AcademyAnnouncement> {
  const { data, error } = await supabase
    .from('academy_announcements')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        title: input.title,
        content: input.content,
        target_audience: input.target_audience ?? 'all',
        is_pinned: input.is_pinned ?? false,
        author_name: input.author_name ?? 'Academy Administration',
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create announcement: ${error.message}`)
  }

  return data as AcademyAnnouncement
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await supabase
    .from('academy_announcements')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete announcement: ${error.message}`)
  }
}
