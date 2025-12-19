import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import './Canvas.css';

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  points: Point[];
  color: string;
  width: number;
}

export interface CanvasRef {
  clearCanvas: () => void;
  undo: () => void;
  getCanvasImage: () => string;
}

const Canvas = forwardRef<CanvasRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawPaths();
      }
    };

    // 初始设置画布大小
    resizeCanvas();

    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    redrawPaths();
  }, [paths]);

  // 重绘所有路径
  const redrawPaths = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制所有路径
    paths.forEach(path => {
      if (path.points.length < 2) return;

      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);

      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }

      ctx.stroke();
    });

    // 绘制当前正在绘制的路径
    if (currentPath && currentPath.points.length > 0) {
      ctx.strokeStyle = currentPath.color;
      ctx.lineWidth = currentPath.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(currentPath.points[0].x, currentPath.points[0].y);

      for (let i = 1; i < currentPath.points.length; i++) {
        ctx.lineTo(currentPath.points[i].x, currentPath.points[i].y);
      }

      ctx.stroke();
    }
  };

  // 获取鼠标/触摸位置
  const getPosition = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // 开始绘制
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const position = getPosition(e);
    
    setIsDrawing(true);
    setCurrentPath({
      points: [position],
      color: currentColor,
      width: lineWidth
    });
  };

  // 绘制过程
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !currentPath) return;

    const position = getPosition(e);
    const updatedPath = {
      ...currentPath,
      points: [...currentPath.points, position]
    };
    
    setCurrentPath(updatedPath);
    redrawPaths();
  };

  // 结束绘制
  const stopDrawing = () => {
    if (isDrawing && currentPath && currentPath.points.length > 1) {
      setPaths([...paths, currentPath]);
    }
    
    setIsDrawing(false);
    setCurrentPath(null);
  };

  // 清空画布
  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath(null);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 撤销上一步
  const undo = () => {
    if (paths.length > 0) {
      setPaths(paths.slice(0, -1));
    }
  };

  // 获取画布图像
  const getCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    return canvas.toDataURL('image/png');
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    clearCanvas,
    undo,
    getCanvasImage
  }));

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
});

export default Canvas;