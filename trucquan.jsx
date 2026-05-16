import React, { useRef, useEffect } from 'react';
import Blockly from 'blockly';
import 'blockly/blocks';
import toolbox from './toolbox.xml';
import { generateArduinoCode } from '../../utils/codeGenerator';

const BlocklyEditor = ({ onCodeChange }) => {
  const blocklyRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (blocklyRef.current && !workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyRef.current, {
        toolbox: toolbox,
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        },
        theme: Blockly.Themes.Dark
      });

      // Custom blocks
      defineCustomBlocks();

      workspaceRef.current.addChangeListener(() => {
        const code = generateArduinoCode(workspaceRef.current);
        onCodeChange(code);
      });
    }

    return () => {
      if (workspaceRef.current) {
        Blockly.dispose(workspaceRef.current);
        workspaceRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div 
      className="glass h-[500px] rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={blocklyRef} className="w-full h-full" />
    </motion.div>
  );
};

// Custom blocks definition
const defineCustomBlocks = () => {
  Blockly.Blocks['led_on'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Turn LED")
          .appendField(new Blockly.FieldDropdown([["ON", "HIGH"], ["OFF", "LOW"]]), "STATE")
          .appendField("on pin")
          .appendField(new Blockly.FieldNumber(13, 2, 13), "PIN");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Turn LED on/off");
    }
  };

  Blockly.Arduino['led_on'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    return `digitalWrite(${pin}, ${state});\n`;
  };

  // More blocks: delay, if-else, sensor, servo...
};

export default BlocklyEditor;