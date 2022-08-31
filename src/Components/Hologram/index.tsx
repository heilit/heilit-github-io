import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three/src/Three';
import HoloDevice from './HoloDevice';
import Particles from './Particles';

function Hologram({ vh }: { vh: number }) {
    const groupRef = useRef<Group>(null!);
    const { height: h } = useThree(({ viewport }) => viewport);
    const range: [number, number] = [2.7 / 3, 3 / 3];
    return (
        <group ref={groupRef} name='hologramGroup' position={[0, -h * vh, 0]}>
            <Particles animationRange={range} />
            <HoloDevice animationRange={range} />
        </group>
    );
}

export default Hologram;
