import type { Pack } from "./pack"

export type Trip = {
  id: number
  title: string
  location: string
  start_date?: string
  end_date?: string
  temp_min?: number
  temp_max?: number
  distance?: number
  notes?: string
  user_id: number
  published: boolean
  removed: boolean
  created_at: string
  updated_at: string

  user: object // todo: update type
}

export type TripInfo = {
  trip: Trip
  packs: Pack[]
}
