/* ============================================================================
   "Starfield Close" — ported from the standalone spec into this Vite app.

   The scene, geometry, shaders, uniforms, postprocessing chain and motion are
   reproduced verbatim. Only the host differs, and every difference is listed:

   1. MODULE IMPORTS, not an importmap. The spec loads three r0.143.0 from unpkg
      via `three` / `three/addons/`. In a bundled app that would fetch a second
      copy of three at runtime, so it is `npm i three@0.143.0` and
      `three/examples/jsm/...` (the real path `three/addons/` aliases to).
   2. NO 300vh SCROLL HOST. The spec adds one to give a standalone page
      something to scroll. This page already scrolls, so scroll progress is
      measured against one viewport of travel instead — the dive completes as
      the hero leaves the screen.
   3. CANVAS IS SECTION-SIZED, not `position: fixed` fullscreen: it is a hero
      backdrop, so it sizes from its own bounding box.
   4. PIXEL RATIO CAPPED AT 2. The spec passes `window.devicePixelRatio` raw.
      With three composers and two UnrealBloomPasses, a 3x phone would render
      ~2.25x the fragments of a 2x one for no visible gain.
   5. `haloTexture` gets a 1x1 black texture. The spec declares the uniform and
      samples it but never assigns one; sampling an unbound sampler2D is
      undefined behaviour and warns in some drivers. Black contributes nothing,
      so the composite is unchanged.

   Everything else — CONFIG, the 4200-point cloud, both shader pairs, the layer
   masks, the three composers and their bloom parameters — is exactly as given.
   ========================================================================== */

export const CONFIG = {
  bgColor: '#0a0a24',
  flameColor: '#aee9ff',
  flameColor2: '#c79bff',
  flameAmt: 0.2,
  colorA: '#aef6cf',
  colorB: '#5fe6a0',
  colorC: '#eafff2',
  opacity: 2,
  pointSize: 50,
  brightness: 1.85,
  drift: 2.35,
  twinkle: 1,
  spin: 0.03,
  repelRadius: 5,
  repelStrength: 0.35,
  scrollPush: 8,
  scrollDrift: 6,
  scrollSpin: 0.1,
  parallax: 0.6,
}

const LAYERS = { NONE: 0, TORUS_SCENE: 1, BLOOM_SCENE: 2, ENTIRE_SCENE: 3 }

const STAR_VERT = `
uniform float uTime; uniform float uSize; uniform float uDrift; uniform float uDepth; uniform float uTwinkle;
uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
attribute float aScale; attribute float aPhase; attribute float aPalette; attribute float aBright;
varying vec3 vColor; varying float vTwinkle;
void main() {
  vec3 pos = position;
  pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);

  float tw = sin(uTime * 1.6 + aPhase * 6.2831);
  vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.55 + 0.45 * tw);

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

  vec3 toParticle = modelPosition.xyz - uCursor;
  float dist = length(toParticle);
  float falloff = smoothstep(uRepelRadius, 0.0, dist);
  modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
  vColor = base * aBright;
}
`

const STAR_FRAG = `
uniform float uOpacity; uniform float uBrightness;
varying vec3 vColor; varying float vTwinkle;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float strength = pow(1.0 - d * 2.0, 4.0);
  vec3 color = mix(vec3(0.0), vColor, strength);
  gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
}
`

const FINAL_VERT = `
varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
`

const FINAL_FRAG = `
uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
varying vec2 vUv;
vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
  pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
  pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
  pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
  return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
void main(){
  vec2 uv = 2.*vUv - 1.;
  vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
  vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
  flame *= smoothstep(0.25, 1., abs(uv.y));
  float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
  vec3 bg = uBg * (1.0 - 0.4 * length(uv));
  vec3 halo = texture2D(haloTexture, vUv).xyz;
  gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo, 1.);
}
`

export async function createStarfield(canvas) {
  const THREE = await import('three')
  const [{ EffectComposer }, { RenderPass }, { ShaderPass }, { UnrealBloomPass },
         { GammaCorrectionShader }, { CopyShader }] = await Promise.all([
    import('three/examples/jsm/postprocessing/EffectComposer.js'),
    import('three/examples/jsm/postprocessing/RenderPass.js'),
    import('three/examples/jsm/postprocessing/ShaderPass.js'),
    import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
    import('three/examples/jsm/shaders/GammaCorrectionShader.js'),
    import('three/examples/jsm/shaders/CopyShader.js'),
  ])

  const hexToVec3 = (hex) => {
    const n = parseInt(hex.slice(1), 16)
    return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
  }

  const size = () => {
    const r = canvas.getBoundingClientRect()
    return { w: Math.max(1, Math.floor(r.width)), h: Math.max(1, Math.floor(r.height)) }
  }
  let { w, h } = size()
  const dpr = () => Math.min(2, window.devicePixelRatio || 1)

  const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true })
  renderer.setPixelRatio(dpr())
  renderer.setSize(w, h, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.VSMShadowMap

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  scene.fog = new THREE.Fog(0x000000, 0, 15)

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 80)
  camera.position.set(0, 0, 5)
  camera.layers.enable(LAYERS.TORUS_SCENE)
  camera.layers.enable(LAYERS.BLOOM_SCENE)
  camera.layers.enable(LAYERS.ENTIRE_SCENE)
  scene.add(camera)

  /* ---- star cloud ---- */
  const count = 4200
  const depth = 30
  const positions = new Float32Array(count * 3)
  const palette = new Float32Array(count)
  const bright = new Float32Array(count)
  const scales = new Float32Array(count)
  const phases = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 24
    positions[i3 + 1] = (Math.random() - 0.5) * 16
    positions[i3 + 2] = (Math.random() - 0.5) * 30
    palette[i] = Math.floor(Math.random() * 3)
    bright[i] = 0.7 + Math.random() * 0.6
    scales[i] = 0.5 + Math.pow(Math.random(), 1.4) * 2.5
    phases[i] = Math.random()
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.Float32BufferAttribute(scales, 1))
  geometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1))
  geometry.setAttribute('aPalette', new THREE.Float32BufferAttribute(palette, 1))
  geometry.setAttribute('aBright', new THREE.Float32BufferAttribute(bright, 1))

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: CONFIG.pointSize },
      uOpacity: { value: 0 },
      uDrift: { value: 0 },
      uDepth: { value: depth },
      uTwinkle: { value: CONFIG.twinkle },
      uCursor: { value: new THREE.Vector3() },
      uRepelRadius: { value: CONFIG.repelRadius },
      uRepelStrength: { value: CONFIG.repelStrength },
      uActivity: { value: 0 },
      uColorA: { value: hexToVec3(CONFIG.colorA) },
      uColorB: { value: hexToVec3(CONFIG.colorB) },
      uColorC: { value: hexToVec3(CONFIG.colorC) },
      uBrightness: { value: CONFIG.brightness },
    },
  })

  const points = new THREE.Points(geometry, material)
  points.layers.enable(LAYERS.ENTIRE_SCENE)
  const group = new THREE.Group()
  group.add(points)
  scene.add(group)

  /* ---- composers ---- */
  const renderScene = new RenderPass(scene, camera)

  const torusComposer = new EffectComposer(renderer)
  torusComposer.renderToScreen = false
  torusComposer.addPass(renderScene)
  torusComposer.addPass(new ShaderPass(GammaCorrectionShader))
  torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.22, 0.2, 0))
  torusComposer.addPass(new ShaderPass(CopyShader))

  const bloomComposer = new EffectComposer(renderer)
  bloomComposer.renderToScreen = false
  bloomComposer.addPass(renderScene)
  bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.4, 0.55, 0))
  bloomComposer.addPass(new ShaderPass(GammaCorrectionShader))

  // The spec declares haloTexture but never binds one; an unbound sampler2D is
  // undefined behaviour. A 1x1 black texture contributes nothing to the sum.
  const blackPixel = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat)
  blackPixel.needsUpdate = true

  const finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        tDiffuse: { value: null },
        torusTexture: { value: null },
        bloomTexture: { value: null },
        haloTexture: { value: blackPixel },
        uBg: { value: hexToVec3(CONFIG.bgColor) },
        uFlameA: { value: hexToVec3(CONFIG.flameColor) },
        uFlameB: { value: hexToVec3(CONFIG.flameColor2) },
        uFlameAmt: { value: CONFIG.flameAmt },
      },
      vertexShader: FINAL_VERT,
      fragmentShader: FINAL_FRAG,
    }),
    'tDiffuse'
  )
  finalPass.needsSwap = true
  finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture
  finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture

  const finalComposer = new EffectComposer(renderer)
  finalComposer.addPass(renderScene)
  finalComposer.addPass(finalPass)

  for (const c of [torusComposer, bloomComposer, finalComposer]) {
    c.setPixelRatio(dpr())
    c.setSize(w, h)
  }

  /* ---- interaction state ---- */
  const POINTER = { ndc: { x: 0, y: 0 }, world: new THREE.Vector3(), activity: 0, active: false, lastMove: 0 }
  const mouseSmooth = { x: 0, y: 0 }
  let scrollTarget = 0, scrollSmooth = 0, scrollCurrent = 0
  let t0 = performance.now() / 1000
  const appearStart = performance.now()
  let running = true, raf = 0, disposed = false

  const readScroll = () => {
    // The spec scrolls a 300vh host; here the dive completes over one viewport,
    // which is the distance the hero itself is on screen.
    const denom = Math.max(1, window.innerHeight)
    scrollTarget = Math.min(1, Math.max(0, window.scrollY / denom))
  }

  const onMouseMove = (e) => {
    POINTER.ndc.x = (e.clientX / window.innerWidth) * 2 - 1
    POINTER.ndc.y = -((e.clientY / window.innerHeight) * 2 - 1)
    POINTER.active = true
    POINTER.lastMove = performance.now()
  }
  const onMouseOut = () => { POINTER.active = false }

  const _v = new THREE.Vector3()
  const _target = new THREE.Vector3()
  const updatePointer = () => {
    if (POINTER.active) {
      _v.set(POINTER.ndc.x, POINTER.ndc.y, 0.5).unproject(camera)
      const dir = _v.sub(camera.position).normalize()
      const t = -camera.position.z / dir.z
      if (Math.abs(dir.z) > 1e-4 && t > 0 && Number.isFinite(t)) {
        _target.copy(camera.position).addScaledVector(dir, t)
      } else {
        _target.set(0, 0, 0)
      }
    } else {
      _target.set(0, 0, 0)
    }
    POINTER.world.lerp(_target, 0.12)
    const idle = (performance.now() - POINTER.lastMove) / 1000
    const want = POINTER.active && idle < 3 ? 1 : 0
    POINTER.activity += (want - POINTER.activity) * 0.06
    material.uniforms.uCursor.value.copy(POINTER.world)
    material.uniforms.uActivity.value = POINTER.activity
  }

  const onResize = () => {
    const s = size()
    w = s.w; h = s.h
    renderer.setPixelRatio(dpr())
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    for (const c of [torusComposer, bloomComposer, finalComposer]) {
      c.setPixelRatio(dpr())
      c.setSize(w, h)
    }
    readScroll()
  }

  const loop = () => {
    raf = requestAnimationFrame(loop)
    if (!running || disposed) return

    finalPass.uniforms.iTime.value = performance.now() / 1000

    scrollSmooth += (scrollTarget - scrollSmooth) * 0.10
    scrollCurrent += (scrollSmooth - scrollCurrent) * 0.06
    mouseSmooth.x += (POINTER.ndc.x - mouseSmooth.x) * 0.06
    mouseSmooth.y += (POINTER.ndc.y - mouseSmooth.y) * 0.06
    updatePointer()

    const scroll = scrollCurrent
    const m = mouseSmooth
    const t = performance.now() / 1000
    const dt = Math.min(0.05, t - t0)
    t0 = t

    material.uniforms.uTime.value = t
    material.uniforms.uDrift.value += dt * (CONFIG.drift + scroll * CONFIG.scrollDrift)

    camera.position.set(m.x * CONFIG.parallax, m.y * CONFIG.parallax, 5 - scroll * CONFIG.scrollPush)
    camera.lookAt(m.x * CONFIG.parallax, m.y * CONFIG.parallax, -10)

    const elapsed = performance.now() - appearStart
    const fade = Math.min(1, Math.max(0, (elapsed - 300) / 1400))
    material.uniforms.uOpacity.value = fade * CONFIG.opacity

    group.rotation.z += dt * (CONFIG.spin + scroll * CONFIG.scrollSpin)

    camera.layers.set(LAYERS.TORUS_SCENE);  torusComposer.render()
    camera.layers.set(LAYERS.BLOOM_SCENE);  bloomComposer.render()
    camera.layers.set(LAYERS.ENTIRE_SCENE); finalComposer.render()
  }

  const ro = new ResizeObserver(onResize)
  ro.observe(canvas)
  // A three-composer bloom chain running behind five screens of content is pure
  // battery drain; stop when the hero is off screen or the tab is hidden.
  const io = new IntersectionObserver(([en]) => { running = en.isIntersecting && !document.hidden }, { threshold: 0 })
  io.observe(canvas)
  const onVisibility = () => { running = !document.hidden }

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mouseout', onMouseOut, { passive: true })
  window.addEventListener('scroll', readScroll, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)

  readScroll()
  raf = requestAnimationFrame(loop)

  return {
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseOut)
      window.removeEventListener('scroll', readScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      geometry.dispose()
      material.dispose()
      blackPixel.dispose()
      torusComposer.dispose?.()
      bloomComposer.dispose?.()
      finalComposer.dispose?.()
      renderer.dispose()
    },
  }
}
