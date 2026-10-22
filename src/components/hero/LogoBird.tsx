'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Center,
  Environment,
  OrbitControls,
  TransformControls,
  useGLTF,
} from '@react-three/drei'
import * as THREE from 'three'
import {
  BIRD_ASSETS,
  BIRD_PART_BY_ID,
  BIRD_PART_BY_SOURCE,
  BIRD_PART_GROUPS,
  BIRD_PARTS,
  type BirdPartId,
} from '@/components/hero/birdRig'
import {
  TRIPO_AVIAN_BY_ID,
  TRIPO_AVIAN_GROUPS,
  TRIPO_AVIAN_PARTS,
} from '@/components/hero/birdTripoAvianRig'
import {
  applyPoseToBones,
  applyTrainPoseToBones,
  applyWorldWingMotion,
  computeGroundPose,
  createGroundAnimState,
  behaviorLabel,
  tickGroundAnimState,
  type GroundAnimState,
  type GroundBehavior,
} from '@/components/hero/birdGroundAnim'
import {
  BIRD_TRAIN_VERSIONS,
  FOCUS_HINT,
  FOCUS_JOINTS,
  TRIPO_FOCUS_HINT,
  TRIPO_FOCUS_JOINTS,
  isTripoWingJoint,
  isWingJoint,
  versionJointCatalog,
  type BirdJointCatalog,
  type BirdTrainVersion,
} from '@/components/hero/birdTrainVersions'
import BirdVersionPicker from '@/components/hero/BirdVersionPicker'
import {
  clearVersionPose,
  degToRad,
  loadVersionPose,
  radToDeg,
  saveVersionPose,
  setJointEuler,
  type PoseEuler,
  type VersionPose,
} from '@/components/hero/birdPoseStore'

function renameBirdParts(scene: THREE.Object3D) {
  scene.traverse((obj) => {
    // V2 modular bird already uses semantic BirdPartId bone names
    if (obj.name in BIRD_PART_BY_ID) return

    const part = BIRD_PART_BY_SOURCE[obj.name]
    if (part) {
      obj.name = part.id
      return
    }
    if (
      obj.name === BIRD_ASSETS.armature.source ||
      obj.name === BIRD_ASSETS.armature.id
    ) {
      obj.name = BIRD_ASSETS.armature.id
    }
    if (obj.name === BIRD_ASSETS.mesh.source) obj.name = BIRD_ASSETS.mesh.id
  })
}

function poseBookToEulers(book: VersionPose): Partial<Record<string, THREE.Euler>> {
  const out: Partial<Record<string, THREE.Euler>> = {}
  for (const id of Object.keys(book)) {
    const e = book[id]
    if (e) out[id] = new THREE.Euler(e.x, e.y, e.z, 'XYZ')
  }
  return out
}

function BoneHighlight({
  bones,
  selectedId,
}: {
  bones: Partial<Record<string, THREE.Bone>>
  selectedId: string | null
}) {
  const markerRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const parentPos = useMemo(() => new THREE.Vector3(), [])
  const lineObj = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(6), 3)
    )
    const material = new THREE.LineBasicMaterial({ color: '#ff4d4f' })
    const line = new THREE.Line(geometry, material)
    line.visible = false
    return line
  }, [])

  useFrame(({ clock }) => {
    const bone = selectedId ? bones[selectedId] : null
    const visible = Boolean(bone)
    const pulse = 1 + Math.sin(clock.elapsedTime * 5) * 0.12

    if (markerRef.current) markerRef.current.visible = visible
    if (ringRef.current) ringRef.current.visible = visible
    lineObj.visible = false
    if (!bone) return

    bone.getWorldPosition(worldPos)

    if (markerRef.current) {
      markerRef.current.position.copy(worldPos)
      markerRef.current.scale.setScalar(pulse)
    }
    if (ringRef.current) {
      ringRef.current.position.copy(worldPos)
      ringRef.current.scale.setScalar(pulse)
      ringRef.current.lookAt(worldPos.x, worldPos.y + 1, worldPos.z + 0.01)
    }

    const parent =
      bone.parent && (bone.parent as THREE.Bone).isBone
        ? (bone.parent as THREE.Bone)
        : null
    if (parent) {
      parent.getWorldPosition(parentPos)
      const arr = lineObj.geometry.attributes.position.array as Float32Array
      arr[0] = parentPos.x
      arr[1] = parentPos.y
      arr[2] = parentPos.z
      arr[3] = worldPos.x
      arr[4] = worldPos.y
      arr[5] = worldPos.z
      lineObj.geometry.attributes.position.needsUpdate = true
      lineObj.visible = true
    }
  })

  return (
    <group>
      <mesh ref={markerRef} visible={false}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshBasicMaterial color="#ff4d4f" depthTest={false} />
      </mesh>
      <mesh ref={ringRef} visible={false}>
        <ringGeometry args={[0.055, 0.075, 32]} />
        <meshBasicMaterial
          color="#ffd0a8"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
          depthTest={false}
        />
      </mesh>
      <primitive object={lineObj} />
    </group>
  )
}

function BoneDots({
  bones,
  selectedId,
  onSelect,
  showAll,
  suggested,
}: {
  bones: Partial<Record<string, THREE.Bone>>
  selectedId: string | null
  onSelect: (id: string) => void
  showAll: boolean
  suggested: Set<string>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const ids = useMemo(() => Object.keys(bones), [bones])
  const temp = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const group = groupRef.current
    if (!group) return
    ids.forEach((id, index) => {
      const bone = bones[id]
      const marker = group.children[index] as THREE.Mesh | undefined
      if (!bone || !marker) return
      bone.getWorldPosition(temp)
      marker.position.copy(temp)
      marker.visible = showAll
      const isSel = id === selectedId
      const isSug = suggested.has(id)
      marker.scale.setScalar(isSel ? 1.35 : isSug ? 1.15 : 1)
      const mat = marker.material as THREE.MeshBasicMaterial
      mat.opacity = isSel ? 0.95 : isSug ? 0.55 : 0.28
      mat.color.set(isSel ? '#ff4d4f' : isSug ? '#ffd6aa' : '#9db7ff')
    })
  })

  if (!showAll) return null

  return (
    <group ref={groupRef}>
      {ids.map((id) => (
        <mesh
          key={id}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(id)
          }}
        >
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial
            color="#9db7ff"
            transparent
            opacity={0.3}
            depthTest={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function BoneRotateGizmo({
  bone,
  restQ,
  onEulerChange,
  enabled,
}: {
  bone: THREE.Bone | undefined
  restQ: THREE.Quaternion | undefined
  onEulerChange: (e: PoseEuler) => void
  enabled: boolean
}) {
  const proxy = useMemo(() => new THREE.Object3D(), [])
  const dragging = useRef(false)
  const { controls } = useThree() as {
    controls: { enabled: boolean } | null
  }

  const parentWQ = useMemo(() => new THREE.Quaternion(), [])
  const localQ = useMemo(() => new THREE.Quaternion(), [])
  const deltaQ = useMemo(() => new THREE.Quaternion(), [])
  const outEuler = useMemo(() => new THREE.Euler(0, 0, 0, 'XYZ'), [])
  const worldPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!bone || !enabled) return
    bone.updateWorldMatrix(true, false)
    bone.getWorldPosition(worldPos)
    proxy.position.copy(worldPos)
    if (!dragging.current) {
      bone.getWorldQuaternion(proxy.quaternion)
    }
  })

  if (!enabled || !bone || !restQ) return null

  return (
    <TransformControls
      object={proxy}
      mode="rotate"
      size={0.55}
      space="local"
      onMouseDown={() => {
        dragging.current = true
        if (controls) controls.enabled = false
      }}
      onMouseUp={() => {
        dragging.current = false
        if (controls) controls.enabled = true
      }}
      onObjectChange={() => {
        if (!bone.parent || !restQ) return
        bone.parent.getWorldQuaternion(parentWQ)
        localQ.copy(parentWQ).invert().multiply(proxy.quaternion)
        deltaQ.copy(restQ).invert().multiply(localQ)
        outEuler.setFromQuaternion(deltaQ, 'XYZ')
        onEulerChange({ x: outEuler.x, y: outEuler.y, z: outEuler.z })
      }}
    />
  )
}

const _lookRight = new THREE.Vector3()
const _lookUp = new THREE.Vector3(0, 1, 0)
const _qYaw = new THREE.Quaternion()
const _qPitch = new THREE.Quaternion()
const _worldDelta = new THREE.Quaternion()
const _parentQ = new THREE.Quaternion()
const _parentInv = new THREE.Quaternion()
const _localDelta = new THREE.Quaternion()

/** Head leads; the neck takes a smaller share of the same glance. */
const POINTER_LOOK_CHAIN: { id: BirdPartId; weight: number }[] = [
  { id: 'neckBase', weight: 0.18 },
  { id: 'neckTop', weight: 0.35 },
  { id: 'head', weight: 0.72 },
]

function pointerLookInfluence(behavior: GroundBehavior | undefined): number {
  if (behavior === 'feed' || behavior === 'groom') return 0.28
  if (behavior === 'look') return 0.55
  return 1
}

/** Glance in camera space, added after the idle pose. */
function applyCameraLookOffset(
  bones: Partial<Record<string, THREE.Bone>>,
  camera: THREE.Camera,
  yaw: number,
  pitch: number
) {
  if (Math.abs(yaw) < 1e-4 && Math.abs(pitch) < 1e-4) return
  _lookRight.setFromMatrixColumn(camera.matrixWorld, 0).normalize()

  for (const { id, weight } of POINTER_LOOK_CHAIN) {
    const bone = bones[id]
    if (!bone?.parent) continue
    _qYaw.setFromAxisAngle(_lookUp, yaw * weight)
    _qPitch.setFromAxisAngle(_lookRight, pitch * weight)
    _worldDelta.copy(_qYaw).multiply(_qPitch)
    bone.parent.updateWorldMatrix(true, false)
    bone.parent.getWorldQuaternion(_parentQ)
    _parentInv.copy(_parentQ).invert()
    _localDelta.copy(_parentInv).multiply(_worldDelta).multiply(_parentQ)
    bone.quaternion.premultiply(_localDelta)
  }
}

function BirdModel({
  modelUrl,
  selectedId,
  onSelect,
  onBehaviorChange,
  trainMode,
  poseBook,
  suggested,
  onJointChange,
  jointCatalog,
  followPointer,
}: {
  modelUrl: string
  selectedId: string | null
  onSelect: (id: string) => void
  onBehaviorChange: (label: string) => void
  trainMode: boolean
  poseBook: VersionPose
  suggested: Set<string>
  onJointChange: (id: string, euler: PoseEuler) => void
  jointCatalog: BirdJointCatalog
  followPointer: boolean
}) {
  const { scene } = useGLTF(modelUrl)
  const rootRef = useRef<THREE.Group>(null)
  const bonesRef = useRef<Partial<Record<string, THREE.Bone>>>({})
  const [bones, setBones] = useState<Partial<Record<string, THREE.Bone>>>({})
  const [restQuats, setRestQuats] = useState<
    Partial<Record<string, THREE.Quaternion>>
  >({})
  const restQuatsRef = useRef<Partial<Record<string, THREE.Quaternion>>>({})
  const animState = useRef<GroundAnimState | null>(null)
  const autoPoseRef = useRef<Partial<Record<BirdPartId, THREE.Euler>>>({})
  const trainPoseRef = useRef<Partial<Record<string, THREE.Euler>>>({})
  const onBehaviorChangeRef = useRef(onBehaviorChange)
  onBehaviorChangeRef.current = onBehaviorChange
  const trainModeRef = useRef(trainMode)
  trainModeRef.current = trainMode
  const catalogRef = useRef(jointCatalog)
  catalogRef.current = jointCatalog
  const followPointerRef = useRef(followPointer)
  followPointerRef.current = followPointer
  const pointerOver = useRef(false)
  const lookYaw = useRef(0)
  const lookPitch = useRef(0)
  const gl = useThree((s) => s.gl)

  useEffect(() => {
    if (!followPointer) {
      lookYaw.current = 0
      lookPitch.current = 0
      pointerOver.current = false
    }
  }, [followPointer])

  useEffect(() => {
    const el = gl.domElement
    const markOver = () => {
      pointerOver.current = true
    }
    const markOut = () => {
      pointerOver.current = false
    }
    el.addEventListener('pointerenter', markOver)
    el.addEventListener('pointermove', markOver)
    el.addEventListener('pointerleave', markOut)
    return () => {
      el.removeEventListener('pointerenter', markOver)
      el.removeEventListener('pointermove', markOver)
      el.removeEventListener('pointerleave', markOut)
    }
  }, [gl])

  useEffect(() => {
    trainPoseRef.current = poseBookToEulers(poseBook)
  }, [poseBook])

  useEffect(() => {
    if (jointCatalog === 'meshy') renameBirdParts(scene)

    const next: Partial<Record<string, THREE.Bone>> = {}
    const rests: Partial<Record<string, THREE.Quaternion>> = {}
    scene.traverse((obj) => {
      if ((obj as THREE.Bone).isBone) {
        const bone = obj as THREE.Bone
        next[bone.name] = bone
        rests[bone.name] = bone.quaternion.clone()
      }
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        if (mesh.material) {
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material]
          mats.forEach((mat) => {
            // Modular parts + pocket fill can wind either way after glTF;
            // DoubleSide avoids invisible flank caps / feather sheets.
            mat.side = THREE.DoubleSide
          })
        }
      }
    })

    restQuatsRef.current = rests
    bonesRef.current = next
    setBones(next)
    setRestQuats(rests)
  }, [scene, jointCatalog])

  useFrame(({ clock, pointer, camera }, delta) => {
    const now = clock.elapsedTime
    const root = rootRef.current

    if (trainModeRef.current) {
      applyTrainPoseToBones(
        bonesRef.current,
        restQuatsRef.current,
        trainPoseRef.current
      )
      if (root) {
        root.position.y = 0
        root.rotation.set(0, 0, 0)
      }
      return
    }

    // Auto ground loop only for Meshy-mapped skeletons (V1).
    if (catalogRef.current !== 'meshy') {
      if (root) {
        root.position.y = 0
        root.rotation.set(0, 0, 0)
      }
      return
    }

    if (!animState.current) {
      animState.current = createGroundAnimState(now)
      onBehaviorChangeRef.current(behaviorLabel(animState.current))
    }

    const prevLabel = behaviorLabel(animState.current)
    animState.current = tickGroundAnimState(animState.current, now)
    const nextLabel = behaviorLabel(animState.current)
    if (nextLabel !== prevLabel) {
      onBehaviorChangeRef.current(nextLabel)
    }

    const breathPhase = now * 2.4
    const { rootY, rootYaw, rootPitch, wingOpen, wingBeat, wingBias } =
      computeGroundPose(animState.current, now, breathPhase, autoPoseRef.current)

    applyPoseToBones(
      bonesRef.current as Partial<Record<BirdPartId, THREE.Bone>>,
      restQuatsRef.current as Partial<Record<BirdPartId, THREE.Quaternion>>,
      autoPoseRef.current
    )
    applyWorldWingMotion(
      bonesRef.current as Partial<Record<BirdPartId, THREE.Bone>>,
      restQuatsRef.current as Partial<Record<BirdPartId, THREE.Quaternion>>,
      wingOpen,
      wingBeat,
      wingBias
    )

    if (root) {
      root.position.y = rootY
      root.rotation.x = rootPitch
      root.rotation.y = rootYaw
      root.rotation.z = 0.015 * Math.sin(breathPhase * 0.6)
    }

    if (!followPointerRef.current) return

    const influence = pointerOver.current
      ? pointerLookInfluence(animState.current?.behavior)
      : 0
    const targetYaw = pointerOver.current
      ? THREE.MathUtils.clamp(-pointer.x, -1, 1) * 0.95 * influence
      : 0
    const targetPitch = pointerOver.current
      ? THREE.MathUtils.clamp(-pointer.y, -1, 1) * 0.72 * influence
      : 0
    lookYaw.current = THREE.MathUtils.damp(lookYaw.current, targetYaw, 5, delta)
    lookPitch.current = THREE.MathUtils.damp(
      lookPitch.current,
      targetPitch,
      5,
      delta
    )
    applyCameraLookOffset(
      bonesRef.current,
      camera,
      lookYaw.current,
      lookPitch.current
    )
  })

  return (
    <group ref={rootRef} name="BirdSceneRoot">
      <Center>
        <primitive object={scene} scale={1} />
      </Center>
      <BoneDots
        bones={bones}
        selectedId={selectedId}
        onSelect={onSelect}
        showAll={trainMode && jointCatalog !== 'none'}
        suggested={suggested}
      />
      <BoneHighlight bones={bones} selectedId={selectedId} />
      {trainMode && jointCatalog !== 'none' && selectedId ? (
        <BoneRotateGizmo
          bone={bones[selectedId]}
          restQ={restQuats[selectedId]}
          enabled
          onEulerChange={(e) => onJointChange(selectedId, e)}
        />
      ) : null}
    </group>
  )
}

useGLTF.preload('/bird.glb')
useGLTF.preload('/bird-v2.glb')
useGLTF.preload('/bird-v3.glb?v=pocket-inflate-31')
useGLTF.preload('/bird-v5.glb')
useGLTF.preload('/bird-v6.glb')
useGLTF.preload('/bird-v7.glb')
useGLTF.preload('/bird-v8.glb')

function BirdFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.35, 24, 24]} />
      <meshStandardMaterial color="#c45c4a" roughness={0.55} metalness={0.1} />
    </mesh>
  )
}

function AxisSlider({
  label,
  valueDeg,
  onChangeDeg,
  accent,
}: {
  label: string
  valueDeg: number
  onChangeDeg: (v: number) => void
  accent?: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-white/60">
      <span
        className={`w-4 shrink-0 font-medium ${
          accent ? 'text-[#ffd6aa]' : 'text-white/45'
        }`}
      >
        {label}
      </span>
      <input
        type="range"
        min={-90}
        max={90}
        step={0.5}
        value={valueDeg}
        onChange={(e) => onChangeDeg(Number(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer accent-[#e31e24]"
      />
      <span className="w-10 shrink-0 text-right tabular-nums text-white/50">
        {valueDeg.toFixed(0)}°
      </span>
    </label>
  )
}

function PartsList({
  selectedId,
  onSelect,
  onClear,
  trainMode,
  suggested,
  poseBook,
  onJointChange,
  onResetJoint,
  onResetAll,
  jointCatalog,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
  onClear: () => void
  trainMode: boolean
  suggested: Set<string>
  poseBook: VersionPose
  onJointChange: (id: string, euler: PoseEuler) => void
  onResetJoint: () => void
  onResetAll: () => void
  jointCatalog: BirdJointCatalog
}) {
  const meshyPart =
    jointCatalog === 'meshy' && selectedId
      ? BIRD_PART_BY_ID[selectedId as BirdPartId]
      : null
  const tripoPart =
    jointCatalog === 'tripo-avian' && selectedId
      ? TRIPO_AVIAN_BY_ID[selectedId]
      : null
  const part =
    meshyPart ??
    tripoPart ??
    (selectedId
      ? {
          id: selectedId,
          label: selectedId,
          role: 'Bone',
          primaryAxes: ['x', 'y', 'z'] as Array<'x' | 'y' | 'z'>,
        }
      : null)
  const euler = selectedId
    ? poseBook[selectedId] ?? { x: 0, y: 0, z: 0 }
    : { x: 0, y: 0, z: 0 }
  const wingHint =
    selectedId &&
    ((jointCatalog === 'meshy' && isWingJoint(selectedId as BirdPartId)) ||
      (jointCatalog === 'tripo-avian' && isTripoWingJoint(selectedId)))

  const groups =
    jointCatalog === 'tripo-avian'
      ? TRIPO_AVIAN_GROUPS.map((g) => ({
          id: g.id,
          label: g.label,
          parts: g.partIds
            .map((id) => TRIPO_AVIAN_BY_ID[id])
            .filter(Boolean),
        }))
      : jointCatalog === 'meshy'
        ? BIRD_PART_GROUPS.map((g) => ({
            id: g.id,
            label: g.label,
            parts: g.partIds.map((id) => BIRD_PART_BY_ID[id]),
          }))
        : []

  const jointCount =
    jointCatalog === 'tripo-avian'
      ? TRIPO_AVIAN_PARTS.length
      : jointCatalog === 'meshy'
        ? BIRD_PARTS.length
        : 0

  return (
    <aside className="flex h-[min(70vh,560px)] w-full shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-black/35 backdrop-blur-sm md:w-80">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-medium text-white">
          {jointCatalog === 'none'
            ? 'No joint map'
            : trainMode
              ? 'Teach joints'
              : 'Bird parts'}
        </p>
        <p className="mt-0.5 text-xs text-white/45">
          {jointCatalog === 'none'
            ? 'This version has no matching teach skeleton — use Version 8 for Tripo avian joints'
            : trainMode
              ? 'Select a joint, then drag the gizmo or use sliders'
              : 'Auto demo — switch version ★ to teach a movement'}
        </p>
      </div>

      {jointCatalog === 'none' ? (
        <div className="flex flex-1 items-center justify-center px-6 text-center text-xs leading-relaxed text-white/40">
          Mesh preview only. Joint list removed for this version.
        </div>
      ) : (
        <>
          {trainMode ? (
            <div className="space-y-2 border-b border-white/10 px-4 py-3">
              {selectedId && part ? (
                <>
                  <p className="text-xs text-white/80">{part.label}</p>
                  {wingHint ? (
                    <p className="text-[10px] leading-snug text-white/40">
                      Wing chain. Drag the gizmo or use X / Y / Z.
                    </p>
                  ) : null}
                  <AxisSlider
                    label="X"
                    valueDeg={radToDeg(euler.x)}
                    accent={part.primaryAxes.includes('x')}
                    onChangeDeg={(d) =>
                      onJointChange(selectedId, { ...euler, x: degToRad(d) })
                    }
                  />
                  <AxisSlider
                    label="Y"
                    valueDeg={radToDeg(euler.y)}
                    accent={part.primaryAxes.includes('y')}
                    onChangeDeg={(d) =>
                      onJointChange(selectedId, { ...euler, y: degToRad(d) })
                    }
                  />
                  <AxisSlider
                    label="Z"
                    valueDeg={radToDeg(euler.z)}
                    accent={part.primaryAxes.includes('z')}
                    onChangeDeg={(d) =>
                      onJointChange(selectedId, { ...euler, z: degToRad(d) })
                    }
                  />
                </>
              ) : (
                <p className="text-[11px] text-white/40">
                  Select a joint to edit, or reset the whole pose.
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onResetJoint}
                  disabled={!selectedId}
                  className="rounded-md border border-white/12 px-2 py-1 text-[11px] text-white/60 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Reset joint
                </button>
                <button
                  type="button"
                  onClick={onResetAll}
                  className="rounded-md border border-white/12 px-2 py-1 text-[11px] text-white/60 hover:bg-white/5 hover:text-white"
                >
                  Reset pose
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex-1 overflow-y-auto px-2 py-2">
            {groups.map((group) => (
              <div key={group.id} className="mb-3">
                <p className="px-2 pb-1 text-[11px] uppercase tracking-[0.14em] text-white/35">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.parts.map((p) => {
                    const active = selectedId === p.id
                    const sug = suggested.has(p.id)
                    const posed = Boolean(poseBook[p.id])
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(p.id)}
                          className={`flex w-full items-start justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left transition ${
                            active
                              ? 'bg-[#e31e24]/20 text-white ring-1 ring-[#e31e24]/50'
                              : sug
                                ? 'bg-[#ffd6aa]/10 text-white/90'
                                : 'text-white/75 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>
                            <span className="block text-sm leading-tight">
                              {p.label}
                              {posed ? (
                                <span className="ml-1 text-[10px] text-[#ffd6aa]">
                                  ●
                                </span>
                              ) : null}
                            </span>
                            <span className="block break-all text-[10px] text-white/40">
                              {p.id}
                            </span>
                          </span>
                          <span className="mt-0.5 shrink-0 text-[10px] uppercase tracking-wide text-white/35">
                            {p.primaryAxes.join('')}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
          {selectedId && part ? (
            <div className="border-t border-white/10 px-4 py-3 text-xs text-white/55">
              <span className="text-white/85">{part.label}</span>
              {' — '}
              {part.role}
              <button
                type="button"
                className="mt-1 block text-[11px] text-white/40 hover:text-white/70"
                onClick={onClear}
              >
                Clear selection
              </button>
            </div>
          ) : (
            <div className="border-t border-white/10 px-4 py-3 text-xs text-white/40">
              {jointCount} joints mapped
            </div>
          )}
        </>
      )}
    </aside>
  )
}

export default function LogoBird({
  variant = 'studio',
}: {
  variant?: 'studio' | 'mascot'
}) {
  const mascot = variant === 'mascot'
  const [ready, setReady] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [behavior, setBehavior] = useState('Breathing')
  const [version, setVersion] = useState<BirdTrainVersion>(BIRD_TRAIN_VERSIONS[0])
  const [poseBook, setPoseBook] = useState<VersionPose>({})
  const poseBookRef = useRef<VersionPose>({})
  const activeVersion = mascot ? BIRD_TRAIN_VERSIONS[0] : version

  const trainMode = activeVersion.mode === 'train'
  const jointCatalog = versionJointCatalog(activeVersion)
  const suggested = useMemo(() => {
    if (!activeVersion.focus || jointCatalog === 'none') return new Set<string>()
    if (jointCatalog === 'tripo-avian') {
      return new Set(TRIPO_FOCUS_JOINTS[activeVersion.focus])
    }
    return new Set(FOCUS_JOINTS[activeVersion.focus])
  }, [activeVersion.focus, jointCatalog])

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    const loaded = loadVersionPose(activeVersion.id, activeVersion.poseResetToken)
    poseBookRef.current = loaded
    setPoseBook(loaded)
    setSelectedId(null)
    const catalog = versionJointCatalog(activeVersion)
    if (activeVersion.mode === 'train') {
      setBehavior(activeVersion.blurb)
      if (catalog === 'none' || !activeVersion.focus) return
      const first =
        catalog === 'tripo-avian'
          ? TRIPO_FOCUS_JOINTS[activeVersion.focus][0]
          : FOCUS_JOINTS[activeVersion.focus][0]
      if (first) setSelectedId(first)
    }
  }, [activeVersion])

  const persistPose = (next: VersionPose) => {
    poseBookRef.current = next
    setPoseBook(next)
    saveVersionPose(activeVersion.id, next, activeVersion.poseResetToken)
  }

  const onJointChange = (id: string, euler: PoseEuler) => {
    persistPose(setJointEuler(poseBookRef.current, id, euler))
  }

  if (!ready) {
    return (
      <div
        className={
          mascot
            ? 'h-[min(58vh,480px)] w-full'
            : 'flex w-full max-w-6xl flex-col gap-4 md:flex-row'
        }
        aria-hidden
      >
        <div className="h-[min(70vh,560px)] w-full min-w-0 flex-1" />
        {mascot ? null : <div className="h-[min(70vh,560px)] w-full shrink-0 md:w-80" />}
      </div>
    )
  }

  return (
    <div
      className={
        mascot
          ? 'w-full'
          : 'flex w-full max-w-6xl flex-col items-stretch gap-4 md:flex-row'
      }
    >
      <div
        className={
          mascot
            ? 'relative mx-auto h-[min(58vh,480px)] w-full max-w-xl'
            : 'relative h-[min(70vh,560px)] min-w-0 flex-1'
        }
      >
        {mascot ? null : (
          <BirdVersionPicker
            version={activeVersion}
            onChange={(v) => {
              setVersion(v)
            }}
          />
        )}
        <Canvas
          camera={{ position: [0, 0.55, 3.6], fov: 38, near: 0.01, far: 200 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, logarithmicDepthBuffer: true }}
          style={{ background: 'transparent' }}
          onPointerMissed={() => {
            if (!trainMode) setSelectedId(null)
          }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[3.5, 5, 2.5]}
            intensity={1.35}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#9db7ff" />
          <spotLight
            position={[0, 4, 1]}
            angle={0.55}
            penumbra={0.7}
            intensity={0.65}
            color="#ffd6aa"
          />
          <Suspense fallback={<BirdFallback />}>
            <BirdModel
              key={activeVersion.modelUrl}
              modelUrl={activeVersion.modelUrl}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onBehaviorChange={setBehavior}
              trainMode={trainMode}
              poseBook={poseBook}
              suggested={suggested}
              onJointChange={onJointChange}
              jointCatalog={jointCatalog}
              followPointer={activeVersion.id === 1 && !trainMode}
            />
            <Environment preset="city" environmentIntensity={0.35} background={false} />
          </Suspense>
          {mascot ? null : (
            <OrbitControls
              makeDefault
              enablePan
              minDistance={0.6}
              maxDistance={10}
              maxPolarAngle={Math.PI * 0.92}
              target={[0, 0.55, 0]}
              zoomSpeed={0.85}
              mouseButtons={{
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.PAN,
                RIGHT: THREE.MOUSE.PAN,
              }}
            />
          )}
        </Canvas>
        {mascot ? null : (
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex flex-col items-center gap-1 px-3 text-center">
            <p className="rounded-full bg-black/45 px-3 py-1 text-[11px] tracking-wide text-white/80 ring-1 ring-white/10">
              {activeVersion.label}: {behavior}
            </p>
            {trainMode && jointCatalog === 'tripo-avian' ? (
              <p className="max-w-md text-[11px] text-white/45">{TRIPO_FOCUS_HINT}</p>
            ) : trainMode && activeVersion.focus && jointCatalog === 'meshy' ? (
              <p className="max-w-md text-[11px] text-white/45">
                {FOCUS_HINT[activeVersion.focus]}
              </p>
            ) : (
              <p className="text-[11px] text-white/35">
                Drag to orbit · scroll to zoom · ★ pick a teach version
              </p>
            )}
          </div>
        )}
      </div>

      {mascot ? null : (
        <PartsList
          selectedId={selectedId}
          onSelect={setSelectedId}
          onClear={() => setSelectedId(null)}
          trainMode={trainMode}
          suggested={suggested}
          poseBook={poseBook}
          onJointChange={onJointChange}
          jointCatalog={jointCatalog}
          onResetJoint={() => {
            if (!selectedId) return
            const next = { ...poseBookRef.current }
            delete next[selectedId]
            persistPose(next)
          }}
          onResetAll={() => {
            clearVersionPose(activeVersion.id, activeVersion.poseResetToken)
            persistPose({})
          }}
        />
      )}
    </div>
  )
}
