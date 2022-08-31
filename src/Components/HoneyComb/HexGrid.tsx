import { useLoader } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import { InstancedMesh, TextureLoader, Object3D } from 'three';
import { fragmentShader, vertexShader } from '../../shaders/hexagon';

const getHexPosition = (index: number, arrayLength: number) => {
    const center = Math.floor(arrayLength * 0.5);
    return index - center;
};

const mapAtlas = () => {
    const gridSize = 5;
    const icons = [
        'js',
        'react',
        'ts',
        'node',
        'angular',
        'three',
        'go',
        'git',
        'figma',
        'html',
        'docker',
        'mongo',
        'postgres',
        'vscode',
        'python',
        'sass',
        'graph',
        'socket',
        'jest',
        'fill',
        'bash',
        'redis'
    ] as const;

    const iconsData = {};
    let row = 1;
    for (let i = 0; i < icons.length; i++) {
        Object.assign(iconsData, {
            [icons[i]]: [i % gridSize, gridSize - row]
        });
        if (i % gridSize === gridSize - 1) row++;
    }

    return iconsData as { [K in typeof icons[number]]: number[] };
};

const createHexGrid = (radius: number) => {
    const rad = Math.PI / 6;
    const xOff = Math.cos(rad) * (radius + 0.5);
    const yOff = Math.sin(rad) * (radius + 0.5);
    const tex = mapAtlas();
    const textures: number[][][] = [
        [tex.go, tex.mongo, tex.docker, tex.postgres, tex.vscode, tex.jest],
        [tex.graph, tex.python, tex.three, tex.js, tex.ts, tex.git, tex.bash],
        [tex.html, tex.sass, tex.node, tex.react, tex.figma, tex.socket]
    ];

    return textures
        .map((col, colIndex) =>
            col.map((row, rowIndex) => {
                const rowPosition = getHexPosition(rowIndex, col.length);
                const colPosition = getHexPosition(colIndex, textures.length);
                const x = rowPosition * xOff * 2 + (colPosition % 2 === 0 ? 0 : xOff);
                const y = colPosition * yOff * 3;
                return {
                    texIdx: row,
                    position: [x, y, 0]
                };
            })
        )
        .flat(1);
};

function HexGrid({ hexRadius }: { hexRadius: number }) {
    const hexRef = useRef<InstancedMesh>(null!);
    const spriteTexture = useLoader(TextureLoader, '../../assets/sprites.png');
    const hexGrid = useMemo(() => createHexGrid(hexRadius), [hexRadius]);

    useEffect(() => {
        const temp = new Object3D();

        for (let i = 0; i < hexGrid.length; i++) {
            const pos = hexGrid[i].position;
            temp.scale.set(hexRadius, 1, hexRadius);
            temp.position.set(pos[0], pos[1], pos[2]);
            temp.rotation.set(-Math.PI * 0.5, 0, 0);
            temp.updateMatrix();
            hexRef.current.setMatrixAt(i, temp.matrix);
        }

        hexRef.current.instanceMatrix.needsUpdate = true;
    }, [hexGrid]);

    return (
        <instancedMesh
            name='hexGrid'
            ref={hexRef}
            args={[undefined, undefined, hexGrid.length]}>
            <cylinderBufferGeometry args={[1, 1, 1, 6]}>
                <instancedBufferAttribute
                    attach='attributes-texIdx'
                    args={[new Int8Array(hexGrid.map(({ texIdx }) => texIdx).flat(1)), 2]}
                />
            </cylinderBufferGeometry>
            <meshStandardMaterial
                roughness={0.25}
                metalness={0.8}
                color={'#3d3d3d'}
                onBeforeCompile={shader => {
                    shader.uniforms.texAtlas = {
                        value: spriteTexture
                    };
                    shader.vertexShader = vertexShader(shader.vertexShader);
                    shader.fragmentShader = fragmentShader(shader.fragmentShader);
                }}
            />
        </instancedMesh>
    );
}

export default HexGrid;
