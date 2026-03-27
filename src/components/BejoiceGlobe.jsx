import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const OFFICES = [
  { name: 'Riyadh HQ', city: 'Riyadh',  lat: 24.7136, lng: 46.6753, primary: true  },
  { name: 'Jeddah',    city: 'Jeddah',  lat: 21.4858, lng: 39.1925, primary: false },
  { name: 'Dammam',    city: 'Dammam',  lat: 26.4207, lng: 50.0888, primary: false },
  { name: 'Dubai Hub', city: 'Dubai',   lat: 25.2048, lng: 55.2708, primary: false },
  { name: 'Doha',      city: 'Doha',    lat: 25.2854, lng: 51.5310, primary: false },
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

export default function BejoiceGlobe() {
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

    OFFICES.forEach(o => {
      const pos = latLngToVec3(o.lat, o.lng, 1.022);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffe8a0 }),
      );
      dot.position.copy(pos);
      dot.userData = { office: o.name };
      markerGroup.add(dot);
      dotObjects.push(dot);

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
      setHovered(raycaster.intersectObjects(dotObjects).length
        ? raycaster.intersectObjects(dotObjects)[0].object.userData.office : null);
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

  return (
    <section style={{ padding: 'clamp(3rem,6vw,5rem) 1.5rem', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem,3vw,3rem)' }}
        >
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.3em', textTransform:'uppercase', color:'#c8a84e', display:'block', marginBottom:'0.9rem' }}>
            OUR OFFICES
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

          {/* Office list */}
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.7, delay:0.4 }}
            style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'1.2rem 2rem' }}
          >
            {OFFICES.map(o => (
              <motion.div key={o.name} whileHover={{ y:-4 }} transition={{ type:'spring', stiffness:300, damping:20 }}
                style={{ display:'flex', alignItems:'center', gap:'0.75rem', minHeight: 44 }}>
                <span style={{
                  width: 9, height: 9,
                  borderRadius:'50%', flexShrink:0,
                  background: 'rgba(200,168,78,0.5)',
                  display:'block',
                }} />
                <div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(1rem,2.5vw,1.25rem)', fontWeight:500, color:'rgba(255,255,255,0.82)', lineHeight:1.2 }}>{o.city}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
