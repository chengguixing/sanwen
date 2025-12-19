# AI 你画我猜网页游戏

这是一个在线你画我猜游戏，玩家可以在画布上作画，AI 系统负责猜测画的是什么内容。

## 技术栈

- **脚手架**: Vite
- **前端**: React + TypeScript
- **画布**: HTML5 Canvas
- **后端**: Node.js + Express
- **AI 集成**: OpenAI Vision API (模拟实现)

## 项目结构

```
sanwen/
├── src/                   # 前端源代码
│   ├── components/        # React 组件
│   │   ├── Canvas.tsx     # 画布组件
│   │   └── CanvasTools.tsx # 画布工具组件
│   ├── pages/             # 页面组件
│   │   └── HomePage.tsx   # 主页面
│   ├── utils/             # 工具函数
│   │   └── api.ts         # API 请求封装
│   └── ...                # 其他前端文件
├── server/                # 后端源代码
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── middleware/    # 中间件
│   │   ├── routes/        # 路由
│   │   └── index.ts       # 服务器入口
│   └── ...                # 其他后端文件
└── task.md               # 任务列表
```

## 快速开始

### 前端启动

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 在浏览器中打开 `http://localhost:5173`

### 后端启动

1. 进入服务器目录：
   ```bash
   cd server
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 构建项目：
   ```bash
   npm run build
   ```

4. 启动服务器：
   ```bash
   npm start
   ```

5. 服务器将在 `http://localhost:3001` 运行

## 游戏玩法

1. 点击"开始游戏"按钮开始新游戏
2. 在画布上绘制任何图像
3. 使用工具栏调整画笔颜色和大小
4. 点击"提交猜测"按钮，让AI猜测你画的是什么
5. 查看AI的猜测结果和置信度
6. 在右侧查看游戏历史和得分

## 功能特性

- ✅ 基本绘画功能（线条、颜色、画笔大小）
- ✅ 画布工具（颜色选择、画笔大小、清空、撤销）
- ✅ 游戏控制（开始游戏、提交猜测）
- ✅ AI 猜测模拟（使用模拟数据）
- ✅ 游戏历史记录
- ✅ 得分系统
- ✅ 响应式设计

## 未来计划

- [ ] 集成真实的 OpenAI Vision API
- [ ] 添加游戏计时功能
- [ ] 实现难度级别和词语提示
- [ ] 添加游戏音效和视觉反馈
- [ ] 优化用户体验
- [ ] 添加单元测试和端到端测试
- [ ] 部署到云服务

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT