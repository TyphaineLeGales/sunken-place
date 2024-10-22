varying vec2 vUv;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uScore;

void main() { 

    //vec4 colorA = texture2D(uTexture1,vUv);
    //vec4 colorA = texture2D(uTexture2,vUv);

    vec4 colorA = vec4(0.0,0.0,0.0,1.0);
    vec4 colorB = vec4(1.0,1.0,1.0,1.0);

    gl_FragColor = mix(colorA,colorB,0.0);
}