import { describe, expect, it, beforeEach } from 'vitest'
import {
  reportVehicleDefectAndSwitch,
  DEFAULT_FLEET_VEHICLES,
} from './vehicleService'
import { COMMON_VEHICLE_DEFECTS } from '../types/vehicleDefect'
import {
  setStoredData,
  STORAGE_KEYS,
  getStoredData,
} from '../../../lib/persistentStorage'
import type { PracticalSessionWithRelations } from '../../sessions/types/session'
import type { VehicleWithRelations } from '../types/vehicle'

describe('Vehicle Defect Reporting and Replacement Switch', () => {
  beforeEach(() => {
    // Reset fleet storage
    setStoredData(STORAGE_KEYS.VEHICLES, DEFAULT_FLEET_VEHICLES)
  })

  it('contains comprehensive common defect presets including dual control and brakes', () => {
    const defectIds = COMMON_VEHICLE_DEFECTS.map((d) => d.id)
    expect(defectIds).toContain('dual_control')
    expect(defectIds).toContain('brakes')
    expect(defectIds).toContain('clutch_gearbox')
    expect(defectIds).toContain('engine_cooling')
    expect(defectIds).toContain('tyres_suspension')
    expect(defectIds).toContain('electrical_lighting')
    expect(defectIds).toContain('ac_wipers')
    expect(defectIds).toContain('safety_body')
    expect(defectIds).toContain('other')

    const dualControlDefect = COMMON_VEHICLE_DEFECTS.find(
      (d) => d.id === 'dual_control',
    )
    expect(dualControlDefect?.defaultSeverity).toBe('critical')
  })

  it('marks defective vehicle as in_maintenance and suspended when critical fault is reported', async () => {
    const defectiveId = 'f1a789c2-5d41-4e89-9b12-8f7a63450001'
    const replacementId = 'f1a789c2-5d41-4e89-9b12-8f7a63450002'

    const result = await reportVehicleDefectAndSwitch({
      defectiveVehicleId: defectiveId,
      defectCategory: 'dual_control',
      severity: 'critical',
      description: 'Dual control passenger brake cable snap',
      odometerReadingKm: 42300,
      replacementVehicleId: replacementId,
      instructorName: 'Nimal Jayasuriya',
    })

    expect(result.defectiveVehicleId).toBe(defectiveId)
    expect(result.replacementVehicleId).toBe(replacementId)

    const updatedFleet = getStoredData<VehicleWithRelations[]>(
      STORAGE_KEYS.VEHICLES,
      [],
    )
    const defectiveVeh = updatedFleet.find((v) => v.id === defectiveId)
    expect(defectiveVeh?.availability_status).toBe('in_maintenance')
    expect(defectiveVeh?.operational_status).toBe('suspended')
    expect(defectiveVeh?.current_odometer_km).toBe(42300)
    expect(defectiveVeh?.internal_notes).toContain('Dual-Control Linkage Fault')
    expect(defectiveVeh?.internal_notes).toContain('Nimal Jayasuriya')
  })

  it('automatically updates practical session vehicle assignment when sessionId is passed', async () => {
    const defectiveId = 'f1a789c2-5d41-4e89-9b12-8f7a63450001'
    const replacementId = 'f1a789c2-5d41-4e89-9b12-8f7a63450002'
    const testSessionId = 'sess-test-defect-switch'

    const mockSession: PracticalSessionWithRelations = {
      id: testSessionId,
      driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      branch_id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
      student_id: 'e73a0c54-47b1-4eb7-82bf-5e723528ef01',
      instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
      vehicle_id: defectiveId,
      licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
      session_date: '2026-10-05',
      start_time: '10:00:00',
      end_time: '11:30:00',
      status: 'scheduled',
      attendance_status: 'unmarked',
      instructor_feedback: null,
      student_rating: null,
      cancellation_reason: null,
      skills_covered: ['Parallel Parking'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      student: {
        id: 'e73a0c54-47b1-4eb7-82bf-5e723528ef01',
        full_name: 'Amaya Fernando',
        admission_number: 'ADM-2026-0042',
        phone: '+94 77 123 4567',
      },
      instructor: {
        id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
        full_name: 'Nimal Jayasuriya',
        staff_number: 'INS-WP-001',
        phone: '+94 77 234 5678',
      },
      vehicle: {
        id: defectiveId,
        registration_number: 'WP CAB-4921',
        make: 'Toyota',
        model: 'Vitz Dual-Control',
        transmission_type: 'manual',
      },
      licence_category: {
        id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
        code: 'B',
        name: 'Dual Purpose / Light Motor Car (Auto & Manual)',
      },
      branch: {
        id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
        name: 'Colombo Central (Nugegoda)',
        code: 'COL-01',
      },
    }

    setStoredData(STORAGE_KEYS.SESSIONS, [mockSession])

    const result = await reportVehicleDefectAndSwitch({
      defectiveVehicleId: defectiveId,
      defectCategory: 'brakes',
      severity: 'critical',
      description: 'Brake pedal soft with metallic grinding',
      replacementVehicleId: replacementId,
      sessionId: testSessionId,
      instructorName: 'Nimal Jayasuriya',
    })

    expect(result.sessionUpdated).toBe(true)

    const sessions = getStoredData<PracticalSessionWithRelations[]>(
      STORAGE_KEYS.SESSIONS,
      [],
    )
    const updatedSession = sessions.find((s) => s.id === testSessionId)
    expect(updatedSession?.vehicle_id).toBe(replacementId)
    expect(updatedSession?.vehicle?.registration_number).toBe('WP CBC-8821')
  })
})
