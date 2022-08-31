import { animated, useSpring } from '@react-spring/three';
import { useLoader } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { TextureLoader, Group } from 'three';

function GridBacklight({ hexRadius }: { hexRadius: number }) {
    const hexLightsRef = useRef<Group>(null!);
    const [haloTexture, donutTexture] = useLoader(TextureLoader, [
        '../../assets/halo.png',
        '../../assets/donut.png'
    ]);

    const lightDonutSpring = useSpring({
        from: { 'scale-x': 0.8, 'scale-y': 0.8 },
        to: { 'scale-x': 2.4, 'scale-y': 2.4 },
        loop: { reverse: true },
        config: { duration: 3000 }
    });
    const lightHaloSpring = useSpring({
        from: { 'scale-x': 0.8, 'scale-y': 0.8 },
        to: [
            { 'scale-x': 6.7, 'scale-y': 2.4 },
            { 'scale-x': 0.8, 'scale-y': 0.8 }
        ],
        loop: { reverse: true },
        config: { duration: 6000 },
        delay: 2500
    });

    useEffect(() => {
        hexLightsRef.current.scale.set(hexRadius * 2, hexRadius * 2, 1);
    }, [hexRadius]);

    return (
        <group name='gridBacklight' ref={hexLightsRef}>
            <animated.mesh {...lightDonutSpring} position={[0, 0, -1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial
                    color={'#c07300'}
                    map={donutTexture}
                    transparent={true}
                />
            </animated.mesh>
            <animated.mesh {...lightHaloSpring} position={[0, 0, -2]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial
                    color={'#c07300'}
                    map={haloTexture}
                    transparent={true}
                />
            </animated.mesh>
        </group>
    );
}

export default GridBacklight;
