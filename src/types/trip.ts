import type { Pack } from "./pack"
import type { UserInfo } from "./user"

export type Trip = {
  id: number
  title: string
  location: string
  start_date?: string
  end_date?: string
  temp_min?: number
  temp_max?: number
  temp_category?: string
  distance?: number
  daily_elevation_gain?: number
  terrain?: string
  pace?: string
  notes?: string
  enrich_status?: 'pending' | 'processing' | 'completed' | 'failed' | null
  user_id: number
  published: boolean
  removed: boolean
  created_at: string
  updated_at: string
}

export type TripInfo = {
  trip: Trip
  packs: Pack[]
  user: UserInfo
}
