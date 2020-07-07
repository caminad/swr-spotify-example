/**
 * @param {number} size
 */
function randomBytes(size) {
  return crypto.getRandomValues(new Uint8Array(size))
}

/**
 * @param {Uint8Array} bytes
 */
function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

/**
 * https://tools.ietf.org/html/rfc7636#section-4.2
 * @param {string} code_verifier
 */
async function generateCodeChallenge(code_verifier) {
  const codeVerifierBytes = new TextEncoder().encode(code_verifier)
  const hashBuffer = await crypto.subtle.digest('SHA-256', codeVerifierBytes)
  return base64url(new Uint8Array(hashBuffer))
}

/**
 * @param {RequestInfo} input
 * @param {RequestInit} [init]
 */
async function fetchJSON(input, init) {
  const response = await fetch(input, init)
  const body = await response.json()
  if (!response.ok) {
    throw new ErrorResponse(response, body)
  }
  return body
}

class ErrorResponse extends Error {
  /**
   * @param {Response} response
   * @param {any} body
   */
  constructor(response, body) {
    super(response.statusText)
    this.status = response.status
    this.body = body
  }
}

export async function beginLogin() {
  // https://tools.ietf.org/html/rfc7636#section-4.1
  const code_verifier = base64url(randomBytes(96))
  const state = base64url(randomBytes(96))

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_ID,
    response_type: 'code',
    redirect_uri: `${location.origin}/callback`,
    code_challenge_method: 'S256',
    code_challenge: await generateCodeChallenge(code_verifier),
    state: state,
    // scope: '',
  })

  sessionStorage.setItem('code_verifier', code_verifier)
  sessionStorage.setItem('state', state)

  location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function completeLogin() {
  const code_verifier = sessionStorage.getItem('code_verifier')
  const state = sessionStorage.getItem('state')

  const params = new URLSearchParams(location.search)

  if (params.has('error')) {
    throw new Error(params.get('error'))
  } else if (!params.has('state')) {
    throw new Error('State missing from response')
  } else if (params.get('state') !== state) {
    throw new Error('State mismatch')
  } else if (!params.has('code')) {
    throw new Error('Code missing from response')
  }

  await createAccessToken({
    grant_type: 'authorization_code',
    code: params.get('code'),
    redirect_uri: `${location.origin}/callback`,
    code_verifier: code_verifier,
  })
}

export function logout() {
  localStorage.removeItem('tokenSet')
}

/**
 * @param {RequestInfo} input
 */
export async function fetchWithToken(input) {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    throw new ErrorResponse(new Response(undefined, { status: 401 }), {})
  }

  return fetchJSON(input, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

/**
 * @param {Record<string, string>} params
 * @returns {Promise<string>}
 */
async function createAccessToken(params) {
  const response = await fetchJSON('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_ID,
      ...params,
    }),
  })

  const accessToken = response.access_token
  const expires_at = Date.now() + 1000 * response.expires_in

  localStorage.setItem('tokenSet', JSON.stringify({ ...response, expires_at }))

  return accessToken
}

/**
 * @returns {Promise<string>}
 */
async function getAccessToken() {
  let tokenSet = JSON.parse(localStorage.getItem('tokenSet'))

  if (!tokenSet) return

  if (tokenSet.expires_at < Date.now()) {
    tokenSet = await createAccessToken({
      grant_type: 'refresh_token',
      refresh_token: tokenSet.refresh_token,
    })
  }

  return tokenSet.access_token
}
