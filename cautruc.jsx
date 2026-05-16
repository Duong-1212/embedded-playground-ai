import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/ui/Navbar';
import Sidebar from './components/ui/Sidebar';
import LoadingScreen from './components/ui/LoadingScreen';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Editor from './pages/Editor';
import Games from './pages/Games';
import AIAssistant from './pages/AIAssistant';
import Community from './pages/Community';
import { useWebSocket } from './hooks/useWebSocket';
import { useAuth } from './context/AuthContext';
import './styles/globals.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { connect } = useWebSocket();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    connect(); // Connect WebSocket
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pastel-background via-white to-pastel-primary/20">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed inset-y-0 left-0 z-50"
              >
                <Sidebar setSidebarOpen={setSidebarOpen} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <main className="flex-1 p-6 md:p-12 lg:ml-0 transition-all">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/simulator" element={<Simulator />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/games" element={<Games />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;