/**
 * Safe local storage persistence helper for TrialReady-LK.
 * Ensures data created or modified across Admin, Instructor, and Student portals
 * persists across page refreshes, browser reloads, and network drops.
 */

export const STORAGE_KEYS = {
  AUTH_SESSION: 'trialready_auth_session',
  BRANCHES: 'trialready_branches',
  LICENCE_CATEGORIES: 'trialready_licence_categories',
  VEHICLES: 'trialready_vehicles',
  INSTRUCTORS: 'trialready_instructors',
  STUDENTS: 'trialready_students',
  PERMITS: 'trialready_permits',
  MEDICALS: 'trialready_medicals',
  EXAMS: 'trialready_exams',
  PACKAGES: 'trialready_packages',
  ENROLMENTS: 'trialready_enrolments',
  PAYMENTS: 'trialready_payments',
  ANNOUNCEMENTS: 'trialready_announcements',
  SESSIONS: 'trialready_sessions',
  STUDENT_LICENCE_ENROLMENTS: 'trialready_student_licence_enrolments',
  INSTRUCTOR_LICENCE_CATEGORIES: 'trialready_instructor_licence_categories',
  NOTIFICATIONS: 'trialready_notifications',
} as const

export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (err) {
    console.warn(`Error reading from localStorage (${key}):`, err)
    return fallback
  }
}

export function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.warn(`Error writing to localStorage (${key}):`, err)
  }
}

export function removeStoredData(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.warn(`Error removing from localStorage (${key}):`, err)
  }
}

export function upsertStoredItem<T extends { id: string }>(
  key: string,
  item: T,
  prepend = true,
): T[] {
  const list = getStoredData<T[]>(key, [])
  const index = list.findIndex((i) => i.id === item.id)
  let updatedList: T[]
  if (index !== -1) {
    updatedList = [...list]
    updatedList[index] = { ...updatedList[index], ...item }
  } else {
    updatedList = prepend ? [item, ...list] : [...list, item]
  }
  setStoredData(key, updatedList)
  return updatedList
}

export function deleteStoredItem<T extends { id: string }>(
  key: string,
  id: string,
): T[] {
  const list = getStoredData<T[]>(key, [])
  const filtered = list.filter((i) => i.id !== id)
  setStoredData(key, filtered)
  return filtered
}

export function mergeAndStoreList<T extends { id: string }>(
  key: string,
  remoteItems: T[],
  identifierKey?: keyof T,
): T[] {
  const localItems = getStoredData<T[]>(key, [])
  const merged: T[] = [...localItems]

  for (const remote of remoteItems) {
    const existingIndex = merged.findIndex((m) => {
      if (m.id === remote.id) return true
      if (identifierKey && m[identifierKey] && remote[identifierKey]) {
        return m[identifierKey] === remote[identifierKey]
      }
      return false
    })

    if (existingIndex !== -1) {
      merged[existingIndex] = { ...remote, ...merged[existingIndex] }
    } else {
      merged.push(remote)
    }
  }

  setStoredData(key, merged)
  return merged
}
