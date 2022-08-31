import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import GridBacklight from './GridBacklight';
import GridSpotlight from './GridSpotlight';
import HexGrid from './HexGrid';

const maxRadius = 16;
function HoneyComb({ vh }: { vh: number }) {
    const { height, width } = useThree(state => state.viewport);
    const [hexRadius, setHexRadius] = useState<number>(maxRadius);

    useEffect(() => {
        const newRadius = Math.min(Math.floor(width / 7) * 0.5, maxRadius);
        setHexRadius(newRadius);
    }, [width]);

    return (
        <>
            <GridSpotlight hexRadius={hexRadius} vh={vh} />
            <group name='honeyCombGroup' position={[0, -height * vh, 0]}>
                <GridBacklight hexRadius={hexRadius} />
                <HexGrid hexRadius={hexRadius} />
            </group>
        </>
    );
}

export default HoneyComb;
