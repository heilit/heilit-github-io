import { animated, useSpring } from '@react-spring/three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, Vector3 } from 'three';
import { Text } from '@react-three/drei';
import easings from '../utils/easings';
import { useMemo } from 'react';

const initSmokeCloud = () => {
    const cloud: { position: Vector3 }[] = [];
    const density = 70;

    for (let i = 0; i < density; i++) {
        cloud.push({
            position: new Vector3(
                Math.random() * 700 - 350,
                Math.random() * 500 - 250,
                Math.random() * 600 - 100
            )
        });
    }

    return cloud;
};

function Smoke() {
    const [cloudTexture, smokeTexture] = useLoader(TextureLoader, [
        '../../assets/cloud.png',
        '../../assets/smoke.png'
    ]);
    const smokeClouds = useMemo(() => initSmokeCloud(), []);

    const introSpring = useSpring({
        from: { 'position-z': -100 },
        to: { 'position-z': 100 },
        config: { duration: 1800, easing: easings.easeOutQuad }
    });

    const cloudSpring = useSpring({
        from: { 'rotation-z': 0 },
        to: { 'rotation-z': 2 * Math.PI },
        loop: true,
        config: { duration: 30000 }
    });

    const cloudGroupSpring = useSpring({
        from: { 'position-x': 20 },
        to: { 'position-x': -20 },
        loop: { reverse: true },
        config: { duration: 7000, easing: easings.easeInOutQuad }
    });

    return (
        <animated.group name='smokeGroup' scale={0.4} {...introSpring}>
            <mesh name='smokeText' position-z={100}>
                <Text
                    fontSize={15}
                    font={'../../assets/font.ttf'}
                    letterSpacing={0.6}
                    color='#00dddd'
                    anchorX='center'
                    outlineBlur={6}
                    outlineOpacity={0.25}
                    outlineColor={'#00cccc'}
                    anchorY='middle'>
                    hello
                </Text>
            </mesh>
            <animated.group {...cloudGroupSpring} name='smokeClouds'>
                {smokeClouds.map((cloud, index) => (
                    <animated.mesh key={index} {...cloud} {...cloudSpring}>
                        <planeGeometry args={[300, 300]} />
                        <meshStandardMaterial
                            color={'#00cccc'}
                            map={index % 2 ? smokeTexture : cloudTexture}
                            opacity={0.7}
                            transparent={true}
                        />
                    </animated.mesh>
                ))}
            </animated.group>
        </animated.group>
    );
}

export default Smoke;
