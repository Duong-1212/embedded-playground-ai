import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RealtimeDashboard = () => {
  const [data, setData] = React.useState({
    temperature: 25.3,
    ledStatus: true,
    cpuUsage: 23,
    memory: 45,
    sensorData: [23, 25, 27, 26, 28]
  });

  const chartData = {
    labels: ['1s', '2s', '3s', '4s', '5s'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.sensorData,
        borderColor: '#A8E6CF',
        backgroundColor: 'rgba(168, 230, 207, 0.2)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {/* Status Cards */}
      <motion.div className="glass-hover p-6 rounded-3xl" whileHover={{ scale: 1.02 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Temperature</p>
            <p className="text-3xl font-bold text-pastel-primary">{data.temperature}°C</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-pastel-primary to-pastel-accent rounded-2xl flex items-center justify-center">
            🔥
          </div>
        </div>
      </motion.div>

      <motion.div className="glass-hover p-6 rounded-3xl" whileHover={{ scale: 1.02 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">LED Status</p>
            <p className="text-3xl font-bold">{data.ledStatus ? 'ON' : 'OFF'}</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg
            ${data.ledStatus ? 'bg-gradient-to-r from-pastel-accent to-orange-400' : 'bg-gray-400'}`}>
            {data.ledStatus ? '●' : '○'}
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div className="glass-hover p-6 rounded-3xl md:col-span-2 lg:col-span-1" whileHover={{ scale: 1.02 }}>
        <p className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">Realtime Sensor Data</p>
        <div className="h-32">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RealtimeDashboard;