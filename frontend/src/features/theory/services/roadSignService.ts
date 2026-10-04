import { getStoredData, setStoredData } from '../../../lib/persistentStorage'
import { supabase } from '../../../lib/supabase'
import { DEFAULT_SRI_LANKA_ROAD_SIGNS } from '../data/sriLankaRoadSignsData'
import type { RoadSignItem } from '../types/roadSign'

const ROAD_SIGNS_STORAGE_KEY = 'trialready_road_signs'

function notifySignsUpdated(detail?: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('trialready-signs-updated', { detail }),
    )
  }
}

export async function getRoadSigns(category?: string): Promise<RoadSignItem[]> {
  try {
    const local = getStoredData<RoadSignItem[] | null>(ROAD_SIGNS_STORAGE_KEY, null)
    if (local && local.length > 0) {
      return category && category !== 'all'
        ? local.filter((s) => s.category === category)
        : local
    }

    // Try Supabase
    const { data, error } = await supabase.from('road_signs').select('*')
    if (error || !data || data.length === 0) {
      setStoredData(ROAD_SIGNS_STORAGE_KEY, DEFAULT_SRI_LANKA_ROAD_SIGNS)
      return category && category !== 'all'
        ? DEFAULT_SRI_LANKA_ROAD_SIGNS.filter((s) => s.category === category)
        : DEFAULT_SRI_LANKA_ROAD_SIGNS
    }

    const signs = data as RoadSignItem[]
    setStoredData(ROAD_SIGNS_STORAGE_KEY, signs)
    return category && category !== 'all'
      ? signs.filter((s) => s.category === category)
      : signs
  } catch {
    return category && category !== 'all'
      ? DEFAULT_SRI_LANKA_ROAD_SIGNS.filter((s) => s.category === category)
      : DEFAULT_SRI_LANKA_ROAD_SIGNS
  }
}

export async function saveRoadSign(sign: RoadSignItem): Promise<RoadSignItem> {
  const current = getStoredData<RoadSignItem[]>(
    ROAD_SIGNS_STORAGE_KEY,
    DEFAULT_SRI_LANKA_ROAD_SIGNS,
  )
  const index = current.findIndex((s) => s.id === sign.id)

  let updated: RoadSignItem[]
  if (index >= 0) {
    updated = [...current]
    updated[index] = sign
  } else {
    updated = [sign, ...current]
  }

  setStoredData(ROAD_SIGNS_STORAGE_KEY, updated)
  notifySignsUpdated(sign)

  try {
    await supabase.from('road_signs').upsert([
      {
        id: sign.id,
        name: sign.name,
        name_si: sign.name_si,
        name_ta: sign.name_ta,
        category: sign.category,
        meaning: sign.meaning,
        meaning_si: sign.meaning_si,
        meaning_ta: sign.meaning_ta,
        image_url: sign.image_url,
        fine_or_points: sign.fine_or_points,
      },
    ])
  } catch (err) {
    console.warn('Could not save road sign to Supabase:', err)
  }

  return sign
}

export async function deleteRoadSign(signId: string): Promise<void> {
  const current = getStoredData<RoadSignItem[]>(
    ROAD_SIGNS_STORAGE_KEY,
    DEFAULT_SRI_LANKA_ROAD_SIGNS,
  )
  const filtered = current.filter((s) => s.id !== signId)
  setStoredData(ROAD_SIGNS_STORAGE_KEY, filtered)
  notifySignsUpdated({ id: signId, deleted: true })

  try {
    await supabase.from('road_signs').delete().eq('id', signId)
  } catch (err) {
    console.warn('Could not delete road sign from Supabase:', err)
  }
}

export async function resetRoadSignsToDefault(): Promise<RoadSignItem[]> {
  setStoredData(ROAD_SIGNS_STORAGE_KEY, DEFAULT_SRI_LANKA_ROAD_SIGNS)
  notifySignsUpdated(DEFAULT_SRI_LANKA_ROAD_SIGNS)
  return DEFAULT_SRI_LANKA_ROAD_SIGNS
}
