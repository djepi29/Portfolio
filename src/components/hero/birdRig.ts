/**
 * Semantic names for the Meshy SmartRig bird.
 * Original Meshy names stay as `source`; we rename bones at runtime to `id`.
 *
 * Legs: side chains to the ground with 3 toe branches each.
 * Wings: 3-point chains (was mislabeled "face left/right").
 *
 * Local axes (every bone):
 * - rotateX = pitch (nod / tilt forward-back)
 * - rotateY = yaw (turn left-right)
 * - rotateZ = roll
 * - position xyz / scale xyz are possible but usually avoid for skinned mesh
 *
 * Scene root group (not a bone): full body move/bob/turn in world space.
 */

export type BirdPartId =
  | 'pelvis'
  | 'lumbar'
  | 'thoracic'
  | 'upperBack'
  | 'neckBase'
  | 'neckTop'
  | 'head'
  | 'crestFeatherA'
  | 'crestFeatherATip'
  | 'bicBody'
  | 'bicTip'
  | 'crestFeatherC'
  | 'crestFeatherCTip'
  | 'crestFeatherD'
  | 'crestFeatherDTip'
  | 'wingLBase'
  | 'wingLAlula'
  | 'wingLPhalanxTip'
  | 'wingRBase'
  | 'wingRAlula'
  | 'wingRPhalanxTip'
  | 'tailRoot'
  | 'tail'
  | 'tailFeatherA'
  | 'tailFeatherATip'
  | 'tailFeatherB'
  | 'tailFeatherBTip'
  | 'tailFeatherC'
  | 'tailFeatherCMid'
  | 'tailFeatherCTip'
  | 'legLHip'
  | 'legLKnee'
  | 'legLAnkle'
  | 'legLFoot'
  | 'toeL1'
  | 'toeL1Mid'
  | 'toeL1Tip'
  | 'toeL2'
  | 'toeL2Mid'
  | 'toeL2Tip'
  | 'toeL3'
  | 'toeL3Mid'
  | 'toeL3Tip'
  | 'legRHip'
  | 'legRKnee'
  | 'legRAnkle'
  | 'legRFoot'
  | 'toeR1'
  | 'toeR1Mid'
  | 'toeR1Tip'
  | 'toeR2'
  | 'toeR2Mid'
  | 'toeR2Tip'
  | 'toeR3'
  | 'toeR3Mid'
  | 'toeR3Tip'

export type BirdPart = {
  id: BirdPartId
  source: string
  label: string
  role: string
  /** Primary axes we intend to drive in animation */
  primaryAxes: Array<'x' | 'y' | 'z'>
}

/** Mesh / armature (not skinned joints) */
export const BIRD_ASSETS = {
  armature: { source: 'SmartRigArmature', id: 'BirdArmature', label: 'Armature root' },
  mesh: { source: 'Mesh_0', id: 'BirdBody', label: 'Skinned bird mesh' },
  material: { source: 'Material_0', id: 'BirdMaterial', label: 'Bird material' },
} as const

/**
 * Full joint map (labels verified visually). Hierarchy:
 *
 * pelvis
 * └─ lumbar
 *    ├─ thoracic → upperBack
 *    │  └─ neckBase → neckTop → head
 *    │       ├─ crest feathers / bic
 *    │       ├─ wingLBase → wingLAlula → wingLPhalanxTip
 *    │       └─ wingRBase → wingRAlula → wingRPhalanxTip
 *    ├─ tailRoot → tail → tail feathers
 *    ├─ legLHip → legLKnee → legLAnkle → legLFoot → toes
 *    └─ legRHip → legRKnee → legRAnkle → legRFoot → toes
 */
export const BIRD_PARTS: BirdPart[] = [
  { id: 'pelvis', source: 'Bone_000', label: 'Pelvis', role: 'Pelvis / root below lumbar', primaryAxes: ['x', 'y', 'z'] },
  { id: 'lumbar', source: 'Bone_001', label: 'Lumbar spine', role: 'Lumbar spine area / lower back', primaryAxes: ['x', 'z'] },
  { id: 'thoracic', source: 'Bone_003', label: 'Thoracic spine', role: 'Thoracic vertebrae', primaryAxes: ['x', 'y'] },
  { id: 'upperBack', source: 'Bone_002', label: 'Upper back', role: 'Upper back, close to thoracic', primaryAxes: ['x', 'y', 'z'] },

  { id: 'neckBase', source: 'Bone_016', label: 'Neck base', role: 'Where neck meets chest', primaryAxes: ['x', 'z'] },
  { id: 'neckTop', source: 'Bone_015', label: 'Neck top', role: 'Where neck meets head', primaryAxes: ['x', 'z'] },
  { id: 'head', source: 'Bone_014', label: 'Head', role: 'Inside middle of head, forehead-aligned', primaryAxes: ['x', 'z'] },

  { id: 'crestFeatherA', source: 'Bone_049', label: 'Crest feather A', role: 'Crest detail', primaryAxes: ['x', 'z'] },
  { id: 'crestFeatherATip', source: 'Bone_048', label: 'Crest feather A tip', role: 'Crest detail', primaryAxes: ['x', 'z'] },
  { id: 'bicBody', source: 'Bone_051', label: 'Bic body', role: 'Bic body', primaryAxes: ['x', 'z'] },
  { id: 'bicTip', source: 'Bone_050', label: 'Bic tip', role: 'Bic tip', primaryAxes: ['x', 'z'] },
  { id: 'crestFeatherC', source: 'Bone_053', label: 'Crest feather C', role: 'Crest detail', primaryAxes: ['x', 'z'] },
  { id: 'crestFeatherCTip', source: 'Bone_052', label: 'Crest feather C tip', role: 'Crest detail', primaryAxes: ['x', 'z'] },
  { id: 'crestFeatherD', source: 'Bone_055', label: 'Crest feather D', role: 'Crest detail', primaryAxes: ['x', 'z'] },
  { id: 'crestFeatherDTip', source: 'Bone_054', label: 'Crest feather D tip', role: 'Crest detail', primaryAxes: ['x', 'z'] },

  { id: 'wingLBase', source: 'Bone_019', label: 'Left wing base', role: 'Scapular / where left wing meets body', primaryAxes: ['x', 'y', 'z'] },
  { id: 'wingLAlula', source: 'Bone_018', label: 'Left alula', role: 'Where left wing curves into the phalanges', primaryAxes: ['x', 'y', 'z'] },
  { id: 'wingLPhalanxTip', source: 'Bone_017', label: 'Left wing tip', role: 'End of left wing phalanges', primaryAxes: ['x', 'y', 'z'] },
  { id: 'wingRBase', source: 'Bone_022', label: 'Right wing base', role: 'Scapular / where right wing meets body', primaryAxes: ['x', 'y', 'z'] },
  { id: 'wingRAlula', source: 'Bone_021', label: 'Right alula', role: 'Where right wing curves into the phalanges', primaryAxes: ['x', 'y', 'z'] },
  { id: 'wingRPhalanxTip', source: 'Bone_020', label: 'Right wing tip', role: 'End of right wing phalanges', primaryAxes: ['x', 'y', 'z'] },

  { id: 'tailRoot', source: 'Bone_005', label: 'Tail root', role: 'Tail base', primaryAxes: ['x', 'y', 'z'] },
  { id: 'tail', source: 'Bone_004', label: 'Tail', role: 'Tail fan', primaryAxes: ['x', 'y', 'z'] },
  { id: 'tailFeatherA', source: 'Bone_024', label: 'Tail feather A', role: 'Tail feather', primaryAxes: ['x', 'z'] },
  { id: 'tailFeatherATip', source: 'Bone_023', label: 'Tail feather A tip', role: 'Tail feather', primaryAxes: ['x', 'z'] },
  { id: 'tailFeatherB', source: 'Bone_026', label: 'Tail feather B', role: 'Tail feather', primaryAxes: ['x', 'z'] },
  { id: 'tailFeatherBTip', source: 'Bone_025', label: 'Tail feather B tip', role: 'Tail feather', primaryAxes: ['x', 'z'] },
  { id: 'tailFeatherC', source: 'Bone_029', label: 'Tail feather C', role: 'Tail feather', primaryAxes: ['x', 'z'] },
  { id: 'tailFeatherCMid', source: 'Bone_028', label: 'Tail feather C mid', role: 'Tail feather', primaryAxes: ['x', 'z'] },
  { id: 'tailFeatherCTip', source: 'Bone_027', label: 'Tail feather C tip', role: 'Tail feather', primaryAxes: ['x', 'z'] },

  { id: 'legLHip', source: 'Bone_009', label: 'Left hip', role: 'Where left thigh meets body', primaryAxes: ['x', 'z', 'y'] },
  { id: 'legLKnee', source: 'Bone_008', label: 'Left knee', role: 'Where left thigh connects to lower leg', primaryAxes: ['x', 'z'] },
  { id: 'legLAnkle', source: 'Bone_007', label: 'Left ankle', role: 'Left ankle', primaryAxes: ['x', 'z'] },
  { id: 'legLFoot', source: 'Bone_006', label: 'Left foot', role: 'Left foot', primaryAxes: ['x', 'z'] },
  { id: 'toeL1', source: 'Bone_032', label: 'Left toe 1', role: 'Left foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeL1Mid', source: 'Bone_031', label: 'Left toe 1 mid', role: 'Left foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeL1Tip', source: 'Bone_030', label: 'Left toe 1 tip', role: 'Left foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeL2', source: 'Bone_035', label: 'Left toe 2', role: 'Left foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeL2Mid', source: 'Bone_034', label: 'Left toe 2 mid', role: 'Left foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeL2Tip', source: 'Bone_033', label: 'Left toe 2 tip', role: 'Left foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeL3', source: 'Bone_038', label: 'Left toe 3', role: 'Left foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeL3Mid', source: 'Bone_037', label: 'Left toe 3 mid', role: 'Left foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeL3Tip', source: 'Bone_036', label: 'Left toe 3 tip', role: 'Left foot toe', primaryAxes: ['x', 'z'] },

  { id: 'legRHip', source: 'Bone_013', label: 'Right hip', role: 'Where right thigh meets body', primaryAxes: ['x', 'z', 'y'] },
  { id: 'legRKnee', source: 'Bone_012', label: 'Right knee', role: 'Where right thigh connects to lower leg', primaryAxes: ['x', 'z'] },
  { id: 'legRAnkle', source: 'Bone_011', label: 'Right ankle', role: 'Right ankle', primaryAxes: ['x', 'z'] },
  { id: 'legRFoot', source: 'Bone_010', label: 'Right foot', role: 'Right foot', primaryAxes: ['x', 'z'] },
  { id: 'toeR1', source: 'Bone_041', label: 'Right toe 1', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeR1Mid', source: 'Bone_040', label: 'Right toe 1 mid', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeR1Tip', source: 'Bone_039', label: 'Right toe 1 tip', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeR2', source: 'Bone_044', label: 'Right toe 2', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeR2Mid', source: 'Bone_043', label: 'Right toe 2 mid', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeR2Tip', source: 'Bone_042', label: 'Right toe 2 tip', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeR3', source: 'Bone_047', label: 'Right toe 3', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeR3Mid', source: 'Bone_046', label: 'Right toe 3 mid', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
  { id: 'toeR3Tip', source: 'Bone_045', label: 'Right toe 3 tip', role: 'Right foot toe', primaryAxes: ['x', 'z'] },
]

export const BIRD_PART_BY_SOURCE = Object.fromEntries(
  BIRD_PARTS.map((part) => [part.source, part])
) as Record<string, BirdPart>

export const BIRD_PART_BY_ID = Object.fromEntries(
  BIRD_PARTS.map((part) => [part.id, part])
) as Record<BirdPartId, BirdPart>

export const LEG_L_CHAIN = [
  'legLHip',
  'legLKnee',
  'legLAnkle',
  'legLFoot',
] as const satisfies readonly BirdPartId[]

export const LEG_R_CHAIN = [
  'legRHip',
  'legRKnee',
  'legRAnkle',
  'legRFoot',
] as const satisfies readonly BirdPartId[]

export const WING_L_CHAIN = [
  'wingLBase',
  'wingLAlula',
  'wingLPhalanxTip',
] as const satisfies readonly BirdPartId[]

export const WING_R_CHAIN = [
  'wingRBase',
  'wingRAlula',
  'wingRPhalanxTip',
] as const satisfies readonly BirdPartId[]

export const SPINE_CHAIN = [
  'pelvis',
  'lumbar',
  'thoracic',
  'upperBack',
  'neckBase',
  'neckTop',
  'head',
] as const satisfies readonly BirdPartId[]

export type BirdPartGroup = {
  id: string
  label: string
  partIds: BirdPartId[]
}

export const BIRD_PART_GROUPS: BirdPartGroup[] = [
  {
    id: 'body',
    label: 'Body / neck / head',
    partIds: [
      'pelvis',
      'lumbar',
      'thoracic',
      'upperBack',
      'neckBase',
      'neckTop',
      'head',
    ],
  },
  {
    id: 'bic',
    label: 'Bic',
    partIds: ['bicBody', 'bicTip'],
  },
  {
    id: 'crest',
    label: 'Crest',
    partIds: [
      'crestFeatherA',
      'crestFeatherATip',
      'crestFeatherC',
      'crestFeatherCTip',
      'crestFeatherD',
      'crestFeatherDTip',
    ],
  },
  {
    id: 'wingL',
    label: 'Left wing',
    partIds: ['wingLBase', 'wingLAlula', 'wingLPhalanxTip'],
  },
  {
    id: 'wingR',
    label: 'Right wing',
    partIds: ['wingRBase', 'wingRAlula', 'wingRPhalanxTip'],
  },
  {
    id: 'tail',
    label: 'Tail',
    partIds: [
      'tailRoot',
      'tail',
      'tailFeatherA',
      'tailFeatherATip',
      'tailFeatherB',
      'tailFeatherBTip',
      'tailFeatherC',
      'tailFeatherCMid',
      'tailFeatherCTip',
    ],
  },
  {
    id: 'legL',
    label: 'Left leg / foot',
    partIds: [
      'legLHip',
      'legLKnee',
      'legLAnkle',
      'legLFoot',
      'toeL1',
      'toeL1Mid',
      'toeL1Tip',
      'toeL2',
      'toeL2Mid',
      'toeL2Tip',
      'toeL3',
      'toeL3Mid',
      'toeL3Tip',
    ],
  },
  {
    id: 'legR',
    label: 'Right leg / foot',
    partIds: [
      'legRHip',
      'legRKnee',
      'legRAnkle',
      'legRFoot',
      'toeR1',
      'toeR1Mid',
      'toeR1Tip',
      'toeR2',
      'toeR2Mid',
      'toeR2Tip',
      'toeR3',
      'toeR3Mid',
      'toeR3Tip',
    ],
  },
]
