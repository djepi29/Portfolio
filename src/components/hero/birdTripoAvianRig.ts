/**
 * Tripo avian auto-rig joint map (from bird-v7 / bird-v8 GLB skins).
 * `id` / `source` are the exact bone names on the armature — no rename step.
 */

export type TripoAvianJointId = string

export type TripoAvianPart = {
  id: TripoAvianJointId
  source: string
  label: string
  role: string
  primaryAxes: Array<'x' | 'y' | 'z'>
}

const xyz = ['x', 'y', 'z'] as const
const xz = ['x', 'z'] as const

function j(
  name: string,
  label: string,
  role: string,
  axes: ReadonlyArray<'x' | 'y' | 'z'> = xyz
): TripoAvianPart {
  return {
    id: name,
    source: name,
    label,
    role,
    primaryAxes: [...axes],
  }
}

/** Main named + anonymous joints in hierarchy order (70 skin joints). */
export const TRIPO_AVIAN_PARTS: TripoAvianPart[] = [
  j('tripo::Root', 'Root', 'Armature root'),
  j('tripo::Spine_0', 'Spine 0', 'Lower / mid spine'),
  j('tripo::Spine_1', 'Spine 1', 'Mid spine'),
  j('tripo::Spine_2', 'Spine 2', 'Upper spine / chest'),

  j('tripo::Head_0', 'Head 0', 'Neck / head base', xz),
  j('tripo::Head_1', 'Head 1', 'Head mid', xz),
  j('tripo::Head_2', 'Head 2', 'Head tip / beak area', xz),
  j('bone_4', 'Head detail A', 'Head detail under Head_1', xz),
  j('bone_6', 'Head detail B', 'Head detail under Head_1', xz),

  j('bone_9', 'Chest feather A', 'Spine_2 side chain', xz),
  j('bone_10', 'Chest feather A mid', 'Spine_2 side chain', xz),
  j('bone_11', 'Chest feather A tip', 'Spine_2 side chain', xz),
  j('bone_12', 'Chest feather A tip B', 'Spine_2 side chain', xz),
  j('bone_13', 'Chest feather B', 'Spine_2 side chain', xz),
  j('bone_14', 'Chest feather B mid', 'Spine_2 side chain', xz),
  j('bone_15', 'Chest feather B mid-2', 'Spine_2 side chain', xz),
  j('bone_16', 'Chest feather B tip', 'Spine_2 side chain', xz),
  j('bone_17', 'Chest feather B side', 'Spine_2 side chain', xz),

  j('bone_18', 'Spine accessory 0', 'Under Spine_0', xz),
  j('bone_19', 'Spine accessory 1', 'Under Spine_0', xz),
  j('bone_20', 'Spine accessory 2', 'Under Spine_0', xz),
  j('bone_21', 'Spine accessory 3', 'Under Spine_0', xz),
  j('bone_22', 'Spine accessory 4', 'Under Spine_0', xz),
  j('bone_23', 'Spine accessory 5', 'Under Spine_0', xz),
  j('bone_24', 'Spine accessory 6', 'Under Spine_0', xz),

  j('tripo::0_Right_Limb_0', 'Right wing 0', 'Right wing root'),
  j('tripo::0_Right_Limb_1', 'Right wing 1', 'Right wing upper'),
  j('tripo::0_Right_Limb_2', 'Right wing 2', 'Right wing mid'),
  j('tripo::0_Right_Limb_3', 'Right wing 3', 'Right wing outer'),
  j('tripo::0_Right_Limb_4', 'Right wing 4', 'Right wing tip chain'),
  j('tripo::0_Right_Limb_5', 'Right wing 5', 'Right wing tip mid'),
  j('tripo::0_Right_Limb_6', 'Right wing 6', 'Right wing tip'),
  j('bone_36', 'Right wing feather A', 'Right wing secondary', xz),
  j('bone_37', 'Right wing feather A mid', 'Right wing secondary', xz),
  j('bone_38', 'Right wing feather A tip', 'Right wing secondary', xz),
  j('bone_42', 'Right wing feather B', 'Right wing secondary', xz),
  j('bone_43', 'Right wing feather B tip', 'Right wing secondary', xz),
  j('bone_44', 'Right wing feather C', 'Right wing secondary', xz),
  j('bone_45', 'Right wing feather C mid', 'Right wing secondary', xz),
  j('bone_46', 'Right wing feather C tip', 'Right wing secondary', xz),

  j('tripo::0_Left_Limb_0', 'Left wing 0', 'Left wing root'),
  j('tripo::0_Left_Limb_1', 'Left wing 1', 'Left wing upper'),
  j('tripo::0_Left_Limb_2', 'Left wing 2', 'Left wing mid'),
  j('tripo::0_Left_Limb_3', 'Left wing 3', 'Left wing outer'),
  j('tripo::0_Left_Limb_4', 'Left wing 4', 'Left wing tip chain'),
  j('tripo::0_Left_Limb_5', 'Left wing 5', 'Left wing tip mid'),
  j('tripo::0_Left_Limb_6', 'Left wing 6', 'Left wing tip'),
  j('bone_51', 'Left wing feather A', 'Left wing secondary', xz),
  j('bone_52', 'Left wing feather A tip', 'Left wing secondary', xz),
  j('bone_56', 'Left wing feather B', 'Left wing secondary', xz),
  j('bone_57', 'Left wing feather B mid', 'Left wing secondary', xz),
  j('bone_58', 'Left wing feather B tip', 'Left wing secondary', xz),
  j('bone_59', 'Left wing feather C', 'Left wing secondary', xz),

  j('bone_25', 'Leg cluster root', 'Hind-limb cluster under Root'),
  j('bone_26', 'Leg chain A', 'Hind-limb chain A'),
  j('bone_27', 'Leg chain A tip', 'Hind-limb chain A', xz),
  j('bone_28', 'Leg chain B', 'Hind-limb chain B'),
  j('bone_29', 'Leg chain B tip', 'Hind-limb chain B', xz),
  j('bone_30', 'Leg chain C', 'Hind-limb chain C'),
  j('bone_31', 'Leg chain C tip', 'Hind-limb chain C', xz),

  j('bone_60', 'Root extra A', 'Extra under Root', xz),
  j('bone_61', 'Root extra B', 'Extra under Root', xz),
  j('bone_62', 'Tail root cluster', 'Parent of tail chains'),
  j('tripo::Tail_0', 'Tail 0', 'Primary tail bone'),
  j('bone_64', 'Tail feather A', 'Tail secondary', xz),
  j('bone_65', 'Tail feather A tip', 'Tail secondary', xz),
  j('bone_66', 'Tail feather B', 'Tail secondary', xz),
  j('bone_67', 'Tail feather B tip', 'Tail secondary', xz),
  j('bone_68', 'Tail feather C', 'Tail secondary', xz),
  j('bone_69', 'Tail feather C tip', 'Tail secondary', xz),
]

export const TRIPO_AVIAN_BY_ID = Object.fromEntries(
  TRIPO_AVIAN_PARTS.map((p) => [p.id, p])
) as Record<string, TripoAvianPart>

export type TripoAvianGroup = {
  id: string
  label: string
  partIds: string[]
}

export const TRIPO_AVIAN_GROUPS: TripoAvianGroup[] = [
  {
    id: 'spine',
    label: 'Root / spine',
    partIds: [
      'tripo::Root',
      'tripo::Spine_0',
      'tripo::Spine_1',
      'tripo::Spine_2',
    ],
  },
  {
    id: 'head',
    label: 'Head / neck',
    partIds: [
      'tripo::Head_0',
      'tripo::Head_1',
      'tripo::Head_2',
      'bone_4',
      'bone_6',
    ],
  },
  {
    id: 'wingR',
    label: 'Right wing',
    partIds: [
      'tripo::0_Right_Limb_0',
      'tripo::0_Right_Limb_1',
      'tripo::0_Right_Limb_2',
      'tripo::0_Right_Limb_3',
      'tripo::0_Right_Limb_4',
      'tripo::0_Right_Limb_5',
      'tripo::0_Right_Limb_6',
      'bone_36',
      'bone_37',
      'bone_38',
      'bone_42',
      'bone_43',
      'bone_44',
      'bone_45',
      'bone_46',
    ],
  },
  {
    id: 'wingL',
    label: 'Left wing',
    partIds: [
      'tripo::0_Left_Limb_0',
      'tripo::0_Left_Limb_1',
      'tripo::0_Left_Limb_2',
      'tripo::0_Left_Limb_3',
      'tripo::0_Left_Limb_4',
      'tripo::0_Left_Limb_5',
      'tripo::0_Left_Limb_6',
      'bone_51',
      'bone_52',
      'bone_56',
      'bone_57',
      'bone_58',
      'bone_59',
    ],
  },
  {
    id: 'legs',
    label: 'Legs / hind cluster',
    partIds: [
      'bone_25',
      'bone_26',
      'bone_27',
      'bone_28',
      'bone_29',
      'bone_30',
      'bone_31',
    ],
  },
  {
    id: 'chestFeathers',
    label: 'Chest / spine feathers',
    partIds: [
      'bone_9',
      'bone_10',
      'bone_11',
      'bone_12',
      'bone_13',
      'bone_14',
      'bone_15',
      'bone_16',
      'bone_17',
      'bone_18',
      'bone_19',
      'bone_20',
      'bone_21',
      'bone_22',
      'bone_23',
      'bone_24',
    ],
  },
  {
    id: 'tail',
    label: 'Tail',
    partIds: [
      'bone_60',
      'bone_61',
      'bone_62',
      'tripo::Tail_0',
      'bone_64',
      'bone_65',
      'bone_66',
      'bone_67',
      'bone_68',
      'bone_69',
    ],
  },
]

export const TRIPO_AVIAN_FOCUS_WINGS = [
  'tripo::0_Left_Limb_0',
  'tripo::0_Left_Limb_3',
  'tripo::0_Left_Limb_6',
  'tripo::0_Right_Limb_0',
  'tripo::0_Right_Limb_3',
  'tripo::0_Right_Limb_6',
] as const
