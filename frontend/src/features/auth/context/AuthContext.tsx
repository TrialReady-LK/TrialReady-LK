import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import {
  getCurrentSession,
  getUserProfile,
  signInWithEmail,
  signOutUser,
  subscribeToAuthChanges,
} from '../services/authService'
import type { AppRole, UserProfile } from '../types/auth'
import {
  DEFAULT_DEMO_SCHOOL_ID,
  SYSTEM_TEST_ACCOUNTS,
} from '../constants/testAccounts'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  role: AppRole | null
  drivingSchoolId: string
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<AppRole>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  clearError: () => void
  setDemoUser: (role: AppRole, drivingSchoolId?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demoRole, setDemoRole] = useState<AppRole | null>(null)
  const [demoSchoolId, setDemoSchoolId] = useState<string>(
    DEFAULT_DEMO_SCHOOL_ID,
  )

  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const p = await getUserProfile(userId)
      setProfile(p)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    getCurrentSession()
      .then((activeSession) => {
        if (isCancelled) return
        setSession(activeSession)
        setUser(activeSession?.user ?? null)
        if (activeSession?.user) {
          return getUserProfile(activeSession.user.id)
        }
        return null
      })
      .then((userProfile) => {
        if (isCancelled) return
        if (userProfile) {
          setProfile(userProfile)
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          console.warn('Session check initialization warning:', err)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    const { data: authListener } = subscribeToAuthChanges(
      (_event, updatedSession) => {
        if (isCancelled) return
        setSession(updatedSession)
        setUser(updatedSession?.user ?? null)
        if (updatedSession?.user) {
          void loadUserProfile(updatedSession.user.id)
        } else {
          setProfile(null)
        }
      },
    )

    return () => {
      isCancelled = true
      authListener.subscription.unsubscribe()
    }
  }, [loadUserProfile])

  const login = useCallback(
    async (email: string, password: string): Promise<AppRole> => {
      const normalizedEmail = email.trim().toLowerCase()
      setIsLoading(true)
      setError(null)

      // 1. Resolve dedicated system test accounts & known database personas
      let matchedRole: AppRole | null = null
      if (
        normalizedEmail === 'admin@drivingschool.lk' ||
        normalizedEmail === 'admin@royaldriving.lk' ||
        normalizedEmail === 'info@royaldriving.lk'
      ) {
        matchedRole = 'administrator'
      } else if (
        normalizedEmail === 'instructor@drivingschool.lk' ||
        normalizedEmail === 'nimal@royaldriving.lk'
      ) {
        matchedRole = 'instructor'
      } else if (
        normalizedEmail === 'student@drivingschool.lk' ||
        normalizedEmail === 'amaya.fernando@gmail.com'
      ) {
        matchedRole = 'student'
      }

      if (matchedRole) {
        const testAccount = SYSTEM_TEST_ACCOUNTS[matchedRole]
        setDemoRole(matchedRole)
        setDemoSchoolId(DEFAULT_DEMO_SCHOOL_ID)
        const mockProfile: UserProfile = {
          id: testAccount.profileId,
          driving_school_id: DEFAULT_DEMO_SCHOOL_ID,
          branch_id: testAccount.branchId,
          role: matchedRole,
          full_name: testAccount.name,
          phone: testAccount.phone,
          status: 'active',
          created_at: '2026-05-10T00:00:00.000Z',
          updated_at: new Date().toISOString(),
          driving_school: {
            id: DEFAULT_DEMO_SCHOOL_ID,
            name: 'Royal Driving Academy (Pvt) Ltd',
            registration_number: 'DS-WP-2026-0042',
          },
        }
        setProfile(mockProfile)
        setUser({
          id: testAccount.profileId,
          app_metadata: {},
          user_metadata: { full_name: testAccount.name },
          aud: 'authenticated',
          created_at: '2026-05-10T00:00:00.000Z',
          email: testAccount.email,
        } as unknown as User)
        setSession({
          access_token: 'demo-test-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'demo-test-refresh',
          user: {
            id: testAccount.profileId,
            email: testAccount.email,
          } as unknown as User,
        } as unknown as Session)
        setIsLoading(false)
        return matchedRole
      }

      // 2. Fall back to Supabase Auth for standard external credentials
      try {
        const { session: newSession, profile: newProfile } =
          await signInWithEmail(email, password)
        setSession(newSession)
        setUser(newSession.user)
        setProfile(newProfile)
        setDemoRole(null)
        const userRole = newProfile?.role ?? 'administrator'
        return userRole
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Authentication failed.'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await signOutUser()
    } finally {
      setUser(null)
      setSession(null)
      setProfile(null)
      setDemoRole(null)
      setError(null)
      setIsLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }, [user, loadUserProfile])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const setDemoUser = useCallback(
    (role: AppRole, schoolId?: string) => {
      const activeSchoolId = schoolId || DEFAULT_DEMO_SCHOOL_ID
      const testAccount = SYSTEM_TEST_ACCOUNTS[role]
      setDemoRole(role)
      setDemoSchoolId(activeSchoolId)
      setProfile({
        id: testAccount.profileId,
        driving_school_id: activeSchoolId,
        branch_id: testAccount.branchId,
        role,
        full_name: testAccount.name,
        phone: testAccount.phone,
        status: 'active',
        created_at: '2026-05-10T00:00:00.000Z',
        updated_at: new Date().toISOString(),
        driving_school: {
          id: activeSchoolId,
          name: 'Royal Driving Academy (Pvt) Ltd',
          registration_number: 'DS-WP-2026-0042',
        },
      })
      setUser({
        id: testAccount.profileId,
        app_metadata: {},
        user_metadata: { full_name: testAccount.name },
        aud: 'authenticated',
        created_at: '2026-05-10T00:00:00.000Z',
        email: testAccount.email,
      } as unknown as User)
      setSession({
        access_token: 'demo-test-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'demo-test-refresh',
        user: {
          id: testAccount.profileId,
          email: testAccount.email,
        } as unknown as User,
      } as unknown as Session)
    },
    [],
  )

  const effectiveRole = useMemo(() => {
    if (demoRole) return demoRole
    return profile?.role ?? null
  }, [demoRole, profile?.role])

  const effectiveDrivingSchoolId = useMemo(() => {
    if (profile?.driving_school_id) return profile.driving_school_id
    return demoSchoolId
  }, [profile, demoSchoolId])

  const isAuthenticated = useMemo(() => {
    return Boolean(session || demoRole)
  }, [session, demoRole])

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role: effectiveRole,
      drivingSchoolId: effectiveDrivingSchoolId,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      refreshProfile,
      clearError,
      setDemoUser,
    }),
    [
      user,
      session,
      profile,
      effectiveRole,
      effectiveDrivingSchoolId,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      refreshProfile,
      clearError,
      setDemoUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
