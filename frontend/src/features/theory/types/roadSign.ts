export type RoadSignCategory =
  | 'regulatory'
  | 'warning'
  | 'priority'
  | 'informative'

export interface RoadSignItem {
  id: string
  name: string
  name_si?: string
  name_ta?: string
  category: RoadSignCategory
  meaning: string
  meaning_si?: string
  meaning_ta?: string
  image_url: string
  fine_or_points?: string
  is_custom_upload?: boolean
}
