const glsl = require('babel-plugin-glsl/macro');

// --------------------- VERTEX SHADER ---------------------- //
const vertexShader = (vertShader: string): string =>
    glsl`
    attribute vec2 texIdx;
    varying vec2 vTexIdx;
    varying vec2 vUv;
    ${vertShader}
    `.replace(
        `void main() {`,
        glsl`
        void main() {
        vTexIdx = texIdx;
        vUv = uv;`
    );

// --------------------- FRAGMENT SHADER ---------------------- //
const fragmentShader = (fragShader: string): string =>
    glsl`
    uniform sampler2D texAtlas;
    varying vec2 vTexIdx;
    varying vec2 vUv;
    ${fragShader}
    `.replace(
        `#include <map_fragment>`,
        glsl`
        #include <map_fragment>
        vec2 blockUv = 0.2 * (vTexIdx + vUv);
        vec4 blockColor = texture2D(texAtlas, blockUv);
        diffuseColor *= blockColor;`
    );

export { vertexShader, fragmentShader };
