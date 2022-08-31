import { ScrollControlsState, useScroll } from '@react-three/drei';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { DirectionalLight } from 'three';

function GridSpotlight({ hexRadius, vh }: { hexRadius: number; vh: number }) {
    const { height, width } = useThree(state => state.viewport);
    const scrollData: ScrollControlsState & { scroll?: { current: number } } =
        useScroll();
    const lightRef = useRef<DirectionalLight>(null!);

    useFrame(() => {
        const pos = Math.max(
            Math.min(
                (scrollData.scroll?.current || 0) * -height * (scrollData.pages - 1),
                -height * vh + hexRadius * 6
            ),
            -height * vh - hexRadius * 6
        );
        lightRef.current.position.setY(pos);
    });

    const handleMouseMove = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const { point } = e;
        lightRef.current.target.position.set(-point.x, -point.y, 0);
        lightRef.current.target.updateMatrixWorld();
        lightRef.current.visible = true;
    };

    const handleMouseOut = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        lightRef.current.visible = false;
    };

    return (
        <group name='gridSpotlight'>
            <directionalLight position-z={200} ref={lightRef} args={['#ffffff', 0.1]} />
            <mesh
                position={[0, -height * vh, 0]}
                onPointerMove={e => handleMouseMove(e)}
                onPointerLeave={e => handleMouseOut(e)}>
                <planeGeometry args={[width, hexRadius * 3 * 2]} />
                <meshBasicMaterial opacity={0} transparent={true} />
            </mesh>
        </group>
    );
}

export default GridSpotlight;
