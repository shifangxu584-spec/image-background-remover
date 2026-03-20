# Image Background Remover

AI-powered tool to remove backgrounds from images.

## 功能需求

1. **API 接入**
   - 接入阿里云视觉智能开放平台的背景抠图 API
   - 支持 HTTPS 请求

2. **图片处理**
   - 支持 JPG、PNG、WebP 等常见图片格式
   - 输入图片，输出透明背景的图片

3. **批量处理**
   - 支持批量处理多张图片
   - 支持指定输入/输出目录

4. **Web 界面**
   - 提供 Web 上传界面
   - 支持拖拽上传
   - 支持预览和下载

## 技术栈

- Next.js 14+
- Tailwind CSS
- 阿里云视觉智能开放平台 API

## 快速开始

### 安装

```bash
npm install
```

### 配置

设置环境变量：

```bash
# .env.local
ALIBABA_CLOUD_API_KEY=your-api-key
```

### 运行

```bash
npm run dev
```

打开 http://localhost:3000 使用。

## API

### POST /api/remove-background

移除图片背景

**请求：**

```bash
curl -X POST http://localhost:3000/api/remove-background \
  -F "image=@input.jpg" \
  -H "x-api-key: your-api-key"
```

**响应：**

返回透明背景的 PNG 图片（二进制）
