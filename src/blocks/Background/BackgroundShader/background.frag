varying vec2 vUv;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uScore;

void main() { 

    vec4 colorA = texture2D(uTexture1,vUv);
    //vec4 colorA = texture2D(uTexture2,vUv);

    vec4 colorB = vec4(0.0,0.0,1.0,1.0);
    float vProgress = 1.0; // when 1.0 all black when 0.0 all blue
	float mask = vProgress + 0.75*(1.0 - colorA.r);
	gl_FragColor = mix(colorA, vec4(0.0, 0.0, 1.0, 0.0),mask);

}