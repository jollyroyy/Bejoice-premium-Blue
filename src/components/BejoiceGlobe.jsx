import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { SparklesCore } from './ui/sparkles'

const OFFICES = [
  // HQ — Dubai, UAE
  { name: 'Dubai HQ',        city: 'Dubai',    country: 'UAE',   lat: 25.2048, lng: 55.2708, type: 'hq'      },
  // KSA offices
  { name: 'Riyadh Office',   city: 'Riyadh',   country: 'KSA',   lat: 24.7136, lng: 46.6753, type: 'office'  },
  { name: 'Jeddah Office',   city: 'Jeddah',   country: 'KSA',   lat: 21.4858, lng: 39.1925, type: 'office'  },
  { name: 'Dammam Office',   city: 'Dammam',   country: 'KSA',   lat: 26.4207, lng: 50.0888, type: 'office'  },
  // Partner offices
  { name: 'Mumbai Partner',  city: 'Mumbai',   country: 'India', lat: 19.0760, lng: 72.8777, type: 'partner' },
  { name: 'Shanghai Partner',city: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737,type: 'partner' },
];

// Country region highlights — center lat/lng + approximate radius on the globe
const COUNTRIES = [
  { name: 'UAE',   lat: 24.0,  lng: 54.5,  radius: 0.04, color: 0xffe680, type: 'hq'      },
  { name: 'KSA',   lat: 24.0,  lng: 44.5,  radius: 0.12, color: 0xc8a84e, type: 'office'  },
  { name: 'India', lat: 22.0,  lng: 78.5,  radius: 0.14, color: 0x5ec4d4, type: 'partner' },
  { name: 'China', lat: 35.0,  lng: 105.0, radius: 0.18, color: 0x5ec4d4, type: 'partner' },
];

function latLngToVec3(lat, lng, r = 1) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

// Radial gradient shader for country region glow discs
const REGION_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const REGION_FRAG = `
  uniform vec3 glowColor;
  uniform float opacity;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.08, d) * opacity;
    gl_FragColor = vec4(glowColor, alpha);
  }`;

const ATM_VERT = `
  varying vec3 vNormal; varying vec3 vPosition;
  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position,1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`;
const ATM_FRAG = `
  uniform vec3  glowColor;
  uniform float coeff;
  uniform float power;
  varying vec3 vNormal; varying vec3 vPosition;
  void main() {
    vec3  vNN  = normalize(vNormal);
    vec3  view = normalize(-vPosition);
    float rim  = pow(coeff * (1.0 - dot(vNN, view)), power);
    gl_FragColor = vec4(glowColor, rim);
  }`;

export default function BejoiceGlobe({ embedded = false }) {
  const mountRef   = useRef(null);
  const isDragging = useRef(false);
  const prevMouse  = useRef({ x: 0, y: 0 });
  const autoSpin   = useRef(true);
  const spinTO     = useRef(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W  = el.clientWidth;
    const H  = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 200);
    camera.position.set(0, 0.15, 2.55);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    group.rotation.y = 2.374;
    group.rotation.x = 0.18;
    scene.add(group);

    // Star field
    const addStars = (count, minR, maxR, size, opacity) => {
      const verts = [];
      for (let i = 0; i < count; i++) {
        const t   = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r   = minR + Math.random() * (maxR - minR);
        verts.push(r*Math.sin(phi)*Math.cos(t), r*Math.sin(phi)*Math.sin(t), r*Math.cos(phi));
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0xffffff, size, transparent: true, opacity, sizeAttenuation: true,
      })));
    };
    addStars(4000, 65, 90, 0.18, 0.9);
    addStars(2000, 60, 70, 0.08, 0.55);

    // Earth
    const loader   = new THREE.TextureLoader();
    const earthGeo = new THREE.SphereGeometry(1, 128, 128);
    const earthMat = new THREE.MeshPhongMaterial({
      color:     new THREE.Color(0x060d18),
      specular:  new THREE.Color(0x1a3a5c),
      shininess: 28,
      emissive:  new THREE.Color(0xffeedd),
      emissiveIntensity: 0,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    group.add(earthMesh);

    loader.load(
      'https://cdn.jsdelivr.net/npm/three-globe@2.31.2/example/img/earth-night.jpg',
      (nightTex) => {
        nightTex.colorSpace        = THREE.SRGBColorSpace;
        earthMat.map               = nightTex;
        earthMat.color             = new THREE.Color(0xffffff);
        earthMat.emissiveMap       = nightTex;
        earthMat.emissive          = new THREE.Color(0xffe8cc);
        earthMat.emissiveIntensity = 1.6;
        earthMat.needsUpdate       = true;
      },
    );

    // Atmosphere
    const makeAtm = (color, coeff, power, side, size) => new THREE.Mesh(
      new THREE.SphereGeometry(size, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(color) },
          coeff:     { value: coeff },
          power:     { value: power },
        },
        vertexShader: ATM_VERT, fragmentShader: ATM_FRAG,
        transparent: true, side,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    group.add(makeAtm(0x4488dd, 0.55, 5.5, THREE.FrontSide, 1.025));
    group.add(makeAtm(0x22aaff, 0.40, 4.0, THREE.FrontSide, 1.06));
    group.add(makeAtm(0x113366, 0.60, 3.0, THREE.BackSide,  1.28));

    // Office markers
    const markerGroup = new THREE.Group();
    group.add(markerGroup);
    const dotObjects  = [];

    const pulseRings = [];
    OFFICES.forEach(o => {
      const pos = latLngToVec3(o.lat, o.lng, 1.022);

      const isHQ = o.type === 'hq';
      const isPartner = o.type === 'partner';
      const dotColor = isHQ ? 0xffe680 : isPartner ? 0x5ec4d4 : 0xc8a84e;
      const dotSize = isHQ ? 0.018 : 0.012;

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(dotSize, 16, 16),
        new THREE.MeshBasicMaterial({ color: dotColor }),
      );
      dot.position.copy(pos);
      dot.userData = { office: o.name, type: o.type, country: o.country };
      markerGroup.add(dot);
      dotObjects.push(dot);

      // HQ gets a subtle pulsing ring
      if (isHQ) {
        const ringGeo = new THREE.RingGeometry(0.028, 0.035, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe680, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(pos.clone().multiplyScalar(2));
        markerGroup.add(ring);
        pulseRings.push(ring);
      }

      // Partner offices get a small outer ring
      if (isPartner) {
        const ringGeo = new THREE.RingGeometry(0.02, 0.025, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x5ec4d4, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(pos.clone().multiplyScalar(2));
        markerGroup.add(ring);
      }
    });

    // Country region glows — soft discs on globe surface
    COUNTRIES.forEach(c => {
      const pos = latLngToVec3(c.lat, c.lng, 1.005);
      const geo = new THREE.PlaneGeometry(c.radius * 2, c.radius * 2);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(c.color) },
          opacity: { value: c.type === 'hq' ? 0.35 : 0.2 },
        },
        vertexShader: REGION_VERT,
        fragmentShader: REGION_FRAG,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const disc = new THREE.Mesh(geo, mat);
      disc.position.copy(pos);
      disc.lookAt(pos.clone().multiplyScalar(2));
      group.add(disc);
    });

    // Connection arcs from HQ to all other offices
    const hqPos = latLngToVec3(OFFICES[0].lat, OFFICES[0].lng, 1.0);
    const arcMeshes = [];
    OFFICES.slice(1).forEach(o => {
      const destPos = latLngToVec3(o.lat, o.lng, 1.0);
      // Great circle arc via midpoint lifted above the surface
      const mid = hqPos.clone().add(destPos).multiplyScalar(0.5);
      const dist = hqPos.distanceTo(destPos);
      const lift = 1.0 + dist * 0.35;
      mid.normalize().multiplyScalar(lift);

      const curve = new THREE.QuadraticBezierCurve3(hqPos.clone(), mid, destPos.clone());
      const pts = curve.getPoints(48);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const isPartner = o.type === 'partner';
      const mat = new THREE.LineBasicMaterial({
        color: isPartner ? 0x5ec4d4 : 0xc8a84e,
        transparent: true,
        opacity: 0.28,
        linewidth: 1,
      });
      const arc = new THREE.Line(geo, mat);
      group.add(arc);
      arcMeshes.push(arc);
    });

    // Lighting
    scene.add(new THREE.AmbientLight(0x0a1525, 0.8));
    const moon = new THREE.DirectionalLight(0xb8d8ff, 1.4);
    moon.position.set(-5, 4, 3);
    scene.add(moon);
    const fillLight = new THREE.PointLight(0x1133aa, 0.8, 6);
    fillLight.position.set(-1, -2, 1);
    scene.add(fillLight);

    // Raycaster — desktop hover only
    const raycaster  = new THREE.Raycaster();
    const mouse2     = new THREE.Vector2();
    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouse2.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2, camera);
      const hits = raycaster.intersectObjects(dotObjects);
      if (hits.length) {
        const d = hits[0].object.userData;
        const suffix = d.type === 'hq' ? ' · HQ' : d.type === 'partner' ? ' · Partner' : '';
        setHovered(d.office + suffix);
      } else setHovered(null);
    };
    el.addEventListener('mousemove', onMouseMove);

    // Drag — mouse
    const onDown = (e) => {
      isDragging.current = true; autoSpin.current = false;
      clearTimeout(spinTO.current);
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onDrag = (e) => {
      if (!isDragging.current) return;
      const dx = (e.clientX - prevMouse.current.x) * 0.005;
      const dy = (e.clientY - prevMouse.current.y) * 0.003;
      group.rotation.y += dx;
      group.rotation.x  = Math.max(-0.6, Math.min(0.6, group.rotation.x + dy));
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      isDragging.current = false;
      spinTO.current = setTimeout(() => { autoSpin.current = true; }, 2200);
    };

    // Touch drag — mobile
    const onTouchStart = (e) => {
      isDragging.current = true; autoSpin.current = false;
      clearTimeout(spinTO.current);
      prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const dx = (e.touches[0].clientX - prevMouse.current.x) * 0.005;
      const dy = (e.touches[0].clientY - prevMouse.current.y) * 0.003;
      group.rotation.y += dx;
      group.rotation.x  = Math.max(-0.6, Math.min(0.6, group.rotation.x + dy));
      prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      spinTO.current = setTimeout(() => { autoSpin.current = true; }, 2200);
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd);

    // Animate
    let raf; let t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t  += 0.016;
      if (autoSpin.current) group.rotation.y += 0.0010;


      fillLight.intensity = 0.75 + 0.2 * Math.sin(t * 2.3 + 0.7);
      // Pulse HQ ring
      pulseRings.forEach(ring => {
        const s = 1 + 0.15 * Math.sin(t * 1.8);
        ring.scale.set(s, s, 1);
        ring.material.opacity = 0.35 + 0.25 * Math.sin(t * 1.8);
      });
      // Subtle arc breathing
      arcMeshes.forEach(arc => {
        arc.material.opacity = 0.18 + 0.12 * Math.sin(t * 1.2);
      });
      renderer.render(scene, camera);
    };
    tick();

    // Resize
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(spinTO.current);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  const inner = (
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem,3vw,3rem)' }}
        >
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', fontWeight:800, letterSpacing:'0.3em', textTransform:'uppercase', color:'#c8a84e', display:'block', marginBottom:'0.9rem' }}>
            GLOBAL PRESENCE
          </span>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,5.5vw,4.8rem)', color:'#ffffff', letterSpacing:'0.04em', lineHeight:1.0, margin:0, textShadow:'0 2px 4px rgba(0,0,0,1), 0 6px 24px rgba(0,0,0,0.8)' }}>
            BEJOICE CONNECTS SAUDI TO THE WORLD
          </h2>
        </motion.div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'clamp(1.5rem,3vw,2.5rem)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}
            style={{ position: 'relative', flexShrink: 0, width: '100%', maxWidth: 'min(520px, 90vw)' }}
          >
            {/* Outer glow ring */}
            <div style={{
              position: 'absolute', inset: -28,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,168,78,0.12) 0%, rgba(30,80,180,0.08) 55%, transparent 75%)',
              filter: 'blur(18px)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* Globe canvas */}
            <div
              ref={mountRef}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                cursor: 'grab',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 0 0 1px rgba(200,168,78,0.12), 0 0 60px rgba(30,80,200,0.22), 0 0 120px rgba(10,20,60,0.6)',
                touchAction: 'none',
              }}
            />

            {/* Hover tooltip */}
            {hovered && (
              <motion.div
                initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                style={{
                  position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)',
                  background:'rgba(6,8,20,0.95)',
                  border:'1px solid rgba(200,168,78,0.55)',
                  borderRadius:'2rem', padding:'0.45rem 1.3rem',
                  fontFamily:"'DM Sans',sans-serif", fontSize:'0.85rem', fontWeight:700,
                  color:'#c8a84e', whiteSpace:'nowrap', pointerEvents:'none',
                  boxShadow:'0 4px 24px rgba(0,0,0,0.8)',
                  zIndex: 2,
                }}
              >
                {hovered}
              </motion.div>
            )}

            <div style={{ textAlign:'center', marginTop:'0.8rem', fontFamily:"'DM Sans',sans-serif", fontSize:'0.65rem', color:'rgba(200,168,78,0.4)', letterSpacing:'0.22em', textTransform:'uppercase' }}>
              DRAG TO ROTATE
            </div>
          </motion.div>

          {/* Office list — grouped */}
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.7, delay:0.4 }}
            style={{ width:'100%', maxWidth:600 }}
          >
            {/* HQ */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.7rem', marginBottom:'1rem' }}>
              <span style={{ width:12, height:12, borderRadius:'50%', background:'#ffe680', flexShrink:0, boxShadow:'0 0 8px rgba(255,230,128,0.5)' }} />
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.1rem,3vw,1.4rem)', color:'#ffe680', letterSpacing:'0.08em' }}>DUBAI, UAE — HEADQUARTERS</span>
            </div>

            {/* Separator */}
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'1.6rem 0 0.6rem' }}>
              <div style={{ flex:1, height:1, background:'rgba(200,168,78,0.15)' }} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:'rgba(200,168,78,0.95)', letterSpacing:'0.2em', textTransform:'uppercase', flexShrink:0 }}>Branch Offices</span>
              <div style={{ flex:1, height:1, background:'rgba(200,168,78,0.15)' }} />
            </div>

            <div style={{ display:'flex', justifyContent:'center', gap:'1rem 2rem', flexWrap:'wrap', marginBottom:'0.5rem' }}>
              {[
                { label:'Saudi Arabia', flag:'🇸🇦' },
                { label:'UAE',          flag:'🇦🇪' },
                { label:'India',        flag:'🇮🇳' },
                { label:'China',        flag:'🇨🇳' },
              ].map(({ label }) => (
                <motion.div key={label} whileHover={{ y:-3 }} transition={{ type:'spring', stiffness:300, damping:20 }}
                  style={{ display:'flex', alignItems:'center', minHeight:44 }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(0.95rem,2.5vw,1.1rem)', fontWeight:600, color:'rgba(255,255,255,0.82)' }}>{label}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(0.9rem,2vw,1.05rem)', color:'rgba(200,168,78,0.95)', letterSpacing:'0.15em', textTransform:'uppercase', textAlign:'center', marginTop:'0.75rem', fontStyle:'italic', fontWeight:600 }}
            >
              Strategically positioned for seamless global connectivity
            </motion.p>

          </motion.div>
        </div>
      </div>
  )

  if (embedded) return inner

  return (
    <section id="globe" style={{ padding: 'clamp(3rem,6vw,5rem) 1.5rem', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      <SparklesCore background="transparent" minSize={0.6} maxSize={2} particleDensity={60} particleColor="rgba(200,168,78,0.9)" speed={0.8} className="absolute inset-0 w-full h-full pointer-events-none" />
      {inner}
    </section>
  )
}
