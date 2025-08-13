import * as React from "react";
import { useMemo, useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Line, Points, PointMaterial, Html, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { easing } from "maath"; // tiny helper for eased damp (installed with drei usually)

// Util: reduced motion + webgl support
const useReducedMotion = () => {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return prefers;
};

const hasWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
};

type Props = {
  className?: string;
  intensity?: number; // bloom multiplier
};

function OrbitingElectrons({ count = 3 }: { count?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.2;
  });

  const rings = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const r = 1.8 + i * 0.55;
      const speed = 0.6 + i * 0.25;
      const color = i % 2 ? "#A855F7" : "#7C3AED";
      return { r, speed, color };
    });
  }, [count]);

  return (
    <group ref={group}>
      {rings.map(({ r, speed, color }, i) => (
        <ElectronRing key={i} radius={r} speed={speed} color={color} />
      ))}
    </group>
  );
}

function ElectronRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ringPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segs = 128;
    for (let i = 0; i <= segs; i++) {
      const t = (i / segs) * Math.PI * 2;
      pts.push([Math.cos(t) * radius, Math.sin(t) * radius, 0]);
    }
    return pts;
  }, [radius]);

  const electron = useRef<THREE.Mesh>(null!);
  const tRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    tRef.current += delta * speed;
    const x = Math.cos(tRef.current) * radius;
    const y = Math.sin(tRef.current) * radius;
    if (electron.current) {
      electron.current.position.set(x, y, 0);
    }
  });

  return (
    <group>
      <Line
        points={ringPoints}
        color={new THREE.Color(color).offsetHSL(0, 0.1, -0.1).getStyle()}
        lineWidth={0.8}
        dashed={false}
        transparent
        opacity={0.35}
      />
      <mesh ref={electron}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} metalness={0.2} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Nucleus() {
  const mesh = useRef<THREE.Mesh>(null!);
  const [pulse, setPulse] = useState(0);
  useFrame((_state, delta) => {
    if (!mesh.current) return;
    const t = performance.now() * 0.001;
    mesh.current.rotation.y += delta * 0.25;
    mesh.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.02 + pulse);
    // ease pulse back to 0
    setPulse((p) => Math.max(0, p - delta * 0.8));
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh
        ref={mesh}
        onClick={() => setPulse(0.15)}
        onPointerDown={() => setPulse(0.2)}
      >
        <icosahedronGeometry args={[1.1, 3]} />
        <MeshDistortMaterial
          color={"#8B5CF6"}
          emissive={"#7C3AED"}
          emissiveIntensity={2.2}
          roughness={0.2}
          metalness={0.3}
          distort={0.35}
          speed={1.2}
          transparent
          opacity={0.95}
        />
      </mesh>
    </Float>
  );
}

function WireframeKnot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_s, d) => {
    if (!ref.current) return;
    ref.current.rotation.x += d * 0.08;
    ref.current.rotation.y -= d * 0.06;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.8]}>
      <torusKnotGeometry args={[2.8, 0.02, 220, 20]} />
      <meshBasicMaterial color={"#6D28D9"} wireframe transparent opacity={0.25} />
    </mesh>
  );
}

function sampleTextToPoints(text: string, options?: { width?: number; height?: number; density?: number }) {
  // Canvas-based sampler to get 2D points for text, then we add slight Z jitter later.
  const w = options?.width ?? 800;
  const h = options?.height ?? 220;
  const density = options?.density ?? 0.16; // smaller = fewer points (perf lever)

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Responsive font sizing
  const base = Math.min(w, h);
  ctx.font = `${Math.floor(base * 0.6)}px 'Inter', system-ui, -apple-system, sans-serif`;
  ctx.fillText(text, w / 2, h / 2);

  const img = ctx.getImageData(0, 0, w, h).data;
  const pts: Float32Array[] = [];
  const step = Math.max(1, Math.floor(1 / density));
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4;
      const alpha = img[idx + 3];
      if (alpha > 128) {
        // center & scale to ~[-5..5] range
        const nx = ((x - w / 2) / (w / 2)) * 5.0;
        const ny = (-(y - h / 2) / (h / 2)) * 2.0; // flatter height for wide word
        pts.push(new Float32Array([nx, ny, 0]));
      }
    }
  }
  return pts;
}

function ParticleMorph() {
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(1200); // adapt on mobile for perf
  const group = useRef<THREE.Points>(null!);

  // State: whether we're showing text target
  const [toText, setToText] = useState(false);

  // UI + keybinding
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "z") setToText((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // One-time mobile tuning: reduce particle count on small screens / low device memory
  useEffect(() => {
    try {
      const dm = (navigator as any)?.deviceMemory ?? 4;
      const w = window.innerWidth;
      const isSmall = w <= 640;
      const target = dm <= 3 || isSmall ? 800 : 1200;
      setCount(target);
    } catch {}
  }, []);

  // Source positions: spherical cloud
  const cloudPositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr.set([x, y, z], i * 3);
    }
    return arr;
  }, [count]);

  // Target positions: text “ZEROMOTION”
  const textPositions = useMemo(() => {
    // sample offscreen once
    const pts = sampleTextToPoints("ZEROMOTION", { width: 900, height: 260, density: 0.18 });
    // Distribute to `count` by cycling
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const p = pts[i % pts.length];
      // add a tiny z jitter so it's not perfectly flat
      const z = (Math.random() - 0.5) * 0.6;
      arr.set([p[0], p[1], z], i * 3);
    }
    return arr;
  }, [count]);

  // Current buffer we animate into
  const positions = useMemo(() => new Float32Array(cloudPositions), [cloudPositions]);
  const targetRef = useRef<"cloud" | "text">("cloud");

  // Animate between buffers with easing
  useFrame((_s, d) => {
    if (!group.current || prefersReduced) return;

    const target = targetRef.current === "text" ? textPositions : cloudPositions;
    const pos = group.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    // Smoothly “damp” each coordinate toward target
    for (let i = 0; i < pos.array.length; i++) {
      // maath easing.damp() works on numbers, we’ll just lerp manually for perf:
      positions[i] = THREE.MathUtils.damp(positions[i], target[i], 4.0, d);
    }
    pos.array.set(positions);
    pos.needsUpdate = true;

    // slow rotation for life
    group.current.rotation.y += d * 0.02;
  });

  // Flip target on toggle
  useEffect(() => {
    targetRef.current = toText ? "text" : "cloud";
  }, [toText]);

  return (
    <>
      <Points ref={group} positions={positions} stride={3}>
        <PointMaterial size={0.03} transparent depthWrite={false} opacity={0.78} color={"#A78BFA"} />
      </Points>

      {/* UI Toggle (outside WebGL but overlaid via Html) */}
      <Html position={[0, 0, 0]} transform={false} zIndexRange={[20, 0]}>
        <div
          className="pointer-events-auto fixed right-4 bottom-4"
          style={{
            paddingRight: "calc(env(safe-area-inset-right, 0px) + 0px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0px)",
          }}
        >
          <button
            onClick={() => setToText((s) => !s)}
            className="text-[12px] md:text-[11px] tracking-wide text-white/80 bg-white/5 hover:bg-white/10 transition-colors px-3.5 py-2 md:px-3 md:py-1.5 rounded-full ring-1 ring-white/10"
            aria-pressed={toText}
            aria-label="Toggle ZeroMotion particle morph"
          >
            {toText ? "Back to Particles • Z" : "Easter Egg • Z"}
          </button>
        </div>
      </Html>
    </>
  );
}

function CameraRig() {
  const { camera, gl } = useThree();
  const target = useRef(new THREE.Vector3());
  useEffect(() => {
    gl.setClearColor("#0a0a0b");
  }, [gl]);
  useFrame(({ mouse }, delta) => {
    // gentle parallax
    target.current.set(mouse.x * 0.8, mouse.y * 0.6, camera.position.z);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.current.x, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -target.current.y, 4, delta);
    camera.lookAt(0, 0, 0);
  });
  // scroll zoom
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.0025, 6, 10);
      camera.position.z = z;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [camera]);
  return null;
}

const Hud = () => (
  <Html
    as="div"
    transform={false}
    zIndexRange={[10, 0]}
    style={{ pointerEvents: "none" }}
    position={[0, 0, 0]}
    prepend
  >
    <div className="absolute left-4 top-4 text-xs tracking-wide text-white/70 backdrop-blur-sm bg-white/5 px-3 py-1.5 rounded-full ring-1 ring-white/10 transition-opacity group-hover:opacity-0">
      Forefront of AI • Houma, LA
    </div>
  </Html>
);

const Scene: React.FC<{ intensity: number }> = ({ intensity }) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 6]} intensity={1.2} color={"#C084FC"} />
      <pointLight position={[-6, -4, -6]} intensity={0.6} color={"#60A5FA"} />
      <group>
        <WireframeKnot />
        <Nucleus />
        <OrbitingElectrons count={4} />
        <ParticleMorph />
        <Hud />
      </group>
      <EffectComposer enableNormalPass={false} multisampling={4}>
        <Bloom intensity={0.7 * intensity} luminanceThreshold={0.2} luminanceSmoothing={0.15} />
        <Vignette eskil={false} offset={0.2} darkness={0.5} />
      </EffectComposer>
      <CameraRig />
    </>
  );
};

const FallbackSVG: React.FC = () => (
  <div className="w-full h-full grid place-items-center bg-gradient-to-b from-zinc-900 to-zinc-950">
    <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-[0_0_35px_rgba(124,58,237,0.45)]">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#A855F7"/>
          <stop offset="100%" stopColor="#4C1D95"/>
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="34" fill="url(#g)" />
      {[0,1,2,3].map((i)=>(
        <ellipse key={i} cx="120" cy="120" rx={65+i*10} ry={28+i*6} fill="none" stroke="#7C3AED" strokeOpacity="0.6" />
      ))}
      <circle cx="185" cy="120" r="6" fill="#A78BFA"/>
      <circle cx="55" cy="120" r="6" fill="#A78BFA"/>
    </svg>
  </div>
);

const QuantumShowcase: React.FC<Props> = ({ className = "", intensity = 1 }) => {
  const [ready, setReady] = useState(false);
  const reduced = typeof window !== "undefined" ? useReducedMotion() : false;

  useEffect(() => {
    setReady(true);
  }, []);

  const showWebGL = ready && !reduced && hasWebGL();

  return (
    <div className={`group relative rounded-2xl ring-1 ring-white/10 shadow-xl overflow-hidden ${className}`}>
      {showWebGL ? (
        <Canvas
          dpr={[1, 2]}
          camera={{ fov: 42, position: [0, 0, 8] }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          className="w-full h-full"
        >
          <Suspense fallback={<FallbackSVG />}>
            <Scene intensity={intensity} />
          </Suspense>
        </Canvas>
      ) : (
        <FallbackSVG />
      )}
    </div>
  );
};

export default React.memo(QuantumShowcase);


