<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls, GLTFLoader } from 'three-stdlib'
import { useDevices } from '@/store/devices'

const wrap = ref<HTMLDivElement|null>(null)
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls, raf=0
const dStore = useDevices()

const interactive = new THREE.Group()   // devices clickables
let coverageGroup = new THREE.Group()   // FOV cones

function addGrid(scene: THREE.Scene){
  const grid = new THREE.GridHelper(60, 60, 0x666666, 0x333333)
  // @ts-ignore
  grid.material.opacity = 0.25; grid.material.transparent = true
  scene.add(grid)
}

function makeFovCone(range=18, fov=60, color=0x00a3ff){
  const r = Math.tan(THREE.MathUtils.degToRad(fov/2)) * range
  const geo = new THREE.ConeGeometry(r, range, 48, 1, true)
  geo.translate(0, -range/2, 0)
  const mat = new THREE.MeshBasicMaterial({ color, opacity:.16, transparent:true, depthWrite:false })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = -Math.PI/2
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color:0x1ea0ff })))
  return mesh
}

function addCameras(){
  coverageGroup.clear()
  dStore.cameras.forEach(c=>{
    const g = new THREE.Group(); g.name = c.id
    g.position.set(c.pos[0], c.pos[1], c.pos[2])
    g.rotation.y = THREE.MathUtils.degToRad(c.yaw)
    const head = new THREE.Mesh(new THREE.BoxGeometry(.45,.35,.7), new THREE.MeshStandardMaterial({color:0x3aa6ff}))
    g.add(head)
    interactive.add(g)

    if(dStore.showCoverage){
      const cone = makeFovCone(18, c.fov)
      cone.position.copy(g.position); cone.rotation.y = g.rotation.y
      coverageGroup.add(cone)
    }
  })
}

function addDoors(){
  dStore.doors.forEach(d=>{
    const g = new THREE.Group(); g.name = d.id
    g.position.set(d.pos[0], d.pos[1], d.pos[2])
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1,2,0.2), new THREE.MeshStandardMaterial({color: d.state==='open'? 0x50be87 : 0xffb400}))
    g.add(frame)
    interactive.add(g)
  })
}

function loadGLB(){
  const loader = new GLTFLoader()
  loader.load('/models/site.glb', (gltf)=>{
    const root = gltf.scene
    root.traverse((o:any)=>{ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true } })
    // normalize size & center
    const box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3()).length()
    const center = box.getCenter(new THREE.Vector3())
    root.position.sub(center)
    const k = 30/size
    root.scale.setScalar(k)
    scene.add(root)
  }, undefined, ()=> {
    // si pas de modèle: fallback simple
    const base = new THREE.Mesh(new THREE.BoxGeometry(20,0.6,20), new THREE.MeshStandardMaterial({color:0x1c2530}))
    base.position.y = .3; scene.add(base)
    const block = new THREE.Mesh(new THREE.BoxGeometry(16,6,16), new THREE.MeshStandardMaterial({color:0x2a3545}))
    block.position.y = 3.3; scene.add(block)
  })
}

function setupRaycast(){
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2()
  renderer.domElement.addEventListener('pointerdown',(e)=>{
    const r = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX-r.left)/r.width)*2-1
    mouse.y = -((e.clientY-r.top)/r.height)*2+1
    ray.setFromCamera(mouse, camera)
    const hits = ray.intersectObjects(interactive.children, true)
    if(hits[0]){
      let root: THREE.Object3D | null = hits[0].object
      while(root && !dStore.cameras.find(c=>c.id===root!.name) && !dStore.doors.find(d=>d.id===root!.name)){ root = root.parent }
      if(root){
        dStore.focus(root.name)
        // fly-to target
        const t = new THREE.Vector3()
        root.getWorldPosition(t)
        controls.target.copy(t)
        const dir = new THREE.Vector3(6,4,6)
        camera.position.copy(t.clone().add(dir))
      }
    }
  })
}

onMounted(() => {
  const el = wrap.value!
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0f1115)
  camera = new THREE.PerspectiveCamera(60, el.clientWidth/el.clientHeight, 0.1, 2000)
  camera.position.set(20,14,20)

  renderer = new THREE.WebGLRenderer({ antialias:true })
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  el.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.85); scene.add(hemi)
  const dir  = new THREE.DirectionalLight(0xffffff, 0.9); dir.position.set(8,16,8); scene.add(dir)

  addGrid(scene)
  scene.add(interactive)
  scene.add(coverageGroup)
  loadGLB()
  addCameras()
  addDoors()
  setupRaycast()

  const animate = () => { raf = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera) }
  animate()

  const onResize = () => {
    const {clientWidth:w, clientHeight:h} = el
    camera.aspect = w/h; camera.updateProjectionMatrix()
    renderer.setSize(w,h)
  }
  window.addEventListener('resize', onResize)

  // réagir aux toggles & focus
  watch(()=>dStore.showCoverage, ()=>{ addCameras() })
  watch(()=>dStore.focusedId, (id)=>{
    if(!id) return
    const obj = interactive.children.find(o=>o.name===id)
    if(!obj) return
    const t = new THREE.Vector3(); obj.getWorldPosition(t)
    controls.target.copy(t)
    camera.position.copy(t.clone().add(new THREE.Vector3(6,4,6)))
  })
})

onBeforeUnmount(()=>{
  cancelAnimationFrame(raf)
  renderer?.dispose()
})
</script>

<template>
  <div class="canvasWrap" ref="wrap">
    <div class="hud">
      <button class="btn" @click="useDevices().toggleCoverage()">
        {{ useDevices().showCoverage ? 'Hide' : 'Show' }} Coverage
      </button>
      <button class="btn" @click="()=>{ const c=useDevices(); c.focusedId=null }">Reset Focus</button>
    </div>
  </div>
</template>
