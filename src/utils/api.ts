const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AnalyzeImageResponse {
  success: boolean;
  data?: {
    guess: string;
    confidence: number;
    isCorrect: boolean;
    timestamp: string;
  };
  message?: string;
}

export interface GameStatsResponse {
  success: boolean;
  data?: {
    totalGames: number;
    correctGuesses: number;
    averageConfidence: number;
    mostDrawnItems: string[];
  };
  message?: string;
}

export interface SaveGameResultRequest {
  drawing: string;
  guess: string;
  isCorrect: boolean;
}

export interface SaveGameResultResponse {
  success: boolean;
  message?: string;
}

// 分析图像并获取AI猜测
export const analyzeImage = async (imageData: string): Promise<AnalyzeImageResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/draw/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    return {
      success: false,
      message: '网络请求失败，请检查后端服务是否运行'
    };
  }
};

// 获取游戏统计信息
export const getGameStats = async (): Promise<GameStatsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/draw/stats`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    return {
      success: false,
      message: '获取游戏统计失败'
    };
  }
};

// 保存游戏结果
export const saveGameResult = async (data: SaveGameResultRequest): Promise<SaveGameResultResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/draw/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    return {
      success: false,
      message: '保存游戏结果失败'
    };
  }
};