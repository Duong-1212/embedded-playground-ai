export const checkCircuitErrors = (components, wires) => {
  const errors = [];

  // Check 1: LED without resistor
  const leds = components.filter(c => c.type === 'LED');
  leds.forEach(led => {
    const hasResistor = wires.some(wire => 
      wire.start.includes('led') && wire.end.includes('resistor')
    );
    if (!hasResistor) {
      errors.push({
        type: 'MISSING_RESISTOR',
        message: '⚠️ LED cần điện trở nối tiếp (220Ω-1kΩ) để tránh cháy linh kiện!',
        componentId: led.id,
        fix: 'Kéo thả điện trở giữa chân dương LED và nguồn 5V'
      });
    }
  });

  // Check 2: Missing GND connection
  const hasGND = wires.some(wire => wire.end.includes('GND'));
  if (!hasGND) {
    errors.push({
      type: 'MISSING_GND',
      message: '⚠️ Mạch thiếu kết nối GND! Tất cả mạch cần GND để hoàn thành vòng kín.',
      fix: 'Kết nối chân GND của Arduino với ray GND trên breadboard'
    });
  }

  // Check 3: Overloaded power rail
  const powerConnections = wires.filter(wire => 
    wire.start.includes('5V') || wire.end.includes('5V')
  );
  if (powerConnections.length > 8) {
    errors.push({
      type: 'OVERLOAD',
      message: '⚠️ Nguồn 5V có quá nhiều linh kiện! Có nguy cơ quá tải.',
      fix: 'Sử dụng nguồn ngoài hoặc giảm số linh kiện'
    });
  }

  return errors;
};