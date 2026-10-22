import type { BirdPartId } from '@/components/hero/birdRig'
import { TRIPO_AVIAN_FOCUS_WINGS } from '@/components/hero/birdTripoAvianRig'

export type BirdTrainMode = 'auto' | 'train'

export type BirdTrainFocus = 'hop' | 'wings' | 'free'

/** Which joint sidebar catalog to show for this GLB */
export type BirdJointCatalog = 'meshy' | 'tripo-avian' | 'none'

export type BirdTrainVersion = {
  id: number
  label: string
  blurb: string
  mode: BirdTrainMode
  /** GLB for this version — V1 keeps the original asset */
  modelUrl: string
  /** Movement this version is meant to teach (train mode) */
  focus?: BirdTrainFocus
  /**
   * Joint list source. Default `meshy` for V1–V3.
   * `none` = mesh-only / wrong skeleton for Meshy UI (no teach list).
   * `tripo-avian` = Tripo auto-rig bone names.
   */
  jointCatalog?: BirdJointCatalog
  /**
   * Bump to invalidate saved teach poses for this version (forces rest pose).
   */
  poseResetToken?: number
}

/**
 * V1 = original Meshy look + auto ground loop (skinned)
 * V2 = stylized modular rebuild (motion reference)
 * V3 = V1 look + V2 motion concepts (split meshes, bone-parented)
 * V5/V6 = Tripo mesh only (no matching Meshy joints)
 * V7 = Tripo avian rig (preview; joints list deferred to V8)
 * V8 = Tripo avian rig + matching joint catalog
 */
export const BIRD_TRAIN_VERSIONS: BirdTrainVersion[] = [
  {
    id: 1,
    label: 'Version 1',
    blurb: 'Auto ground loop (demo)',
    mode: 'auto',
    modelUrl: '/bird.glb',
    jointCatalog: 'meshy',
  },
  {
    id: 2,
    label: 'Version 2',
    blurb: 'Modular stylized — motion reference',
    mode: 'train',
    modelUrl: '/bird-v2.glb',
    focus: 'wings',
    jointCatalog: 'meshy',
  },
  {
    id: 3,
    label: 'Version 3',
    blurb: 'V1 look + V2 modular motion',
    mode: 'train',
    modelUrl: '/bird-v3.glb?v=pocket-inflate-31',
    focus: 'wings',
    jointCatalog: 'meshy',
  },
  {
    id: 5,
    label: 'Version 5',
    blurb: 'Tripo P1 from V4 master (extreme PBR)',
    mode: 'train',
    modelUrl: '/bird-v5.glb',
    jointCatalog: 'none',
  },
  {
    id: 6,
    label: 'Version 6',
    blurb: 'Tripo P1 open-wing multiview (no rig)',
    mode: 'train',
    modelUrl: '/bird-v6.glb',
    jointCatalog: 'none',
  },
  {
    id: 7,
    label: 'Version 7',
    blurb: 'V6 + Tripo avian rig (see V8 for joints)',
    mode: 'train',
    modelUrl: '/bird-v7.glb',
    jointCatalog: 'none',
  },
  {
    id: 8,
    label: 'Version 8',
    blurb: 'Tripo avian rig — teach joints',
    mode: 'train',
    modelUrl: '/bird-v8.glb',
    focus: 'wings',
    jointCatalog: 'tripo-avian',
    /** Wipe any prior V8 teach offsets back to Tripo rest */
    poseResetToken: 1,
  },
]

export function versionJointCatalog(v: BirdTrainVersion): BirdJointCatalog {
  return v.jointCatalog ?? 'meshy'
}

export const FOCUS_HINT: Record<BirdTrainFocus, string> = {
  hop: 'Pose a crouch or mid-air hop. Drag joints or use the axis sliders.',
  wings:
    'Wings are separate meshes (base / alula / tip). Raise freely — body stays put. Bic: bicBody + bicTip open the beak.',
  free: 'Pose any joints. Parts are modular (no skin-weight bleed).',
}

export const TRIPO_FOCUS_HINT =
  'Tripo avian bones. Start with Left/Right wing 0–6; drag gizmo or use X / Y / Z sliders.'

export function isWingJoint(id: BirdPartId): boolean {
  return (
    id === 'wingLBase' ||
    id === 'wingLAlula' ||
    id === 'wingLPhalanxTip' ||
    id === 'wingRBase' ||
    id === 'wingRAlula' ||
    id === 'wingRPhalanxTip'
  )
}

export function isTripoWingJoint(id: string): boolean {
  return (
    id.includes('Left_Limb') ||
    id.includes('Right_Limb') ||
    (id.startsWith('bone_') &&
      ['36', '37', '38', '42', '43', '44', '45', '46', '51', '52', '56', '57', '58', '59'].some(
        (n) => id === `bone_${n}`
      ))
  )
}

/** Suggested joints to start with for each teach focus (Meshy catalog) */
export const FOCUS_JOINTS: Record<BirdTrainFocus, BirdPartId[]> = {
  hop: ['pelvis', 'lumbar', 'legLHip', 'legLKnee', 'legRHip', 'legRKnee'],
  wings: [
    'wingLBase',
    'wingLAlula',
    'wingLPhalanxTip',
    'wingRBase',
    'wingRAlula',
    'wingRPhalanxTip',
    'bicBody',
    'bicTip',
    'legLHip',
    'legRHip',
  ],
  free: [],
}

export const TRIPO_FOCUS_JOINTS: Record<BirdTrainFocus, string[]> = {
  hop: ['bone_25', 'bone_26', 'bone_28', 'bone_30'],
  wings: [...TRIPO_AVIAN_FOCUS_WINGS],
  free: [],
}
