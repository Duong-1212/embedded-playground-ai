const WebSocket = require('ws');
const { checkCircuitErrors } = require('../../frontend/src/utils/errorChecker');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'CIRCUIT_UPDATE':
          const errors = checkCircuitErrors(data.components, data.wires);
          ws.send(JSON.stringify({
            type: 'CIRCUIT_ERRORS',
            errors,
            timestamp: Date.now()
          }));
          break;
          
        case 'SIMULATE':
          simulateCircuit(ws, data.circuit);
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
});

const simulateCircuit = (ws, circuit) => {
  // Simulate circuit behavior
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'SIMULATION_RESULT',
      ledStatus: true,
      sensorData: 25.7,
      current: 0.023
    }));
  }, 500);
};

module.exports = wss;