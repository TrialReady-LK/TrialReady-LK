export type VehicleDefectCategory =
  | 'dual_control'
  | 'brakes'
  | 'clutch_gearbox'
  | 'engine_cooling'
  | 'tyres_suspension'
  | 'electrical_lighting'
  | 'ac_wipers'
  | 'safety_body'
  | 'other'

export type VehicleDefectSeverity = 'critical' | 'moderate' | 'minor'

export interface CommonDefectOption {
  id: VehicleDefectCategory
  label: string
  description: string
  defaultSeverity: VehicleDefectSeverity
}

export const COMMON_VEHICLE_DEFECTS: CommonDefectOption[] = [
  {
    id: 'dual_control',
    label: 'Dual-Control Linkage Fault',
    description: 'Passenger brake or clutch cable slack, detachment, or jammed pedal linkage',
    defaultSeverity: 'critical',
  },
  {
    id: 'brakes',
    label: 'Brakes & ABS Malfunction',
    description: 'Spongy brake pedal, abnormal squeal/grind, handbrake slipping, or ABS indicator on',
    defaultSeverity: 'critical',
  },
  {
    id: 'clutch_gearbox',
    label: 'Clutch & Gearbox Hard Shift',
    description: 'Clutch slipping under load, grinding into gears, gear lever stiff, or hydraulic leak',
    defaultSeverity: 'moderate',
  },
  {
    id: 'engine_cooling',
    label: 'Engine Overheating / Warning Lamp',
    description: 'Coolant temperature high, coolant leak, rough idle, engine stalling, or check engine light',
    defaultSeverity: 'critical',
  },
  {
    id: 'tyres_suspension',
    label: 'Tyres & Steering Pull',
    description: 'Punctured tyre, low pressure warning, heavy pulling to one side, or steering vibration',
    defaultSeverity: 'moderate',
  },
  {
    id: 'electrical_lighting',
    label: 'Lights & Turn Indicators Out',
    description: 'Headlight, tail/brake light, or turn indicator bulb failure, horn malfunction, or battery drain',
    defaultSeverity: 'moderate',
  },
  {
    id: 'ac_wipers',
    label: 'A/C & Windscreen Wipers',
    description: 'Air conditioning failure in hot weather, torn wiper rubber, or clogged windshield washer jet',
    defaultSeverity: 'minor',
  },
  {
    id: 'safety_body',
    label: 'Mirrors, Seatbelts & Doors',
    description: 'Loose wing mirror, jammed seatbelt pretensioner, door latch issue, or glass crack',
    defaultSeverity: 'moderate',
  },
  {
    id: 'other',
    label: 'Other Mechanical Concern',
    description: 'Unusual exhaust odor, abnormal underbody rattling, or unidentified operational fault',
    defaultSeverity: 'moderate',
  },
]

export interface VehicleDefectSwitchInput {
  defectiveVehicleId: string
  defectCategory: VehicleDefectCategory
  severity: VehicleDefectSeverity
  description: string
  odometerReadingKm?: number | null
  replacementVehicleId?: string | null
  sessionId?: string | null
  instructorName?: string
  instructorId?: string
}

export interface VehicleDefectSwitchResult {
  defectiveVehicleId: string
  replacementVehicleId: string | null
  maintenanceRecordId: string
  sessionUpdated: boolean
}
