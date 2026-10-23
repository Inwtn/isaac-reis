
  uniform vec3 uColor;
  uniform float uExposure;

  varying float vAlpha;
  varying float vRingShade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float flatShade = smoothstep(0.5, 0.05, d);

    // Fake-sphere impostor, faded in only for the preloader's ring dots
    // (vRingShade) — a flat glowing disc doesn't read as a "ball" like the
    // reference spinner; a cheap normal reconstructed from the point's own
    // UV (as if it really were a hemisphere bulging toward the camera)
    // plus one fixed light direction gets there without a texture or any
    // real per-particle geometry.
    float r2 = dot(uv, uv);
    float sphereZ = sqrt(max(0.25 - r2, 0.0)) / 0.5;
    vec3 normal = normalize(vec3(uv * 2.0, sphereZ));
    vec3 lightDir = normalize(vec3(-0.4, 0.55, 0.75));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float sphereShade = flatShade * mix(0.35, 1.6, diffuse);

    float shade = mix(flatShade, sphereShade, vRingShade);

    gl_FragColor =
      vec4(uColor, min(shade * vAlpha * uExposure, 1.0));

    #include <colorspace_fragment>
  }
