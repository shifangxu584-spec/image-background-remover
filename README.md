# Image Background Remover - MVP 需求文档

## 1. 项目概述

**项目名称：** Image Background Remover  
**技术栈：** Next.js 14 + Tailwind CSS + TypeScript  
**核心功能：** AI 智能去除图片背景  
**目标用户：** 设计师、电商运营、自媒体创作者

---

## 2. 功能需求

### 2.1 图片上传

- [x] 支持拖拽上传图片
- [x] 支持点击选择图片文件
- [x] 支持 JPG、PNG、WebP 格式
- [x] 图片预览功能

### 2.2 背景去除

- [x] 调用阿里云视觉智能开放平台 API
- [x] 返回透明背景 PNG 图片
- [x] 处理中 Loading 状态

### 2.3 结果展示

- [x] 去除背景后的图片预览
- [x] 背景透明效果可视化（棋盘格背景）
- [x] 一键下载结果图片

### 2.4 API 配置

- [x] 用户可通过界面输入 API Key
- [x] 支持环境变量配置

---

## 3. 页面结构

```
/                       # 首页
├── Hero 区域           # 标题 + 描述
├── API Key 输入        # 阿里云 API Key 配置
├── 图片上传区          # 拖拽/点击上传
├── 处理按钮            # 触发背景去除
└── 结果展示区          # 预览 + 下载

/api/remove-background  # 后端 API 接口
```

---

## 4. API 接口

### POST /api/remove-background

**请求：**
- Content-Type: `multipart/form-data`
- Body: `image` (图片文件)
- Header: `x-api-key` (API Key)

**响应：**
- 成功：返回 PNG 图片（二进制）
- 失败：返回 JSON 错误信息

---

## 5. 界面设计

### 配色方案
- 主背景：深色渐变 (slate-900 → purple-900)
- 强调色：紫色/粉色渐变
- 文字：白色/灰色

### 交互
- 拖拽区域：虚线边框，hover 时高亮
- 按钮：渐变背景，hover 动画
- 结果区：棋盘格背景展示透明效果

---

## 6. 环境配置

```bash
# .env.local
ALIBABA_CLOUD_API_KEY=your-api-key
```

**获取 API Key：**
访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/)

---

## 7. 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入 API Key

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

---

## 8. 后续迭代

- [ ] 批量处理多张图片
- [ ] 历史记录功能
- [ ] 多种输出格式（PNG/JPG/WebP）
- [ ] 自定义输出尺寸
- [ ] 用户登录/历史记录云端同步
