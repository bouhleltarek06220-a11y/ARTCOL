/* ===========================================================================
   sceneShader.js — KIT
   Shaders GLSL de la transition plein écran entre deux scènes (textures).
   - cover-fit (jamais d'image déformée, quel que soit l'écran)
   - wipe organique (bruit) piloté par la progression de scroll
   - décalage RGB proportionnel à la VITESSE de scroll (effet « vitesse »)
   - Ken Burns, vignette, grain : rendu cinématique
   =========================================================================== */
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){
    // UV dérivé de la position clip-space du ScreenQuad (robuste, indépendant
    // de l'attribut uv qui n'est pas toujours fourni) : 0..1 sur l'écran.
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform vec2  uResA;
  uniform vec2  uResB;
  uniform vec2  uViewport;
  uniform float uProgress;   // 0..1 entre la scène A et la scène B
  uniform float uVelocity;   // vitesse de scroll
  uniform float uTime;
  uniform float uReduced;    // 1.0 si prefers-reduced-motion

  vec2 coverUV(vec2 uv, vec2 res, vec2 vp){
    float ra = res.x / res.y;
    float rv = vp.x / vp.y;
    vec2 s = ra > rv ? vec2(rv/ra, 1.0) : vec2(1.0, ra/rv);
    return (uv - 0.5) * s + 0.5;
  }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }

  void main(){
    vec2 uv = vUv;
    float kb = uReduced > 0.5 ? 0.0 : 0.018;
    vec2 z = (uv - 0.5) * (1.0 - kb * sin(uTime * 0.15)) + 0.5;

    vec2 uvA = coverUV(z, uResA, uViewport);
    vec2 uvB = coverUV(z, uResB, uViewport);

    float v = clamp(abs(uVelocity) * 0.010, 0.0, 0.045) * (uReduced > 0.5 ? 0.0 : 1.0);

    float n = noise(uv * 3.0 + uTime * 0.05);
    float wipe = smoothstep(0.0, 1.0, uProgress * 1.35 - uv.y * 0.30 + (n - 0.5) * 0.22);

    vec3 colA, colB;
    colA.r = texture2D(uTexA, uvA + vec2(v, 0.0)).r;
    colA.g = texture2D(uTexA, uvA).g;
    colA.b = texture2D(uTexA, uvA - vec2(v, 0.0)).b;
    colB.r = texture2D(uTexB, uvB + vec2(v, 0.0)).r;
    colB.g = texture2D(uTexB, uvB).g;
    colB.b = texture2D(uTexB, uvB - vec2(v, 0.0)).b;

    vec3 col = mix(colA, colB, wipe);

    col *= 0.60;                                   // assombri pour lisibilité texte
    float d = distance(uv, vec2(0.5));
    col *= smoothstep(0.98, 0.32, d) * 0.5 + 0.62; // vignette
    col += (hash(uv * (uTime + 1.0)) - 0.5) * 0.022; // grain

    gl_FragColor = vec4(col, 1.0);
  }
`;
