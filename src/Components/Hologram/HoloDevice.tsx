import { useSpring, animated } from '@react-spring/three';
import { useScroll } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { Euler, Group, Mesh, TextureLoader } from 'three';

function HoloDevice({ animationRange: range }: { animationRange: [number, number] }) {
    const spinnerRef = useRef<Mesh>(null!);
    const groupRef = useRef<Group>(null!);
    const scrollData = useScroll();
    const texture = useLoader(TextureLoader, '../../assets/hololight.png');

    const [lidSpring, lidApi] = useSpring(() => ({
        from: { 'position-y': -19 },
        delay: 500,
        config: { duration: 750 }
    }));
    const [bloomSpring, bloomApi] = useSpring(() => ({
        from: { 'scale-x': 0.1, 'scale-y': 1.3, 'scale-z': 0.1 },
        delay: 250,
        config: { duration: 750 }
    }));

    var euler = new Euler(0, 1, 0, 'XYZ');
    useFrame(state => {
        spinnerRef.current.position.applyEuler(euler);
        groupRef.current.lookAt(state.camera.position);
        if (scrollData.visible(...range)) {
            lidApi.start({ to: { 'position-y': -17 } });
            bloomApi.start({
                to: { 'scale-x': 1, 'scale-y': 1.1, 'scale-z': 1 }
            });
        }
    });

    const lights = [
        { color: '#91c6ca', width: 60, opacity: 0.8 },
        { color: '#289999', width: 125, opacity: 0.7 },
        { color: '#019b9b', width: 230, opacity: 0.6 }
    ];

    return (
        <group position-y={12} name='holoDevice'>
            <animated.group {...bloomSpring} name='holoLights'>
                {lights.map(light => (
                    <mesh {...light} position={[0, 6, light.opacity]} key={light.width}>
                        <planeGeometry args={[light.width, 50]} />
                        <meshStandardMaterial
                            color={light.color}
                            map={texture}
                            opacity={light.opacity}
                            transparent={true}
                        />
                    </mesh>
                ))}
            </animated.group>

            <group ref={groupRef} name='holoBase'>
                <animated.mesh position={[0, -16, 0]} {...lidSpring}>
                    <cylinderGeometry args={[8, 1, 2, 8]} />
                    <meshBasicMaterial color={'#171c1d'} />
                </animated.mesh>
                <mesh ref={spinnerRef} position={[0, -19, 5]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial color={'#ffffff'} />
                </mesh>
                <mesh position={[0, -20, 0]}>
                    <cylinderGeometry args={[9, 9, 3, 32]} />
                    <meshBasicMaterial color={'#171c1d'} />
                </mesh>
            </group>
        </group>
    );
}
export default HoloDevice;
