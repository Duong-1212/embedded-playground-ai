import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Breadboard = ({ position = [0, 0, 0] }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[4, 0.1, 2]} />
      <meshStandardMaterial 
        color="#D1D5DB" 
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
};

export default Breadboard;