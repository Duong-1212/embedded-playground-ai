import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Breadboard from './components/Breadboard';
import ArduinoUno from './components/ArduinoUno';
import ESP32 from './components/ESP32';
import LED from './components/LED';
import Resistor from './components/Resistor';
import Wire from './components/Wire';
import { useCircuitStore } from '../../stores/circuitStore';

const CircuitScene = () => {
  const { components, wires, addComponent, addWire } = useCircuitStore();
  const [hovered, setHovered] = useState(null);
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ContactShadows 
        position={[0, -1, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={1} 
        far={0.8} 
      />
      
      {/* Components */}
      {components.map((comp, i) => {
        const Comp = comp.type;
        return (
          <Comp
            key={comp.id}
            position={comp.position}
            rotation={comp.rotation}
            onClick={() => console.log('Component clicked:', comp)}
            onPointerOver={() => setHovered(comp.id)}
            onPointerOut={() => setHovered(null)}
          />
        );
      })}
      
      {/* Wires */}
      {wires.map((wire) => (
        <Wire key={wire.id} start={wire.start} end={wire.end} color={wire.color} />
      ))}
      
      <Breadboard position={[0, 0, 0]} />
      <ArduinoUno position={[-2, 0, 0]} />
      <ESP32 position={[2, 0, 0]} />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
      
      <Environment preset="city" />
    </>
  );
};

const CircuitSimulator = ({ className }) => {
  return (
    <motion.div 
      className={`glass w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        shadows
      >
        <CircuitScene />
      </Canvas>
    </motion.div>
  );
};

export default CircuitSimulator;