varying vec2 vUv;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uScore;
uniform float uProgress;
uniform vec2 uResolution;

float map(float value, float min1, float max1, float min2, float max2) {
	return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() { 
    vec2 uv = vUv;
    uv.x *= 1.5;
    vec4 colorA = texture2D(uTexture2,uv);
    vec4 texBg = texture2D(uTexture1,uv);
    vec2 screenCoord = gl_FragCoord.xy/uResolution;
    //vec4 colorA = texture2D(uTexture2,vUv);
    float shaderProgress = map(uProgress, 0.0, 1., 0.5, 6.);
    vec4 colorB = vec4(0.0,0.0,1.0,1.0);
	float mask = shaderProgress*(screenCoord.x+0.25) + 0.75*(colorA.r);  // when 0.5 all black when 0.0 all blue
	vec4 dispProgress = mix(colorA, vec4(0.0, 0.0, 1.0, 0.0),mask);
    gl_FragColor = mix(colorB, vec4(0.0, 0.0, 1.0, 0.0),mask)*texBg;
    
}