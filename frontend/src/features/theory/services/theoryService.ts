import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
} from '../../../lib/persistentStorage'
import { SRI_LANKA_DMT_QUESTION_BANK } from '../data/sriLankaQuestionBank'
import type {
  MockExamAttempt,
  SaveMockAttemptInput,
  TheoryQuestion,
} from '../types/theory'

const THEORY_QUESTIONS_KEY = 'trialready_theory_questions'
const ACADEMY_MOCK_ATTEMPTS_KEY = 'trialready_mock_attempts'

export interface ExtendedMockAttempt extends MockExamAttempt {
  student_name?: string
  admission_number?: string
  branch_name?: string
}

export async function getTheoryQuestions(
  category?: string,
): Promise<TheoryQuestion[]> {
  try {
    // 1. Check local persistent store first
    const localQuestions = getStoredData<TheoryQuestion[] | null>(
      THEORY_QUESTIONS_KEY,
      null,
    )
    if (localQuestions && localQuestions.length > 0) {
      return category && category !== 'all'
        ? localQuestions.filter((q) => q.category === category)
        : localQuestions
    }

    // 2. Query Supabase
    let query = supabase.from('theory_questions').select('*').eq('is_active', true)
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error || !data || data.length === 0) {
      setStoredData(THEORY_QUESTIONS_KEY, SRI_LANKA_DMT_QUESTION_BANK)
      return category && category !== 'all'
        ? SRI_LANKA_DMT_QUESTION_BANK.filter((q) => q.category === category)
        : SRI_LANKA_DMT_QUESTION_BANK
    }

    const questions = data as TheoryQuestion[]
    setStoredData(THEORY_QUESTIONS_KEY, questions)
    return questions
  } catch {
    return category && category !== 'all'
      ? SRI_LANKA_DMT_QUESTION_BANK.filter((q) => q.category === category)
      : SRI_LANKA_DMT_QUESTION_BANK
  }
}

export async function saveTheoryQuestion(
  question: TheoryQuestion,
): Promise<TheoryQuestion> {
  const current = getStoredData<TheoryQuestion[]>(
    THEORY_QUESTIONS_KEY,
    SRI_LANKA_DMT_QUESTION_BANK,
  )
  const index = current.findIndex((q) => q.id === question.id)

  let updated: TheoryQuestion[]
  if (index >= 0) {
    updated = [...current]
    updated[index] = question
  } else {
    updated = [question, ...current]
  }

  setStoredData(THEORY_QUESTIONS_KEY, updated)

  try {
    await supabase.from('theory_questions').upsert([
      {
        id: question.id,
        category: question.category,
        question_text: question.question_text,
        image_url: question.image_url,
        options: question.options,
        correct_option_index: question.correct_option_index,
        explanation: question.explanation,
        translations: question.translations,
        is_active: true,
      },
    ])
  } catch (err) {
    console.warn('Could not sync question to Supabase:', err)
  }

  return question
}

export async function deleteTheoryQuestion(questionId: string): Promise<void> {
  const current = getStoredData<TheoryQuestion[]>(
    THEORY_QUESTIONS_KEY,
    SRI_LANKA_DMT_QUESTION_BANK,
  )
  const filtered = current.filter((q) => q.id !== questionId)
  setStoredData(THEORY_QUESTIONS_KEY, filtered)

  try {
    await supabase.from('theory_questions').delete().eq('id', questionId)
  } catch (err) {
    console.warn('Could not delete question from Supabase:', err)
  }
}

export async function resetQuestionBankToDefault(): Promise<TheoryQuestion[]> {
  setStoredData(THEORY_QUESTIONS_KEY, SRI_LANKA_DMT_QUESTION_BANK)
  return SRI_LANKA_DMT_QUESTION_BANK
}

export async function recordMockExamAttempt(
  input: SaveMockAttemptInput,
): Promise<MockExamAttempt> {
  const attemptRecord: MockExamAttempt = {
    id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    driving_school_id: input.driving_school_id,
    student_id: input.student_id,
    total_questions: input.total_questions,
    correct_answers_count: input.correct_answers_count,
    score_percentage: input.score_percentage,
    passed: input.passed,
    time_spent_seconds: input.time_spent_seconds,
    answers: input.answers,
    attempted_at: new Date().toISOString(),
  }

  // Save to local storage attempts list
  const allAttempts = getStoredData<MockExamAttempt[]>(
    ACADEMY_MOCK_ATTEMPTS_KEY,
    [],
  )
  setStoredData(ACADEMY_MOCK_ATTEMPTS_KEY, [attemptRecord, ...allAttempts])

  try {
    const { data, error } = await supabase
      .from('student_mock_exam_attempts')
      .insert([
        {
          driving_school_id: input.driving_school_id,
          student_id: input.student_id,
          total_questions: input.total_questions,
          correct_answers_count: input.correct_answers_count,
          score_percentage: input.score_percentage,
          passed: input.passed,
          time_spent_seconds: input.time_spent_seconds,
          answers: input.answers,
          attempted_at: attemptRecord.attempted_at,
        },
      ])
      .select()
      .single()

    if (!error && data) {
      attemptRecord.id = data.id
    }
  } catch (err) {
    console.warn('Could not record mock attempt in Supabase:', err)
  }

  // If passed with >= 75% score, record into student_exam_trials as theory milestone
  if (input.passed) {
    try {
      await supabase.from('student_exam_trials').insert([
        {
          driving_school_id: input.driving_school_id,
          student_id: input.student_id,
          exam_type: 'theory',
          attempt_number: 1,
          scheduled_date: new Date().toISOString().split('T')[0],
          status: 'passed',
          score: Math.round(input.score_percentage),
          location: 'TrialReady DMT Practice Simulator',
          examiner_notes: `Cleared computerized practice mock test (${input.correct_answers_count}/${input.total_questions} correct).`,
        },
      ])
    } catch (e) {
      console.warn('Could not auto-sync exam trial milestone:', e)
    }
  }

  return attemptRecord
}

export async function getStudentMockAttempts(
  studentId: string,
): Promise<MockExamAttempt[]> {
  try {
    const allAttempts = getStoredData<MockExamAttempt[]>(
      ACADEMY_MOCK_ATTEMPTS_KEY,
      [],
    )
    const filtered = allAttempts.filter((a) => a.student_id === studentId)

    if (filtered.length > 0) return filtered

    const { data, error } = await supabase
      .from('student_mock_exam_attempts')
      .select('*')
      .eq('student_id', studentId)
      .order('attempted_at', { ascending: false })

    if (error) throw error
    return (data as MockExamAttempt[]) ?? []
  } catch {
    const allAttempts = getStoredData<MockExamAttempt[]>(
      ACADEMY_MOCK_ATTEMPTS_KEY,
      [],
    )
    return allAttempts.filter((a) => a.student_id === studentId)
  }
}

export async function getAllAcademyMockAttempts(
  drivingSchoolId?: string,
): Promise<ExtendedMockAttempt[]> {
  try {
    // 1. Try fetching from Supabase with joined student details
    const { data, error } = await supabase
      .from('student_mock_exam_attempts')
      .select(`
        *,
        students:student_id (
          full_name,
          admission_number,
          branch:branch_id (
            name
          )
        )
      `)
      .order('attempted_at', { ascending: false })
      .limit(50)

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        driving_school_id: item.driving_school_id,
        student_id: item.student_id,
        total_questions: item.total_questions,
        correct_answers_count: item.correct_answers_count,
        score_percentage: item.score_percentage,
        passed: item.passed,
        time_spent_seconds: item.time_spent_seconds,
        answers: item.answers,
        attempted_at: item.attempted_at,
        student_name: item.students?.full_name || 'Amaya Fernando',
        admission_number: item.students?.admission_number || 'ADM-2026-0101',
        branch_name: item.students?.branch?.name || 'Colombo Central',
      }))
    }

    // Fallback: use stored data + student lookup
    const local = getStoredData<MockExamAttempt[]>(ACADEMY_MOCK_ATTEMPTS_KEY, [])
    const students = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])

    if (local.length > 0) {
      return local.map((attempt) => {
        const student = students.find((s) => s.id === attempt.student_id)
        return {
          ...attempt,
          student_name: student?.full_name || 'Learner Student',
          admission_number: student?.admission_number || 'ADM-2026-0001',
          branch_name: student?.branch?.name || 'Main Academy',
        }
      })
    }

    // Default mock data for admin view
    return [
      {
        id: 'attempt-demo-1',
        driving_school_id: drivingSchoolId || 'ds-01',
        student_id: 'std-01',
        student_name: 'Amaya Fernando',
        admission_number: 'ADM-2026-0101',
        branch_name: 'Colombo Central (Nugegoda)',
        total_questions: 40,
        correct_answers_count: 37,
        score_percentage: 92.5,
        passed: true,
        time_spent_seconds: 1420,
        answers: [],
        attempted_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: 'attempt-demo-2',
        driving_school_id: drivingSchoolId || 'ds-01',
        student_id: 'std-02',
        student_name: 'Kasun Perera',
        admission_number: 'ADM-2026-0102',
        branch_name: 'Colombo Central (Nugegoda)',
        total_questions: 40,
        correct_answers_count: 32,
        score_percentage: 80,
        passed: true,
        time_spent_seconds: 1850,
        answers: [],
        attempted_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
      {
        id: 'attempt-demo-3',
        driving_school_id: drivingSchoolId || 'ds-01',
        student_id: 'std-03',
        student_name: 'Dinuka Senanayake',
        admission_number: 'ADM-2026-0103',
        branch_name: 'Kandy Road Branch',
        total_questions: 40,
        correct_answers_count: 26,
        score_percentage: 65,
        passed: false,
        time_spent_seconds: 2100,
        answers: [],
        attempted_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
      {
        id: 'attempt-demo-4',
        driving_school_id: drivingSchoolId || 'ds-01',
        student_id: 'std-04',
        student_name: 'Tharindu Wickramasinghe',
        admission_number: 'ADM-2026-0104',
        branch_name: 'Galle Coastal Branch',
        total_questions: 40,
        correct_answers_count: 35,
        score_percentage: 87.5,
        passed: true,
        time_spent_seconds: 1600,
        answers: [],
        attempted_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      },
      {
        id: 'attempt-demo-5',
        driving_school_id: drivingSchoolId || 'ds-01',
        student_id: 'std-05',
        student_name: 'Nimna Jayawardena',
        admission_number: 'ADM-2026-0105',
        branch_name: 'Colombo Central (Nugegoda)',
        total_questions: 40,
        correct_answers_count: 28,
        score_percentage: 70,
        passed: false,
        time_spent_seconds: 2200,
        answers: [],
        attempted_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
    ]
  } catch {
    return []
  }
}
