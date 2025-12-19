import React, { useState } from 'react';
import './CanvasTools.css';

interface CanvasToolsProps {
  currentColor: string;
  lineWidth: number;
  onColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onClearCanvas: () => void;
  onUndo: () => void;
}

const CanvasTools: React.FC<CanvasToolsProps> = ({
  currentColor,
  lineWidth,
  onColorChange,
  onLineWidthChange,
  onClearCanvas,
  onUndo
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const presetColors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#A52A2A', '#808080'
  ];

  return (
    <div className="canvas-tools">
      <div className="tool-group">
        <h4>颜色</h4>
        <div className="color-picker-container">
          <button 
            className="color-display"
            style={{ backgroundColor: currentColor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && (
            <div className="color-palette">
              {presetColors.map(color => (
                <button
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onColorChange(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="tool-group">
        <h4>画笔大小: {lineWidth}px</h4>
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => onLineWidthChange(Number(e.target.value))}
          className="line-width-slider"
        />
      </div>
      
      <div className="tool-group">
        <h4>操作</h4>
        <div className="action-buttons">
          <button className="tool-btn undo-btn" onClick={onUndo}>
            撤销
          </button>
          <button className="tool-btn clear-btn" onClick={onClearCanvas}>
            清空
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasTools;