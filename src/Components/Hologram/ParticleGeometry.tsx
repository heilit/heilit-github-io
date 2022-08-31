import { useMemo } from 'react';

const initPoints = (image: HTMLImageElement) => {
    const imageData = Float32Array.from(getImageData(image));
    const totalPoints = image.width * image.height;
    const transparency = 120;
    let imagePoints = 0;

    for (let i = 0; i < totalPoints; i++) {
        if (imageData[i * 4] > transparency) imagePoints++;
    }

    const halfWidth = image.width * 0.5;
    const position = new Float32Array([
        -halfWidth,
        image.height,
        0,
        halfWidth,
        image.height,
        0,
        -halfWidth,
        0,
        0,
        halfWidth,
        0,
        0
    ]);
    const index = new Uint16Array([0, 2, 1, 2, 3, 1]);
    const pointIndex = new Uint16Array(imagePoints);
    const pointPosition = new Float32Array(imagePoints * 3);

    for (let i = 0, shownIdx = 0; i < totalPoints; i++) {
        if (imageData[i * 4] <= transparency) continue;

        pointPosition[shownIdx * 3 + 0] = Math.floor(i % image.width);
        pointPosition[shownIdx * 3 + 1] = Math.floor(i / image.width);

        pointIndex[shownIdx] = i;

        shownIdx++;
    }

    return {
        position,
        index,
        pointIndex,
        pointPosition
    };
};

const getImageData = (image: HTMLImageElement) => {
    const { width, height } = image;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) throw new Error('image canvas context not loaded');

    canvas.width = width;
    canvas.height = height;
    context.scale(1, -1);
    context.drawImage(image, 0, 0, width, height * -1);

    return context.getImageData(0, 0, width, height).data;
};

function ParticleGeometry({ texture }: { texture: HTMLImageElement }) {
    const pointsData: {
        position: Float32Array;
        index: Uint16Array;
        pointIndex: Uint16Array;
        pointPosition: Float32Array;
    } = useMemo(() => initPoints(texture), [texture]);

    return (
        <instancedBufferGeometry>
            <bufferAttribute attach='index' args={[pointsData.index, 1]} />
            <bufferAttribute
                attach='attributes-position'
                args={[pointsData.position, 3]}
            />
            <instancedBufferAttribute
                attach='attributes-pindex'
                args={[pointsData.pointIndex, 1]}
            />
            <instancedBufferAttribute
                attach='attributes-pposition'
                args={[pointsData.pointPosition, 3]}
            />
            <bufferAttribute
                attach='attributes-uvx'
                args={[new Uint16Array([0, 1, 1, 1, 0, 0, 1, 0]), 2]}
            />
        </instancedBufferGeometry>
    );
}

export default ParticleGeometry;
