import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Tissu : ondulation par vertex shader, peu coûteux, look cloth crédible.
const vert = `
varying vec2 vUv;
uniform float uTime;
uniform float uPhase;
void main(){
  vUv = uv;
  vec3 p = position;
  // Amplitude qui augmente vers le bas de la bannière
  float w = (1.0 - uv.y) * 0.22;
  p.z += sin(uv.y * 6.0 + uTime * 2.0 + uPhase) * w;
  p.x += sin(uv.y * 4.0 + uTime * 1.5 + uPhase) * w * 0.35;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const frag = `
varying vec2 vUv;
uniform sampler2D uMap;
void main(){
  vec4 c = texture2D(uMap, vUv);
  if (c.a < 0.02) discard;
  gl_FragColor = c;
}`;

function makeBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const x = c.getContext('2d')!;
  // fond cloth bordeaux
  const grad = x.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#6b2412');
  grad.addColorStop(0.5, '#4a1a0a');
  grad.addColorStop(1, '#2a0d05');
  x.fillStyle = grad; x.fillRect(0, 0, 256, 512);
  // bordures dorées
  x.fillStyle = '#c99b5c';
  x.fillRect(0, 0, 256, 14);
  x.fillRect(0, 498, 256, 14);
  // emblème ⚜
  x.fillStyle = '#e5c788';
  x.font = 'bold 190px serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText('⚜', 128, 260);
  // découpe en V au bas (deux triangles transparents pour effet bannière)
  x.globalCompositeOperation = 'destination-out';
  x.beginPath(); x.moveTo(0, 510); x.lineTo(128, 460); x.lineTo(256, 510); x.lineTo(256, 512); x.lineTo(0, 512); x.closePath(); x.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function AnimatedBanner({ position, phase = 0 }: { position: [number, number, number]; phase?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const tex = useMemo(() => makeBannerTexture(), []);
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh position={position} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[1.2, 2.4, 12, 28]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{ uTime: { value: 0 }, uPhase: { value: phase }, uMap: { value: tex } }}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}
