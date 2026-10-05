import React, { useState } from 'react'
import {
  X,
  Star,
  ShieldCheck,
  Award,
  ClipboardCheck,
  Car,
} from 'lucide-react'
import type { StudentPerformanceAssessmentInput } from '../types/readiness'
import { CORE_DMT_PRACTICAL_SKILLS } from '../utils/readinessEngine'

interface StudentPerformanceAssessmentModalProps {
  isOpen: boolean
  studentId: string
  studentName: string
  admissionNumber: string
  currentReadinessScore?: number
  drivingSchoolId: string
  initialSkills?: string[]
  initialRating?: number | null
  initialFeedback?: string
  isAdmin?: boolean
  isInstructor?: boolean
  onClose: () => void
  onSaveAssessment: (input: StudentPerformanceAssessmentInput) => Promise<unknown>
}

const FEEDBACK_PRESETS = [
  'Demonstrates exceptional clutch control and zero rollback on gradients. Fully prepared for Werahera DMT practical trial.',
  'Good overall driving awareness and lane discipline. Recommend 2 additional practice sessions on reverse S-bend cones.',
  'Satisfactory parallel parking and 3-point turns. Continue practicing mirror check discipline at roundabouts.',
  'Consistent vehicle control and smooth gear shifts. All mandatory curriculum hours and maneuvers completed.',
  'Requires remedial training on clutch bite point and emergency braking before final trial endorsement.',
]

export const StudentPerformanceAssessmentModal: React.FC<
  StudentPerformanceAssessmentModalProps
> = ({
  isOpen,
  studentId,
  studentName,
  admissionNumber,
  currentReadinessScore = 75,
  drivingSchoolId,
  initialSkills = [],
  initialRating = 4,
  initialFeedback = '',
  isAdmin = true,
  isInstructor = false,
  onClose,
  onSaveAssessment,
}) => {
  const isInstructorMode = isInstructor || !isAdmin
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialSkills.length > 0 ? initialSkills : [...CORE_DMT_PRACTICAL_SKILLS.slice(0, 4)],
  )
  const [rating, setRating] = useState<number>(initialRating || 4)
  const [feedback, setFeedback] = useState<string>(initialFeedback)
  const [evaluatorName, setEvaluatorName] = useState<string>(
    isInstructorMode
      ? 'Nimal Jayasuriya (Senior Instructor)'
      : 'Nimal Jayawardena (Chief Examiner)',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  const handleSelectAllSkills = () => {
    if (selectedSkills.length === CORE_DMT_PRACTICAL_SKILLS.length) {
      setSelectedSkills([])
    } else {
      setSelectedSkills([...CORE_DMT_PRACTICAL_SKILLS])
    }
  }

  const handleApplyPreset = (presetText: string) => {
    setFeedback(presetText)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!feedback.trim()) {
      setError('Please provide instructor feedback or select a preset observation note.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSaveAssessment({
        driving_school_id: drivingSchoolId,
        student_id: studentId,
        evaluator_name: evaluatorName.trim(),
        evaluator_role: isAdmin ? 'admin' : 'instructor',
        student_rating: rating,
        skills_covered: selectedSkills,
        instructor_feedback: feedback.trim(),
        session_date: new Date().toISOString().split('T')[0],
      })
      onClose()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save student performance assessment.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Student Performance &amp; Maneuver Grading
                </h2>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-800 border border-blue-200">
                  {isAdmin ? 'Administrator Evaluation' : 'Instructor Evaluation'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {studentName} • Admission:{' '}
                <strong className="font-mono text-slate-700">{admissionNumber}</strong> • Current AI Score: {currentReadinessScore}%
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* 1. Evaluator Role & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Evaluating Official
              </label>
              <input
                type="text"
                value={evaluatorName}
                onChange={(e) => setEvaluatorName(e.target.value)}
                placeholder="Evaluator Full Name"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Evaluation Date
              </label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* 2. Core DMT Maneuver Competencies Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  DMT Practical Maneuvers &amp; Skills Assessment
                </label>
                <p className="text-[11px] text-slate-500">
                  Select all Sri Lankan statutory trial maneuvers the student has mastered:
                </p>
              </div>
              <button
                type="button"
                onClick={handleSelectAllSkills}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                {selectedSkills.length === CORE_DMT_PRACTICAL_SKILLS.length
                  ? 'Deselect All'
                  : 'Select All (7/7 Mastered)'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70">
              {CORE_DMT_PRACTICAL_SKILLS.map((skill) => {
                const isMastered = selectedSkills.includes(skill)
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => handleToggleSkill(skill)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border text-left ${
                      isMastered
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Car className={`h-3.5 w-3.5 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{skill}</span>
                    </div>
                    <span
                      className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isMastered
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="flex justify-between items-center mt-1.5 px-1 text-[11px] text-slate-500">
              <span>Maneuvers Mastered: <strong className="text-slate-900">{selectedSkills.length} of {CORE_DMT_PRACTICAL_SKILLS.length}</strong></span>
              <span className="font-bold text-blue-700">
                Skills Factor Score: {Math.round((selectedSkills.length / CORE_DMT_PRACTICAL_SKILLS.length) * 20)} / 20 pts
              </span>
            </div>
          </div>

          {/* 3. Overall Performance Rating (1-5 Stars) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Overall Practical Performance Rating
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = rating >= star
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`flex items-center justify-center h-9 w-9 rounded-xl text-base font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-white shadow-xs scale-105'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                )
              })}
              <div className="ml-2">
                <span className="text-xs font-bold text-slate-900">
                  {rating === 5 && '★★★★★ Excellent (Trial Ready - 100%)'}
                  {rating === 4 && '★★★★☆ Good Progress (80%)'}
                  {rating === 3 && '★★★☆☆ Satisfactory Performance (60%)'}
                  {rating === 2 && '★★☆☆☆ Needs Practice (40%)'}
                  {rating === 1 && '★☆☆☆☆ Remedial Required (20%)'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Contributes {rating === 5 ? '10/10' : rating === 4 ? '8/10' : rating === 3 ? '6/10' : rating === 2 ? '4/10' : '2/10'} pts to AI Readiness Engine
                </span>
              </div>
            </div>
          </div>

          {/* 4. Instructor Feedback & Observations */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Instructor Assessment &amp; Observations
              </label>
              <span className="text-[10px] text-slate-400">
                Official training record
              </span>
            </div>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Completed gradient hill starts with zero rollback. Clutch balance and steering response are excellent."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />

            {/* Quick Feedback Presets */}
            <div className="mt-2 space-y-1">
              <span className="text-[11px] font-bold text-slate-600 block">
                Quick Observation Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FEEDBACK_PRESETS.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleApplyPreset(p)}
                    className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-all cursor-pointer text-left"
                  >
                    + {p.slice(0, 45)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Updates AI Readiness Score immediately</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Award className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving Evaluation...' : 'Save Evaluation & Score'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentPerformanceAssessmentModal
