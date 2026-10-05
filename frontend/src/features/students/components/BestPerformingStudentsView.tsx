import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy,
  Medal,
  Award,
  Star,
  Car,
  Target,
  CheckCircle2,
  ChevronRight,
  Search,
  Route as RouteIcon,
  BarChart3,
} from 'lucide-react'
import type { StudentReadinessProfile } from '../../readiness/types/readiness'
import { getReadinessTierInfo } from '../../readiness/utils/readinessEngine'
import { StudentPerformanceDetailModal } from './StudentPerformanceDetailModal'

interface BestPerformingStudentsViewProps {
  profiles: StudentReadinessProfile[]
  isLoading?: boolean
  drivingSchoolId: string
}

type SortCriterion = 'readiness' | 'rating' | 'hours' | 'skills'

export const BestPerformingStudentsView: React.FC<
  BestPerformingStudentsViewProps
> = ({ profiles, isLoading = false, drivingSchoolId }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortCriterion>('readiness')
  const [selectedProfile, setSelectedProfile] = useState<StudentReadinessProfile | null>(null)
  const [selectedRank, setSelectedRank] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sortedProfiles = React.useMemo(() => {
    const list = [...profiles]

    switch (sortBy) {
      case 'readiness':
        return list.sort((a, b) => b.evaluation.readiness_score - a.evaluation.readiness_score)
      case 'rating':
        return list.sort(
          (a, b) =>
            (b.averageInstructorRating ?? 0) -
            (a.averageInstructorRating ?? 0),
        )
      case 'hours':
        return list.sort((a, b) => b.evaluation.practical_hours_completed - a.evaluation.practical_hours_completed)
      case 'skills':
        return list.sort((a, b) => b.evaluation.skills_mastered_count - a.evaluation.skills_mastered_count)
      default:
        return list
    }
  }, [profiles, sortBy])

  const filteredProfiles = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return sortedProfiles

    return sortedProfiles.filter(
      (p) =>
        p.student.full_name.toLowerCase().includes(q) ||
        p.student.admission_number.toLowerCase().includes(q) ||
        (p.student.branch_name && p.student.branch_name.toLowerCase().includes(q)),
    )
  }, [sortedProfiles, searchTerm])

  const handleOpenDossier = (profile: StudentReadinessProfile, rank: number) => {
    setSelectedProfile(profile)
    setSelectedRank(rank)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Calculating best performing student rankings...
          </p>
        </div>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs space-y-2">
        <Trophy className="mx-auto h-8 w-8 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-800">No Student Performance Records</h3>
        <p className="text-xs text-slate-500">Performance rankings will appear after practical training evaluations are logged.</p>
      </div>
    )
  }

  const top3 = sortedProfiles.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* 1. Executive Top 3 Candidate Cards */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end">
          {/* Rank 2 (Silver / Runner Up) */}
          <div className="order-2 md:order-1 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs text-center space-y-4 relative hover:border-slate-300 hover:shadow-md transition-all">
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 shadow-2xs border border-slate-200">
                <Medal className="h-6 w-6 text-slate-600" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
                <Award className="h-3 w-3 text-slate-500" />
                <span>Rank #2 • Runner Up</span>
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {top3[1].student.full_name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {top3[1].student.admission_number} • {top3[1].student.branch_name || 'Main Campus'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Readiness</span>
                <strong className="text-lg font-black text-blue-700">{top3[1].evaluation.readiness_score}%</strong>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Instructor</span>
                <strong className="text-lg font-black text-amber-600 flex items-center justify-center gap-1">
                  <span>{(top3[1].averageInstructorRating ?? 5.0).toFixed(1)}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenDossier(top3[1], 2)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
            >
              <span>View Candidate Dossier</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Rank 1 (Gold / Top Performer - Featured) */}
          <div className="order-1 md:order-2 rounded-3xl border border-amber-300/90 bg-linear-to-b from-amber-50/40 via-white to-white p-6.5 shadow-md text-center space-y-4 relative transform md:-translate-y-2 hover:shadow-lg hover:border-amber-400 transition-all ring-1 ring-amber-200/60">
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs border border-amber-400">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 border border-amber-300">
                <Award className="h-3.5 w-3.5 text-amber-700" />
                <span>Rank #1 • Top Performer</span>
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {top3[0].student.full_name}
              </h3>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                {top3[0].student.admission_number} • {top3[0].student.branch_name || 'Main Campus'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/70">
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">AI Readiness</span>
                <strong className="text-xl font-black text-slate-950">{top3[0].evaluation.readiness_score}%</strong>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Instructor</span>
                <strong className="text-xl font-black text-amber-700 flex items-center justify-center gap-1">
                  <span>{(top3[0].averageInstructorRating ?? 5.0).toFixed(1)}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                </strong>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Maneuvers</span>
                <strong className="text-xl font-black text-emerald-700">{top3[0].evaluation.skills_mastered_count}/7</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenDossier(top3[0], 1)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              <span>View Candidate Dossier</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Rank 3 (Bronze / High Achiever) */}
          <div className="order-3 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs text-center space-y-4 relative hover:border-slate-300 hover:shadow-md transition-all">
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 shadow-2xs border border-amber-200">
                <Medal className="h-6 w-6 text-amber-700" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 border border-amber-200">
                <Award className="h-3 w-3 text-amber-600" />
                <span>Rank #3 • High Achiever</span>
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {top3[2].student.full_name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {top3[2].student.admission_number} • {top3[2].student.branch_name || 'Main Campus'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Readiness</span>
                <strong className="text-lg font-black text-blue-700">{top3[2].evaluation.readiness_score}%</strong>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Instructor</span>
                <strong className="text-lg font-black text-amber-600 flex items-center justify-center gap-1">
                  <span>{(top3[2].averageInstructorRating ?? 5.0).toFixed(1)}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenDossier(top3[2], 3)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
            >
              <span>View Candidate Dossier</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Controls & Search Filter Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span>Candidate Performance Leaderboard ({filteredProfiles.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Ranked order of evaluated students across AI readiness, star ratings, and maneuver mastery
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              placeholder="Search candidate name or admission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-slate-300 pl-8.5 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 w-56"
            />
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Rank By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortCriterion)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="readiness">Highest AI Trial Readiness</option>
              <option value="rating">Top Instructor Ratings</option>
              <option value="hours">Practical Hours Completed</option>
              <option value="skills">All Maneuvers Mastered</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Ranked Performance Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3.5 text-center">Rank</th>
              <th className="px-4 py-3.5">Student Candidate</th>
              <th className="px-4 py-3.5">AI Readiness Score</th>
              <th className="px-4 py-3.5">Practical Training</th>
              <th className="px-4 py-3.5">Instructor Rating</th>
              <th className="px-4 py-3.5">DMT Status</th>
              <th className="px-4 py-3.5 text-right">Performance Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProfiles.map((p, index) => {
              const rank = index + 1
              const tier = getReadinessTierInfo(p.evaluation.readiness_tier)

              return (
                <tr
                  key={p.student.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Rank */}
                  <td className="px-4 py-3.5 text-center">
                    {rank === 1 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-900 border border-amber-300">
                        <Award className="h-3 w-3 text-amber-700" />
                        <span>1</span>
                      </span>
                    ) : rank === 2 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-800 border border-slate-300">
                        <Medal className="h-3 w-3 text-slate-600" />
                        <span>2</span>
                      </span>
                    ) : rank === 3 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-black text-amber-900 border border-amber-200">
                        <Medal className="h-3 w-3 text-amber-700" />
                        <span>3</span>
                      </span>
                    ) : (
                      <span className="font-bold text-slate-400 font-mono">#{rank}</span>
                    )}
                  </td>

                  {/* Student Identity */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs shrink-0">
                        {p.student.full_name.charAt(0)}
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs sm:text-sm">
                          {p.student.full_name}
                        </strong>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {p.student.admission_number} • {p.student.branch_name || 'Main Campus'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* AI Score & Tier */}
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          {p.evaluation.readiness_score}%
                        </span>
                        <span className={`rounded-full px-2 py-0.2 text-[9px] font-bold border ${tier.badgeClass}`}>
                          {tier.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-28 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            p.evaluation.readiness_score >= 85
                              ? 'bg-emerald-600'
                              : p.evaluation.readiness_score >= 70
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                          }`}
                          style={{ width: `${p.evaluation.readiness_score}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Practical Hours & Maneuvers */}
                  <td className="px-4 py-3.5">
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Car className="h-3 w-3 text-blue-600" />
                        <span>{p.evaluation.practical_hours_completed} Practical Hours</span>
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Target className="h-3 w-3 text-purple-600" />
                        <span>{p.evaluation.skills_mastered_count} of 7 Maneuvers</span>
                      </span>
                    </div>
                  </td>

                  {/* Instructor Rating */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">
                        {(p.averageInstructorRating ?? 5.0).toFixed(1)}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s <= Math.round(p.averageInstructorRating ?? 5)
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* DMT Status */}
                  <td className="px-4 py-3.5">
                    <div className="space-y-0.5 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Permit &amp; Medical Valid</span>
                      </span>
                      <span className="block text-slate-500">
                        {p.evaluation.readiness_score >= 85 ? 'Eligible for Werahera' : 'Needs Road Practice'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenDossier(p, rank)}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                      >
                        <span>Inspect Dossier</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>

                      <Link
                        to={`/students/${p.student.id}/journey`}
                        title="View Learner Journey"
                        className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 transition-all"
                      >
                        <RouteIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Performance Dossier Modal */}
      {selectedProfile && (
        <StudentPerformanceDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProfile(null)
          }}
          profile={selectedProfile}
          rank={selectedRank}
          drivingSchoolId={drivingSchoolId}
        />
      )}
    </div>
  )
}

export default BestPerformingStudentsView

