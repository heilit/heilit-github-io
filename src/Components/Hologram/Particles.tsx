import { ThreeEvent, useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { fragmentShader, vertexShader } from '../../shaders/particles';
import { Mesh, ShaderMaterial, Texture, TextureLoader, Vector2 } from 'three';
import { useSpring, animated } from '@react-spring/three';
import easings from '../../utils/easings';
import { useScroll } from '@react-three/drei';
import ParticleGeometry from './ParticleGeometry';

function Particles({ animationRange: range }: { animationRange: [number, number] }) {
    const shaderRef = useRef<ShaderMaterial>(null!);
    const meshRef = useRef<Mesh>(null!);
    const scrollData = useScroll();
    const texture: Texture = useLoader(TextureLoader, 'assets/holog.png');
    const textureSize: Vector2 = new Vector2(texture.image.width, texture.image.height);
    const scaleImage = window.innerHeight > 980 ? 0.22 : 0.26;

    const [shaderSpring, spring] = useSpring(() => ({
        from: { uSize: 0, uDepth: -10, uRandom: 0 },
        delay: 500,
        config: { duration: 2000, easing: easings.easeInOutCubic }
    }));

    useFrame(({ clock }) => {
        shaderRef.current.uniforms.uTime.value = clock.elapsedTime;
        if (scrollData.visible(...range)) {
            spring.start({
                to: { uRandom: 1, uSize: 0.4, uDepth: 2 }
            });
        }
    });

    const mouseReset = texture.image.height + 1;
    const handleMouseOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const { point } = e;
        const pos = meshRef.current.worldToLocal(point);
        shaderRef.current.uniforms.uMouse.value = pos.y;
    };
    const handleMouseOut = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        shaderRef.current.uniforms.uMouse.value = mouseReset;
    };

    return (
        <mesh
            ref={meshRef}
            onPointerMove={e => handleMouseOver(e)}
            onPointerOut={e => handleMouseOut(e)}
            scale={scaleImage}>
            <ParticleGeometry texture={texture.image} />
            {/* @ts-expect-error https://github.com/microsoft/TypeScript/issues/34933 */}
            <animated.shaderMaterial
                ref={shaderRef}
                args={[
                    {
                        transparent: true,
                        uniforms: {
                            uTime: { value: 0 },
                            uRandom: { value: 0 },
                            uDepth: { value: 0 },
                            uSize: { value: 0 },
                            uTextureSize: { value: textureSize },
                            uTexture: { value: texture },
                            uMouse: { value: mouseReset },
                            uStartTime: { value: 0 }
                        },
                        vertexShader,
                        fragmentShader
                    }
                ]}
                uniforms-uRandom-value={shaderSpring.uRandom}
                uniforms-uSize-value={shaderSpring.uSize}
                uniforms-uDepth-value={shaderSpring.uDepth}
            />
        </mesh>
    );
}

export default Particles;
