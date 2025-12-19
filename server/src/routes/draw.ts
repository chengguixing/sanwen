import express from 'express';
import { analyzeImage, getGameStats, saveGameResult } from '../controllers/drawController';

const router = express.Router();

// 分析图像并返回AI猜测
router.post('/analyze', analyzeImage);

// 获取游戏统计信息
router.get('/stats', getGameStats);

// 保存游戏结果
router.post('/result', saveGameResult);

export default router;