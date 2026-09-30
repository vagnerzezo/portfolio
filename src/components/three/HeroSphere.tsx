"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";

const COUNT = 7000;
const CAMERA_Z = 3.1;
const FOV = 45;
// Altura visível no plano z = 0 (em unidades do mundo) para a câmera acima.
const VIEW_HEIGHT = 2 * CAMERA_Z * Math.tan(((FOV / 2) * Math.PI) / 180);
// Quanto do quadrado-âncora a esfera de raio 1 ocupa (igual a quando o canvas era o próprio quadrado).
const SPHERE_FILL = 2 / VIEW_HEIGHT;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Pseudo-aleatório determinístico (0–1): mesmo resultado a cada render, sem Math.random.
const random = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// Simplex noise 3D (Ashima Arts / Stefan Gustavson, licença MIT).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uDissolve;
uniform vec2 uMouse;
uniform float uPixelRatio;
attribute float aRandom;
varying float vAlpha;
varying float vAccent;
${NOISE}
void main() {
  vec3 normal = normalize(position);
  float n = snoise(position * 1.4 + vec3(uTime * 0.12));
  vec3 p = position * (1.0 + n * 0.14);

  // Os pontos voltados para o mouse "incham".
  vec3 mouseDir = normalize(vec3(uMouse * 1.4, 1.0));
  float facing = pow(max(dot(normal, mouseDir), 0.0), 6.0);
  p += normal * facing * 0.22 * clamp(length(uMouse) + 0.3, 0.0, 1.0);

  // Dissolve com o scroll: cada ponto se afasta numa velocidade própria.
  p += normal * uDissolve * (0.5 + aRandom * 3.5);
  p.y += uDissolve * (aRandom - 0.5) * 1.6;

  // Quanto mais longe do centro da esfera, mais apagado: as bolinhas somem ao se espalhar.
  float spread = 1.0 - smoothstep(1.15, 3.6, length(p));

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // Limite no tamanho: pontos que chegam perto da câmera não viram discos gigantes.
  gl_PointSize = min(9.0 * uPixelRatio * (0.5 + aRandom * 0.8) / -mv.z, 14.0 * uPixelRatio);

  float depth = smoothstep(-4.2, -2.2, mv.z);
  vAlpha = (0.15 + depth * 0.85) * spread;
  vAccent = step(0.975, aRandom);
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
varying float vAlpha;
varying float vAccent;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
  gl_FragColor = vec4(mix(uColor, uAccent, vAccent), alpha);
}`;

// Cores como vec3 cru (0–1): o shader não converte color space, então não usamos THREE.Color
// (que converteria para linear e escureceria o tom).
const hex = (value: string) =>
  new THREE.Vector3(
    parseInt(value.slice(1, 3), 16) / 255,
    parseInt(value.slice(3, 5), 16) / 255,
    parseInt(value.slice(5, 7), 16) / 255,
  );

function Particles({ triggerId, anchor }: { triggerId: string; anchor: RefObject<HTMLDivElement | null> }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2());
  const dissolve = useRef(0);
  const dpr = useThree((state) => state.viewport.dpr);
  const size = useThree((state) => state.size);

  // O canvas cobre o hero todo; posiciona e escala a esfera para coincidir com o quadrado-âncora
  // (o mesmo lugar do fallback SVG), convertendo pixels em unidades do mundo no plano z = 0.
  useEffect(() => {
    const el = anchor.current;
    const canvas = el?.parentElement;
    if (!el || !canvas || !group.current || size.height === 0) return;
    const a = el.getBoundingClientRect();
    const c = canvas.getBoundingClientRect();
    const unitsPerPx = VIEW_HEIGHT / size.height;
    const cx = a.left - c.left + a.width / 2 - size.width / 2;
    const cy = a.top - c.top + a.height / 2 - size.height / 2;
    group.current.position.set(cx * unitsPerPx, -cy * unitsPerPx, 0);
    group.current.scale.setScalar((a.width / 2) * unitsPerPx * SPHERE_FILL);
  }, [anchor, size]);

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = GOLDEN_ANGLE * i;
      positions.set([Math.cos(theta) * r, y, Math.sin(theta) * r], i * 3);
      randoms[i] = random(i + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDissolve: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uPixelRatio: { value: 1 },
      uColor: { value: hex("#ece8df") },
      uAccent: { value: hex("#0702fe") },
    }),
    [],
  );

  useEffect(() => {
    // O canvas fica atrás do texto (pointer-events: none), então o mouse vem da janela.
    const onMove = (event: PointerEvent) => {
      mouse.current.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const trigger = ScrollTrigger.create({
      trigger: `#${triggerId}`,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => (dissolve.current = self.progress),
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      trigger.kill();
      geometry.dispose();
    };
  }, [geometry, triggerId]);

  // Uniforms são mutados pelo material (ref), não pelo objeto criado no render.
  useFrame((_, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTime.value += delta;
    u.uPixelRatio.value = dpr;
    u.uMouse.value.lerp(mouse.current, 0.05);
    u.uDissolve.value += (dissolve.current - u.uDissolve.value) * 0.1;
    if (points.current) {
      points.current.rotation.y += delta * 0.06;
      points.current.rotation.x += (-mouse.current.y * 0.25 + 0.35 - points.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function HeroSphere({
  triggerId,
  anchor,
  onReady,
}: {
  triggerId: string;
  anchor: RefObject<HTMLDivElement | null>;
  onReady: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.75);

  // Fora da tela, o loop de render para (frameloop "never"): nada de GPU gasta à toa.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(container.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="size-full">
      <Canvas
        dpr={[1, dpr]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        onCreated={() => onReady()}
        aria-hidden="true"
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <Particles triggerId={triggerId} anchor={anchor} />
      </Canvas>
    </div>
  );
}
