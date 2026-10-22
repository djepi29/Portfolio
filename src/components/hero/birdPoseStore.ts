export type PoseEuler = { x: number; y: number; z: number }

/** Per-version taught pose: joint id → local euler offset from rest (radians) */
export type VersionPose = Partial<Record<string, PoseEuler>>

const STORAGE_KEY = 'portfolio-bird-train-poses-v1'
const TOKEN_KEY = 'portfolio-bird-train-pose-tokens-v1'

type PoseBook = Record<string, VersionPose>
type TokenBook = Record<string, number>

function loadBook(): PoseBook {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as PoseBook
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveBook(book: PoseBook) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(book))
  } catch {
    // ignore quota / private mode
  }
}

function loadTokens(): TokenBook {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as TokenBook
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveTokens(tokens: TokenBook) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
  } catch {
    // ignore
  }
}

/**
 * Load taught pose. If `resetToken` is set and does not match the last saved
 * token for this version, returns {} (rest pose) and clears stale data.
 */
export function loadVersionPose(
  versionId: number,
  resetToken?: number
): VersionPose {
  const key = String(versionId)
  const book = loadBook()
  if (resetToken != null) {
    const tokens = loadTokens()
    if (tokens[key] !== resetToken) {
      if (book[key]) {
        delete book[key]
        saveBook(book)
      }
      tokens[key] = resetToken
      saveTokens(tokens)
      return {}
    }
  }
  return { ...(book[key] ?? {}) }
}

export function saveVersionPose(
  versionId: number,
  pose: VersionPose,
  resetToken?: number
) {
  const key = String(versionId)
  const book = loadBook()
  book[key] = pose
  saveBook(book)
  if (resetToken != null) {
    const tokens = loadTokens()
    tokens[key] = resetToken
    saveTokens(tokens)
  }
}

export function clearVersionPose(versionId: number, resetToken?: number) {
  const key = String(versionId)
  const book = loadBook()
  delete book[key]
  saveBook(book)
  if (resetToken != null) {
    const tokens = loadTokens()
    tokens[key] = resetToken
    saveTokens(tokens)
  }
}

export function setJointEuler(
  pose: VersionPose,
  id: string,
  euler: PoseEuler
): VersionPose {
  const next = { ...pose }
  const nearZero =
    Math.abs(euler.x) < 1e-4 &&
    Math.abs(euler.y) < 1e-4 &&
    Math.abs(euler.z) < 1e-4
  if (nearZero) {
    delete next[id]
  } else {
    next[id] = { x: euler.x, y: euler.y, z: euler.z }
  }
  return next
}

export function radToDeg(r: number) {
  return (r * 180) / Math.PI
}

export function degToRad(d: number) {
  return (d * Math.PI) / 180
}
