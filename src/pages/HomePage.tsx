import React, { useState, useRef, useEffect } from 'react';
import Canvas from '../components/Canvas';
import CanvasTools from '../components/CanvasTools';
import { analyzeImage, saveGameResult, getGameStats } from '../utils/api';
import './HomePage.css';

interface DrawingPath {
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
}

interface GameHistoryItem {
  drawing: string;
  guess: string;
  correct: boolean;
  timestamp: string;
}

const HomePage: React.FC = () => {
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [aiGuess, setAiGuess] = useState('等待AI猜测...');
  const [score, setScore] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const canvasRef = useRef<{ clearCanvas: () => void; undo: () => void; getCanvasImage: () => string } | null>(null);

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const handleLineWidthChange = (width: number) => {
    setLineWidth(width);
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setAiGuess('等待AI猜测...');
    handleClearCanvas();
  };

  const handleSubmitGuess = async () => {
    if (!gameStarted || !canvasRef.current) return;

    setIsSubmitting(true);
    setAiGuess('AI正在思考中...');
    setConfidence(null);

    try {
      // 获取画布图像数据
      const drawingImage = canvasRef.current.getCanvasImage();
      
      // 调用API分析图像
      const response = await analyzeImage(drawingImage);
      
      if (response.success && response.data) {
        const { guess, confidence: apiConfidence, isCorrect, timestamp } = response.data;
        
        setAiGuess(guess);
        setConfidence(apiConfidence);
        
        // 更新游戏历史
        setGameHistory([
          ...gameHistory,
          { drawing: drawingImage, guess, correct: isCorrect, timestamp }
        ]);
        
        // 如果猜测正确，增加分数
        if (isCorrect) {
          setScore(score + 10);
        }
        
        // 保存游戏结果到服务器
        await saveGameResult({
          drawing: drawingImage,
          guess,
          isCorrect
        });
      } else {
        setAiGuess(response.message || 'AI猜测失败');
      }
    } catch (error) {
      console.error('Error submitting guess:', error);
      setAiGuess('猜测出错，请检查网络连接');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>AI 你画我猜</h1>
        <p>在画布上作画，让AI猜测你画的是什么</p>
      </header>
      
      <main className="main-content">
        <div className="game-container">
          <div className="canvas-container">
            <Canvas ref={canvasRef} />
          </div>
          
          <div className="tools-container">
            <CanvasTools
              currentColor={currentColor}
              lineWidth={lineWidth}
              onColorChange={handleColorChange}
              onLineWidthChange={handleLineWidthChange}
              onClearCanvas={handleClearCanvas}
              onUndo={handleUndo}
            />
          </div>
          
          <div className="controls-container">
            <h3>游戏控制</h3>
            <div className="control-buttons">
              <button className="btn btn-primary" onClick={handleStartGame}>
                开始游戏
              </button>
              <button className="btn btn-secondary" onClick={handleClearCanvas}>
                清空画布
              </button>
              <button className="btn btn-success" onClick={handleSubmitGuess} disabled={!gameStarted}>
                提交猜测
              </button>
            </div>
          </div>
          
          <div className="result-container">
            <h3>AI 猜测结果</h3>
            <div className="result-display">
              {isSubmitting ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>AI正在思考中...</p>
                </div>
              ) : (
                <div className="guess-result">
                  <p className="guess-text">{aiGuess}</p>
                  {confidence !== null && (
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${confidence}%` }}
                      ></div>
                      <span className="confidence-text">置信度: {confidence}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="side-panel">
          <div className="history-panel">
            <h3>游戏历史</h3>
            <div className="history-list">
              {gameHistory.length === 0 ? (
                <p>暂无历史记录</p>
              ) : (
                <ul className="history-list-items">
                  {gameHistory.slice(-5).reverse().map((item, index) => (
                    <li key={index} className="history-item">
                      <div className="history-guess">
                        {item.guess}
                        <span className={`status-icon ${item.correct ? 'correct' : 'incorrect'}`}>
                          {item.correct ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="history-time">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="score-panel">
            <h3>得分</h3>
            <div className="score-display">
              当前得分: {score}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2025 AI 你画我猜游戏</p>
      </footer>
    </div>
  );
};

export default HomePage;