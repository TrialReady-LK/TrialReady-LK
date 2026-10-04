import type { TheoryLanguage } from '../../theory/types/theory'
import {
  sendGeminiChatMessage,
  type ChatMessagePayload,
  type ChatResponsePayload,
} from './geminiChatService'

export interface CopilotContext {
  role?: string | null
  userName?: string | null
  drivingSchoolName?: string | null
}

export interface CopilotResponse {
  text: string
  matchedCategory?: string
  suggestions?: string[]
  status?: string
}

/**
 * Async query processor powered by Google Gemini API via TrialReady Backend
 */
export async function queryGeminiCopilot(
  messages: ChatMessagePayload[],
  language: TheoryLanguage = 'en',
  context?: CopilotContext
): Promise<CopilotResponse> {
  const result: ChatResponsePayload = await sendGeminiChatMessage(messages, {
    language,
    userName: context?.userName,
    role: context?.role,
  })

  return {
    text: result.text,
    status: result.status,
    suggestions: result.suggestions,
  }
}

/**
 * Backward compatibility wrapper for single synchronous queries
 */
export function processCopilotQuery(
  rawQuery: string,
  _language: TheoryLanguage = 'en',
  _context?: CopilotContext
): CopilotResponse {
  return {
    text: `Your question "${rawQuery}" is being processed by Google Gemini.`,
    suggestions: [
      'Solve 2x + 5 = 15',
      'Write a Python function',
      'Highway Code rules',
      'Hill Start tips',
    ],
  }
}
