import React from 'react';

const ArduinoUno = ({ position = [0, 0, 0], ...props }) => {
  return (
    <group position={position} {...props}>
      {/* Main board */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      
      {/* USB port */}
      <mesh position={[-0.04, 0.02, 0.04]}>
        <boxGeometry args={[0.02, 0.015, 0.01]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      
      {/* Pins */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[0.08, 0.02, -0.03 + i * 0.005]}>
          <cylinderGeometry args={[0.002, 0.002, 0.03]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      ))}
    </group>
  );
};

export default ArduinoUno;