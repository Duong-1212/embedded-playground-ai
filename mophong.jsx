import React from 'react';
import CircuitSimulator from '../components/3d/CircuitSimulator';
import BlocklyEditor from '../components/editor/BlocklyEditor';
import ComponentToolbar from '../components/3d/ComponentToolbar';
import ErrorWarnings from '../components/ui/ErrorWarnings';
import RealtimeDashboard from '../components/dashboard/RealtimeDashboard';
import AIAssistant from '../components/ai/AIAssistant';

const Simulator = () => {
  const [generatedCode, setGeneratedCode] = React.useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r 
                      from-pastel-primary via-pastel-accent to-pastel-secondary 
                      bg-clip-text text-transparent mb-4">
          3D Circuit Simulator
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Kéo thả linh kiện, nối dây và lập trình Arduino ngay trên trình duyệt!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Simulator + Toolbar */}
        <div className="space-y-6">
          <ComponentToolbar />
          <CircuitSimulator />
        </div>

        {/* Right: Blockly + Dashboard */}
        <div className="space-y-6 lg:ml-8">
          <BlocklyEditor onCodeChange={setGeneratedCode} />
          <RealtimeDashboard />
        </div>
      </div>

      <ErrorWarnings />
      <AIAssistant />
    </div>
  );
};

export default Simulator;