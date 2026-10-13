export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** Fetch JSON from an app route and turn every failure into a readable message. */
export async function api<T = unknown>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, headers, ...rest } = init || {}
  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers: json === undefined ? headers : { 'Content-Type': 'application/json', ...headers },
      body: json === undefined ? rest.body : JSON.stringify(json),
    })
  } catch {
    throw new ApiError('You appear to be offline. Check your connection and try again.', 0)
  }

  const text = await response.text()
  let body: unknown = null
  if (text) {
    try { body = JSON.parse(text) } catch { body = null }
  }

  if (!response.ok) {
    const message = body && typeof body === 'object' && 'error' in body && typeof (body as { error: unknown }).error === 'string'
      ? (body as { error: string }).error
      : response.status === 401 ? 'Your session has ended. Please sign in again.'
        : response.status === 429 ? 'Too many requests. Please wait a moment and try again.'
          : 'Something went wrong. Please try again.'
    if (response.status === 401 && typeof window !== 'undefined') {
      const next = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.assign(`/auth/signin?callbackUrl=${next}`)
    }
    throw new ApiError(message, response.status)
  }

  return body as T
}

export function errorMessage(reason: unknown, fallback = 'Something went wrong. Please try again.') {
  return reason instanceof Error && reason.message ? reason.message : fallback
}
