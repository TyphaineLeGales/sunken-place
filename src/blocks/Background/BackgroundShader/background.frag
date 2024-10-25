varying vec2 vUv;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;

float map(float value, float min1, float max1, float min2, float max2) {
	return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() { 
    vec2 uv = vUv;
    uv.x *= 2.;
    vec4 colorA = texture2D(uTexture2,uv);
    vec4 texBg = texture2D(uTexture1,vUv);
    float shaderProgress = map(uProgress, 0.5, 1., 1.5, 0.1);
    vec4 blue = vec4(0.1176, 0.1569, 0.7843, 1.0);
	float mask = shaderProgress*(vUv.x + 0.5) + 0.75*colorA.r;  // when 0.5 all black when 0.0 all blue
    gl_FragColor = step(mask, blue)*texBg;
}