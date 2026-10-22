import * as THREE from 'three'
import type { BirdPartId } from '@/components/hero/birdRig'

export type GroundBehavior =
  | 'idle'
  | 'hop'
  | 'look'
  | 'groom'
  | 'flap'
  | 'spread'
  | 'feed'

export type GroomTarget = 'underWing' | 'chest'

export const GROUND_BEHAVIOR_LABEL: Record<GroundBehavior, string> = {
  idle: 'Breathing',
  hop: 'Hopping',
  look: 'Looking around',
  groom: 'Scratching',
  flap: 'Flapping',
  spread: 'Spreading wings',
  feed: 'Feeding',
}

export function behaviorLabel(state: {
  behavior: GroundBehavior
  groomTarget: GroomTarget
}): string {
  if (state.behavior === 'groom') {
    return state.groomTarget === 'underWing'
      ? 'Scratching under wing'
      : 'Scratching chest'
  }
  return GROUND_BEHAVIOR_LABEL[state.behavior]
}

type Pose = Partial<Record<BirdPartId, THREE.Euler>>

const BEHAVIORS: GroundBehavior[] = [
  'idle',
  'hop',
  'look',
  'groom',
  'flap',
  'spread',
  'feed',
]

const WEIGHTS: Record<GroundBehavior, number> = {
  idle: 2.6,
  hop: 1.5,
  look: 2.0,
  groom: 1.7,
  flap: 1.4,
  spread: 1.5,
  feed: 1.7,
}

function weightedPick(exclude?: GroundBehavior): GroundBehavior {
  const pool = BEHAVIORS.filter((b) => b !== exclude)
  const total = pool.reduce((sum, b) => sum + WEIGHTS[b], 0)
  let roll = Math.random() * total
  for (const b of pool) {
    roll -= WEIGHTS[b]
    if (roll <= 0) return b
  }
  return 'idle'
}

function durationFor(behavior: GroundBehavior) {
  switch (behavior) {
    case 'hop':
      return 0.75 + Math.random() * 0.35
    case 'flap':
      return 1.1 + Math.random() * 0.5
    case 'spread':
      return 1.3 + Math.random() * 0.9
    case 'feed':
      return 1.6 + Math.random() * 0.9
    case 'groom':
      return 1.6 + Math.random() * 1.0
    case 'look':
      return 1.4 + Math.random() * 0.9
    default:
      return 1.6 + Math.random() * 1.4
  }
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export type GroundAnimState = {
  behavior: GroundBehavior
  startedAt: number
  endsAt: number
  lookSide: 1 | -1
  groomSide: 1 | -1
  groomTarget: GroomTarget
  hopCount: number
  flapRate: number
}

export type GroundPoseResult = {
  rootY: number
  rootYaw: number
  rootPitch: number
  /** radians — how far wings lift away from body (front-view readable) */
  wingOpen: number
  /** radians — flap stroke */
  wingBeat: number
  /** -1 / 0 / 1 — groom emphasizes one wing */
  wingBias: number
}

function randomGroomTarget(): GroomTarget {
  return Math.random() > 0.45 ? 'underWing' : 'chest'
}

export function createGroundAnimState(now: number): GroundAnimState {
  return {
    behavior: 'idle',
    startedAt: now,
    endsAt: now + durationFor('idle'),
    lookSide: Math.random() > 0.5 ? 1 : -1,
    groomSide: Math.random() > 0.5 ? 1 : -1,
    groomTarget: randomGroomTarget(),
    hopCount: 1 + Math.floor(Math.random() * 2),
    flapRate: 10 + Math.random() * 3,
  }
}

export function tickGroundAnimState(
  state: GroundAnimState,
  now: number
): GroundAnimState {
  if (now < state.endsAt) return state
  const next = weightedPick(state.behavior)
  return {
    behavior: next,
    startedAt: now,
    endsAt: now + durationFor(next),
    lookSide: Math.random() > 0.5 ? 1 : -1,
    groomSide: Math.random() > 0.5 ? 1 : -1,
    groomTarget: randomGroomTarget(),
    hopCount: 1 + Math.floor(Math.random() * 2),
    flapRate: 10 + Math.random() * 3,
  }
}

function clearPose(pose: Pose) {
  for (const key of Object.keys(pose) as BirdPartId[]) {
    delete pose[key]
  }
}

function setBone(pose: Pose, id: BirdPartId, x = 0, y = 0, z = 0) {
  const existing = pose[id]
  if (existing) {
    existing.x += x
    existing.y += y
    existing.z += z
  } else {
    pose[id] = new THREE.Euler(x, y, z, 'XYZ')
  }
}

export function computeGroundPose(
  state: GroundAnimState,
  now: number,
  breathPhase: number,
  out: Pose
): GroundPoseResult {
  clearPose(out)

  const localT = Math.min(
    1,
    Math.max(0, (now - state.startedAt) / Math.max(0.001, state.endsAt - state.startedAt))
  )
  const e = easeInOut(localT)
  const breath = Math.sin(breathPhase) * 0.04
  const breathDeep = Math.sin(breathPhase * 0.5) * 0.025

  setBone(out, 'lumbar', breath * 0.45, 0, breathDeep)
  setBone(out, 'thoracic', breath * 1.1, 0, 0)
  setBone(out, 'upperBack', breath * 0.8, 0, 0)
  setBone(out, 'neckBase', breath * 0.3, 0, 0)

  let rootY = 0.025 * Math.sin(breathPhase * 0.85)
  let rootYaw = 0.05 * Math.sin(breathPhase * 0.35)
  let rootPitch = 0.02 * Math.sin(breathPhase * 0.55)
  let wingOpen = 0.08 + breath * 0.04
  let wingBeat = breath * 0.06
  let wingBias = 0

  switch (state.behavior) {
    case 'idle': {
      setBone(out, 'neckTop', 0, 0.1 * Math.sin(breathPhase * 0.7), 0.04 * Math.sin(breathPhase * 0.5))
      setBone(out, 'head', 0.04 * Math.sin(breathPhase * 1.1), 0.06 * Math.sin(breathPhase * 0.6), 0)
      break
    }
    case 'look': {
      // Mostly body/root turn; keep head/neck subtle so it doesn't corkscrew
      const turn = state.lookSide * Math.sin(e * Math.PI)
      const yaw = turn * 0.42
      setBone(out, 'lumbar', 0, yaw * 0.18, 0)
      setBone(out, 'thoracic', 0.02, yaw * 0.28, yaw * 0.04)
      setBone(out, 'upperBack', 0.02, yaw * 0.35, yaw * 0.05)
      setBone(out, 'neckBase', 0.03, yaw * 0.4, yaw * 0.06)
      setBone(out, 'neckTop', 0.02, yaw * 0.45, yaw * 0.05)
      setBone(out, 'head', 0.03 * Math.sin(e * Math.PI), yaw * 0.35, yaw * 0.04)
      rootYaw += yaw * 0.7
      wingOpen = 0.1
      break
    }
    case 'hop': {
      const hops = state.hopCount
      const hopPhase = (localT * hops) % 1
      let up = 0
      let crouch = 0
      if (hopPhase < 0.22) {
        crouch = Math.sin((hopPhase / 0.22) * Math.PI)
      } else if (hopPhase < 0.85) {
        up = Math.sin(((hopPhase - 0.22) / 0.63) * Math.PI)
      } else {
        crouch = Math.sin(((hopPhase - 0.85) / 0.15) * Math.PI) * 0.45
      }

      rootY += up * 0.32 - crouch * 0.07
      rootPitch += -0.14 * up + 0.1 * crouch
      setBone(out, 'pelvis', -0.18 * up + 0.16 * crouch, 0, 0)
      setBone(out, 'lumbar', -0.1 * up + 0.12 * crouch, 0, 0)
      setBone(out, 'legLHip', 0.15 * crouch - 0.08 * up, 0, 0)
      setBone(out, 'legRHip', 0.15 * crouch - 0.08 * up, 0, 0)
      setBone(out, 'legLKnee', 0.55 * crouch + 0.25 * up, 0, 0)
      setBone(out, 'legRKnee', 0.55 * crouch + 0.25 * up, 0, 0)
      setBone(out, 'legLAnkle', -0.35 * crouch - 0.15 * up, 0, 0)
      setBone(out, 'legRAnkle', -0.35 * crouch - 0.15 * up, 0, 0)
      // Keep hop wing assist light — wing-base joints also skin the body
      wingOpen = 0.18 + up * 0.28
      wingBeat = up * 0.4 + crouch * 0.12
      break
    }
    case 'flap': {
      const flapWave = Math.sin((now - state.startedAt) * state.flapRate)
      const envelope = 0.4 + 0.6 * Math.sin(Math.min(1, localT * 1.15) * Math.PI)
      // No spine/root drive here — wing-base bones already bleed into the body mesh
      wingOpen = 0.48 * envelope
      wingBeat = flapWave * (0.4 + 0.25 * envelope)
      break
    }
    case 'spread': {
      // Hold wings open with a tiny shimmer — distinct from flapping
      const hold = Math.sin(e * Math.PI)
      wingOpen = 0.55 * hold + 0.12
      wingBeat = 0.04 * Math.sin((now - state.startedAt) * 3.2)
      setBone(out, 'thoracic', -0.04 * hold, 0, 0)
      setBone(out, 'upperBack', -0.03 * hold, 0, 0)
      setBone(out, 'neckTop', -0.04 * hold, 0.05 * Math.sin(breathPhase * 0.8), 0)
      rootPitch -= 0.03 * hold
      break
    }
    case 'feed': {
      // Deep forward lean so the bic reaches foot / ground level, then peck
      const peck = Math.sin(localT * Math.PI * 5)
      const down = 0.75 * e + 0.2 * Math.max(0, peck)
      rootPitch += 0.42 * down
      rootY -= 0.1 * down
      setBone(out, 'pelvis', 0.28 * down, 0, 0)
      setBone(out, 'lumbar', 0.38 * down, 0, 0)
      setBone(out, 'thoracic', 0.48 * down, 0, 0)
      setBone(out, 'upperBack', 0.4 * down, 0, 0)
      setBone(out, 'neckBase', 0.85 * down + peck * 0.22, 0.08 * Math.sin(localT * 9), 0)
      setBone(out, 'neckTop', 0.75 * down + peck * 0.28, 0, 0)
      setBone(out, 'head', 0.65 * down + peck * 0.32, 0, 0)
      setBone(out, 'bicBody', 0.15 * down + peck * 0.2, 0, 0)
      setBone(out, 'bicTip', 0.2 * down + peck * 0.28, 0, 0)
      setBone(out, 'legLHip', 0.12 * down, 0, 0)
      setBone(out, 'legRHip', 0.12 * down, 0, 0)
      setBone(out, 'legLKnee', 0.45 * down, 0, 0)
      setBone(out, 'legRKnee', 0.45 * down, 0, 0)
      setBone(out, 'legLAnkle', -0.2 * down, 0, 0)
      setBone(out, 'legRAnkle', -0.2 * down, 0, 0)
      wingOpen = 0.1
      break
    }
    case 'groom': {
      const side = state.groomSide
      const reach = Math.sin(e * Math.PI)
      const scratch = Math.sin((now - state.startedAt) * 11) * reach

      if (state.groomTarget === 'underWing') {
        // Raise a wing and tuck the bic underneath to scratch
        setBone(out, 'lumbar', 0.06 * reach, side * 0.12 * reach, 0)
        setBone(out, 'thoracic', 0.1 * reach, side * 0.22 * reach, side * 0.06 * reach)
        setBone(out, 'upperBack', 0.12 * reach, side * 0.28 * reach, side * 0.08 * reach)
        setBone(out, 'neckBase', 0.45 * reach, side * 0.55 * reach, side * 0.12 * reach)
        setBone(out, 'neckTop', 0.55 * reach, side * 0.5 * reach, side * 0.1 * reach)
        setBone(out, 'head', 0.5 * reach + scratch * 0.08, side * 0.35 * reach, side * 0.08 * reach)
        setBone(out, 'bicBody', 0.12 * reach + scratch * 0.16, side * 0.06 * reach, 0)
        setBone(out, 'bicTip', 0.16 * reach + scratch * 0.22, 0, 0)
        rootYaw += side * 0.12 * reach
        rootPitch += 0.08 * reach
        wingOpen = 0.2 + 0.55 * reach
        wingBeat = 0.08 * reach
        wingBias = side
      } else {
        // Scratch the chest with the bic — curl head down to breast
        setBone(out, 'lumbar', 0.1 * reach, 0, 0)
        setBone(out, 'thoracic', 0.18 * reach, 0, 0)
        setBone(out, 'upperBack', 0.22 * reach, 0, 0)
        setBone(out, 'neckBase', 0.7 * reach, side * 0.12 * reach, 0)
        setBone(out, 'neckTop', 0.8 * reach + scratch * 0.06, side * 0.1 * reach, 0)
        setBone(out, 'head', 0.75 * reach + scratch * 0.1, side * 0.08 * reach, 0)
        setBone(out, 'bicBody', 0.2 * reach + scratch * 0.18, 0, 0)
        setBone(out, 'bicTip', 0.25 * reach + scratch * 0.24, 0, 0)
        rootPitch += 0.12 * reach
        wingOpen = 0.12
        wingBeat = 0.03
        wingBias = 0
      }
      break
    }
  }

  const fade = localT > 0.85 ? lerp(1, 0.2, (localT - 0.85) / 0.15) : 1
  if (fade < 1) {
    for (const id of Object.keys(out) as BirdPartId[]) {
      const euler = out[id]
      if (!euler) continue
      euler.x *= fade
      euler.y *= fade
      euler.z *= fade
    }
    rootY *= fade
    rootYaw = lerp(rootYaw, 0.05 * Math.sin(breathPhase * 0.35), 1 - fade)
    rootPitch *= fade
    wingOpen *= fade
    wingBeat *= fade
  }

  return { rootY, rootYaw, rootPitch, wingOpen, wingBeat, wingBias }
}

const scratchQuat = new THREE.Quaternion()
const scratchEuler = new THREE.Euler()
const parentWorldQ = new THREE.Quaternion()
const parentInvQ = new THREE.Quaternion()
const worldDelta = new THREE.Quaternion()
const axisZ = new THREE.Vector3(0, 0, 1)
const axisX = new THREE.Vector3(1, 0, 0)
const axisY = new THREE.Vector3(0, 1, 0)
const qOpen = new THREE.Quaternion()
const qBeat = new THREE.Quaternion()
const qFold = new THREE.Quaternion()

export function applyPoseToBones(
  bones: Partial<Record<BirdPartId, THREE.Bone>>,
  rest: Partial<Record<BirdPartId, THREE.Quaternion>>,
  pose: Pose
) {
  for (const id of Object.keys(rest) as BirdPartId[]) {
    // Wings handled in world-space pass
    if (
      id === 'wingLBase' ||
      id === 'wingLAlula' ||
      id === 'wingLPhalanxTip' ||
      id === 'wingRBase' ||
      id === 'wingRAlula' ||
      id === 'wingRPhalanxTip'
    ) {
      const bone = bones[id]
      const base = rest[id]
      if (bone && base) bone.quaternion.copy(base)
      continue
    }

    const bone = bones[id]
    const base = rest[id]
    if (!bone || !base) continue
    const offset = pose[id]
    if (offset) {
      scratchEuler.copy(offset)
      scratchQuat.setFromEuler(scratchEuler)
      bone.quaternion.copy(base).multiply(scratchQuat)
    } else {
      bone.quaternion.copy(base)
    }
  }
}

/**
 * Train / teach mode: local euler offsets on every joint, including wing bases.
 * (Weights were cleaned in Blender; bases are unlocked for Version 2 teaching.)
 */
export function applyTrainPoseToBones(
  bones: Partial<Record<string, THREE.Bone>>,
  rest: Partial<Record<string, THREE.Quaternion>>,
  pose: Partial<Record<string, THREE.Euler>>
) {
  for (const id of Object.keys(rest)) {
    const bone = bones[id]
    const base = rest[id]
    if (!bone || !base) continue
    const offset = pose[id]
    if (offset) {
      scratchEuler.copy(offset)
      scratchQuat.setFromEuler(scratchEuler)
      bone.quaternion.copy(base).multiply(scratchQuat)
    } else {
      bone.quaternion.copy(base)
    }
  }
}

/**
 * Apply wing motion in world space so open/flap reads from the front camera.
 * Open = rotate around forward (Z), Beat = rotate around right (X).
 */
export function applyWorldWingMotion(
  bones: Partial<Record<BirdPartId, THREE.Bone>>,
  rest: Partial<Record<BirdPartId, THREE.Quaternion>>,
  wingOpen: number,
  wingBeat: number,
  wingBias = 0
) {
  const chainL: BirdPartId[] = ['wingLBase', 'wingLAlula', 'wingLPhalanxTip']
  const chainR: BirdPartId[] = ['wingRBase', 'wingRAlula', 'wingRPhalanxTip']
  // Base joints carry most body skin weight — keep them nearly still;
  // alula/tip do the visible flap so the torso doesn't hitch along.
  const falloff = [0.12, 0.85, 1]

  const applySide = (chain: BirdPartId[], side: 1 | -1) => {
    const bias =
      wingBias === 0 ? 1 : side === wingBias ? 1.15 : 0.2
    const open = wingOpen * bias
    const beat = wingBeat * bias

    chain.forEach((id, index) => {
      const bone = bones[id]
      const base = rest[id]
      if (!bone || !base) return

      const f = falloff[index]
      // Front-view: Z rotation lifts wing out to the side; X adds flap stroke
      qOpen.setFromAxisAngle(axisZ, side * open * f)
      qBeat.setFromAxisAngle(axisX, -beat * f)
      qFold.setFromAxisAngle(axisY, side * open * 0.18 * f)
      worldDelta.copy(qOpen).multiply(qBeat).multiply(qFold)

      if (bone.parent) {
        bone.parent.updateWorldMatrix(true, false)
        bone.parent.getWorldQuaternion(parentWorldQ)
        parentInvQ.copy(parentWorldQ).invert()
        // local = parent^-1 * worldDelta * parent
        scratchQuat.copy(parentInvQ).multiply(worldDelta).multiply(parentWorldQ)
        bone.quaternion.copy(base).multiply(scratchQuat)
      } else {
        bone.quaternion.copy(base).multiply(worldDelta)
      }
      bone.updateMatrixWorld(false)
    })
  }

  // Parent bones first so children get updated parent world quats
  applySide(chainL, 1)
  applySide(chainR, -1)
}
