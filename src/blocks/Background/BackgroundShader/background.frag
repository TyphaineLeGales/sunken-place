varying vec2 vUv;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uScore;
uniform float uProgress;

void main() { 

    vec4 colorA = texture2D(uTexture1,vUv);
    //vec4 colorA = texture2D(uTexture2,vUv);

    vec4 colorB = vec4(0.0,0.0,1.0,1.0);
	float mask = uProgress + 0.75*(1.0 - colorA.r);  // when 1.0 all black when 0.0 all blue
	gl_FragColor = mix(colorA, vec4(0.0, 0.0, 1.0, 0.0),mask);

}