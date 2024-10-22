precision mediump float;

varying vec2 vUv;  // UV coordinates passed from the vertex shader

void main() {
    vec3 color = vec3(0.0);

    // bottom-left
    vec2 bl = step(vec2(0.1),vUv);
    float pct = bl.x * bl.y;

    // top-right
     vec2 tr = step(vec2(0.1),1.0-vUv);
    pct *= tr.x * tr.y;
    color = vec3(pct);

    gl_FragColor = vec4(color, 1.0);  // Output the final color with full opacity
}