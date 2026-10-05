import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
  upsertStoredItem,
} from '../../../lib/persistentStorage'
import type {
  Branch,
  CreateBranchInput,
  UpdateBranchInput,
} from '../types/branch'

const BRANCHES_TABLE = 'branches'

export const DEFAULT_BRANCHES: Branch[] = [
  {
    id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Colombo Central (Nugegoda)',
    phone: '+94 11 281 9001',
    email: 'nugegoda@royaldriving.lk',
    address: 'No. 142 High Level Road, Nugegoda',
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b2a789c2-5d41-4e89-9b12-8f7a63450002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Gampaha Branch (Yakkala)',
    phone: '+94 33 222 4110',
    email: 'gampaha@royaldriving.lk',
    address: 'No. 88 Kandy Road, Yakkala, Gampaha',
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b3a789c2-5d41-4e89-9b12-8f7a63450003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Kandy City Branch (Peradeniya)',
    phone: '+94 81 238 7200',
    email: 'kandy@royaldriving.lk',
    address: 'No. 204 Peradeniya Road, Kandy',
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

export async function getBranches(): Promise<Branch[]> {
  const localList = getStoredData<Branch[]>(
    STORAGE_KEYS.BRANCHES,
    DEFAULT_BRANCHES,
  )

  try {
    const { data, error } = await supabase
      .from(BRANCHES_TABLE)
      .select('*')
      .order('name', { ascending: true })

    if (error || !data || data.length === 0) {
      if (localList.length === 0) {
        setStoredData(STORAGE_KEYS.BRANCHES, DEFAULT_BRANCHES)
        return DEFAULT_BRANCHES
      }
      return localList.sort((a, b) => a.name.localeCompare(b.name))
    }

    const remoteBranches = data as Branch[]
    const merged = [...localList]
    for (const r of remoteBranches) {
      const idx = merged.findIndex((m) => m.id === r.id || m.name === r.name)
      if (idx !== -1) {
        merged[idx] = { ...r, ...merged[idx] }
      } else {
        merged.push(r)
      }
    }

    setStoredData(STORAGE_KEYS.BRANCHES, merged)
    return merged.sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    return localList.length > 0 ? localList : DEFAULT_BRANCHES
  }
}

export async function getBranchById(
  branchId: string,
): Promise<Branch> {
  const localList = getStoredData<Branch[]>(
    STORAGE_KEYS.BRANCHES,
    DEFAULT_BRANCHES,
  )
  const cached = localList.find((b) => b.id === branchId)

  try {
    const { data, error } = await supabase
      .from(BRANCHES_TABLE)
      .select('*')
      .eq('id', branchId)
      .single()

    if (error) {
      if (cached) return cached
      throw new Error(`Unable to load branch: ${error.message}`)
    }

    const remote = data as Branch
    upsertStoredItem(STORAGE_KEYS.BRANCHES, remote)
    return remote
  } catch (err) {
    if (cached) return cached
    throw err
  }
}

export async function createBranch(
  input: CreateBranchInput,
): Promise<Branch> {
  const fallbackSchoolId =
    input.driving_school_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  const payload = {
    ...input,
    driving_school_id: fallbackSchoolId,
  }

  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `branch-${Date.now()}`
  const newBranch: Branch = {
    id: generatedId,
    driving_school_id: payload.driving_school_id,
    name: payload.name,
    phone: payload.phone || null,
    email: payload.email || null,
    address: payload.address || null,
    is_active: payload.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.BRANCHES, newBranch)

  try {
    const { data: created } = await supabase
      .from(BRANCHES_TABLE)
      .insert({
        ...payload,
        id: generatedId,
      })
      .select('*')
      .single()

    if (created) {
      upsertStoredItem(STORAGE_KEYS.BRANCHES, created as Branch)
      return created as Branch
    }
  } catch (err) {
    console.warn('Supabase branch insert fallback to persistent store:', err)
  }

  return newBranch
}

export async function updateBranch(
  branchId: string,
  input: UpdateBranchInput,
): Promise<Branch> {
  const localList = getStoredData<Branch[]>(
    STORAGE_KEYS.BRANCHES,
    DEFAULT_BRANCHES,
  )
  const existing = localList.find((b) => b.id === branchId) || DEFAULT_BRANCHES[0]

  const updated: Branch = {
    ...existing,
    ...input,
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.BRANCHES, updated)

  try {
    await supabase.from(BRANCHES_TABLE).update(input).eq('id', branchId)
  } catch (err) {
    console.warn('Supabase branch update fallback:', err)
  }

  return updated
}

export async function setBranchActiveStatus(
  branchId: string,
  isActive: boolean,
): Promise<Branch> {
  return updateBranch(branchId, {
    is_active: isActive,
  })
}