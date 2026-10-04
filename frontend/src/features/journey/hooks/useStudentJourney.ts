import { useCallback, useEffect, useState } from 'react'
import {
  getStudentJourneyOverview,
  markStudentStageDone,
  saveStudentCompletedLessons,
  saveStudentExamTrial,
  saveStudentMedical,
  saveStudentPermit,
} from '../services/journeyService'
import type {
  SaveExamTrialInput,
  SaveMedicalInput,
  SavePermitInput,
  StudentJourneyOverview,
} from '../types/journey'

export function useStudentJourney(studentId: string) {
  const [journey, setJourney] = useState<StudentJourneyOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const reloadJourney = useCallback(async () => {
    if (!studentId) return
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const data = await getStudentJourneyOverview(studentId)
      setJourney(data)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load journey records.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    let isMounted = true
    if (!studentId) return

    getStudentJourneyOverview(studentId)
      .then((data) => {
        if (isMounted) {
          setJourney(data)
          setErrorMessage(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Failed to load journey records.',
          )
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [studentId])

  const handleSavePermit = useCallback(
    async (input: SavePermitInput) => {
      try {
        setErrorMessage(null)
        await saveStudentPermit(input)
        await reloadJourney()
        setSuccessMessage("Learner's permit record updated successfully.")
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to save permit.'
        setErrorMessage(msg)
        throw err
      }
    },
    [reloadJourney],
  )

  const handleSaveMedical = useCallback(
    async (input: SaveMedicalInput) => {
      try {
        setErrorMessage(null)
        await saveStudentMedical(input)
        await reloadJourney()
        setSuccessMessage('NTMI medical record updated successfully.')
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to save medical record.'
        setErrorMessage(msg)
        throw err
      }
    },
    [reloadJourney],
  )

  const handleSaveExamTrial = useCallback(
    async (input: SaveExamTrialInput) => {
      try {
        setErrorMessage(null)
        await saveStudentExamTrial(input)
        await reloadJourney()
        setSuccessMessage('Exam / Trial record saved successfully.')
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to save exam / trial.'
        setErrorMessage(msg)
        throw err
      }
    },
    [reloadJourney],
  )

  const handleMarkStageDone = useCallback(
    async (
      stageKey: 'medical' | 'permit' | 'theory' | 'lessons' | 'trial' | 'licence',
      drivingSchoolId?: string,
    ) => {
      if (!studentId) return
      try {
        setErrorMessage(null)
        await markStudentStageDone(stageKey, studentId, drivingSchoolId)
        await reloadJourney()
        const stageTitles: Record<string, string> = {
          medical: 'NTMI Medical Clearance',
          permit: "DMT Learner's Permit",
          theory: 'DMT Theory Exam',
          lessons: 'Practical Driving Lessons (10/10)',
          trial: 'DMT Practical Trial',
          licence: 'Driving Licence Issuance',
        }
        setSuccessMessage(`Stage "${stageTitles[stageKey] || stageKey}" marked as completed!`)
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to update milestone.'
        setErrorMessage(msg)
        throw err
      }
    },
    [studentId, reloadJourney],
  )

  const handleSaveCompletedLessons = useCallback(
    async (count: number, drivingSchoolId?: string) => {
      if (!studentId) return
      try {
        setErrorMessage(null)
        await saveStudentCompletedLessons(studentId, count, drivingSchoolId)
        await reloadJourney()
        setSuccessMessage(`Logged ${count} practical driving lessons successfully.`)
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to update lessons count.'
        setErrorMessage(msg)
        throw err
      }
    },
    [studentId, reloadJourney],
  )

  return {
    journey,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    reloadJourney,
    handleSavePermit,
    handleSaveMedical,
    handleSaveExamTrial,
    handleMarkStageDone,
    handleSaveCompletedLessons,
  }
}
