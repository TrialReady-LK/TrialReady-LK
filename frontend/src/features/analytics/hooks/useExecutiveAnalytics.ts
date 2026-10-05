import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getExecutiveAnalyticsData,
  type RawAnalyticsData,
} from '../services/analyticsService'
import type { TimeRangeFilter } from '../types/analytics'
import { computeExecutiveSummary } from '../utils/analyticsEngine'
import {
  exportDmtCandidateAuditCsv,
  exportFinancialRevenueLedgerCsv,
  exportInstructorPerformanceCsv,
} from '../utils/exportUtils'

export function useExecutiveAnalytics(drivingSchoolId: string) {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all_time')
  const [rawData, setRawData] = useState<RawAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reloadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const { raw } = await getExecutiveAnalyticsData(drivingSchoolId)
      setRawData(raw)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load analytics.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [drivingSchoolId])

  useEffect(() => {
    let isMounted = true

    reloadData().catch(() => {
      if (isMounted) setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [reloadData])

  const summary = useMemo(() => {
    if (!rawData) return null
    return computeExecutiveSummary(rawData, timeRange)
  }, [rawData, timeRange])

  const handleExportDmtAudit = useCallback(() => {
    if (!rawData) return
    exportDmtCandidateAuditCsv(rawData.students, rawData)
  }, [rawData])

  const handleExportFinancialLedger = useCallback(() => {
    if (!rawData) return
    exportFinancialRevenueLedgerCsv(rawData.payments, rawData)
  }, [rawData])

  const handleExportInstructorPerformance = useCallback(() => {
    if (!summary) return
    exportInstructorPerformanceCsv(summary.instructors)
  }, [summary])

  return {
    timeRange,
    setTimeRange,
    summary,
    rawData,
    isLoading,
    errorMessage,
    reloadData,
    handleExportDmtAudit,
    handleExportFinancialLedger,
    handleExportInstructorPerformance,
  }
}
