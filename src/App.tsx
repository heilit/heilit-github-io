import { Canvas } from '@react-three/fiber';
import { Scroll, ScrollControls } from '@react-three/drei';
import Smoke from './Components/Smoke';
import Hologram from './Components/Hologram';
import HoneyComb from './Components/HoneyComb';
import Info from './Components/Info';
import './App.css';

function App() {
    return (
        <div id='canvas-container'>
            <Canvas camera={{ position: [0, 0, 200], far: 1000 }}>
                <color attach='background' args={['#0f0f0f']} />
                <ambientLight args={['#ffffff', 0.1]} />
                <ScrollControls pages={3} damping={8}>
                    <Scroll>
                        <Smoke />
                        <HoneyComb vh={1.3} />
                        <Hologram vh={2.05} />
                    </Scroll>
                    <Scroll html>
                        <Info />
                    </Scroll>
                </ScrollControls>
            </Canvas>
        </div>
    );
}

export default App;
