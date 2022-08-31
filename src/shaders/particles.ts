const glsl = require('babel-plugin-glsl/macro');

// --------------------- VERTEX SHADER ---------------------- //
const vertexShader: string = glsl`
precision highp float;

attribute float pindex;
attribute vec3 pposition;
attribute vec2 uvx;

uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform float uMouse;
uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

float random(float n) {
	return fract(sin(n) * 43758.5453);
}

void main() {
	vUv = uvx;

	// particle uv
	vec2 puv = pposition.xy / uTextureSize;
	vPUv = puv;
	
	// particle position
	vec3 pos = pposition;

	pos.x -= uTextureSize.x * .5; // center
	pos.z += (snoise2(vec2(pindex, uRandom * .1)) + 1.0) * uDepth;

	// on hover static effect
	if (uMouse < pos.y) {
		float amp =6.;
		float freq =  ((uTextureSize.y) - (pos.y)) * .121;
		pos.x += abs(sin(freq + uTime * 3.8) * amp) - (amp - 1.75);
	}

	// initial animation
	if (uRandom < 1.) {
		pos.xy *= vec2(clamp(uRandom + random(pindex  + uTime), 0., 1.));
	}

	vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
	
	// particle size
	vec2 vel = vec2(uTime * .1, uTime * .2);
	vec4 texel = texture2D(uTexture, puv);
	float psize = uSize / max(uTextureSize.x, uTextureSize.y);
	psize *= snoise2(pindex + vel);
	psize *= texel.r + texel.g + texel.b;

	mvPosition.xyz += position * psize;

	vec4 finalPosition = projectionMatrix * mvPosition;
	gl_Position = finalPosition;
}
`;

// --------------------- FRAGMENT SHADER ---------------------- //
const fragmentShader: string = glsl`
precision highp float;

uniform sampler2D uTexture;
uniform float uSize;
uniform vec2 uTextureSize;

varying vec2 vPUv;
varying vec2 vUv;

void main() {
	vec2 puv = vPUv;
	vec2 uv = vUv;

	// pixel color
	vec4 colA = texture2D(uTexture, puv);
	vec4 color = vec4(colA.r * 0.85, colA.g, colA.b , 1.0);

	// // display as round cicle
	// if (distance(uv, vec2(0.5)) > 0.4) discard;

	gl_FragColor = color;
}
`;

export { vertexShader, fragmentShader };
