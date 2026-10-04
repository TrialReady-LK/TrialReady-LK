import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  sendGeminiChatMessage,
} from './geminiChatService'
import { queryGeminiCopilot } from './copilotEngine'

describe('geminiChatService & copilotEngine', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('successfully sends message history and returns Gemini response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'The solution is x = 5.',
        status: 'success',
        suggestions: ['Next question', 'Explain in detail'],
      }),
    } as Response)

    const result = await sendGeminiChatMessage([
      { sender: 'user', text: 'Solve 2x + 5 = 15' },
    ])

    expect(result.status).toBe('success')
    expect(result.text).toBe('The solution is x = 5.')
    expect(result.suggestions).toContain('Next question')
  })

  it('handles network failure gracefully with friendly fallback in English', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'))

    const result = await sendGeminiChatMessage(
      [{ sender: 'user', text: 'Hello' }],
      { language: 'en' }
    )

    expect(result.status).toBe('network_error')
    expect(result.text).toContain('Could not connect to the Gemini AI server')
  })

  it('handles network failure with friendly fallback in Sinhala', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'))

    const result = await sendGeminiChatMessage(
      [{ sender: 'user', text: 'ආයුබෝවන්' }],
      { language: 'si' }
    )

    expect(result.status).toBe('network_error')
    expect(result.text).toContain('Gemini AI සේවාදායකය හා සම්බන්ධ වීමට නොහැකි විය')
  })

  it('queryGeminiCopilot correctly formats response from backend', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'Here is a Python function: def is_palindrome(s): return s == s[::-1]',
        status: 'success',
      }),
    } as Response)

    const response = await queryGeminiCopilot(
      [{ sender: 'user', text: 'Write a python palindrome function' }],
      'en',
      { userName: 'Amila' }
    )

    expect(response.status).toBe('success')
    expect(response.text).toContain('def is_palindrome')
  })
})
