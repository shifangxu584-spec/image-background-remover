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

4. **命令行工具**
   - 提供 CLI 界面
   - 支持参数：输入路径、输出路径、API Key

## 使用示例

```bash
python remove_bg.py --input ./input.jpg --output ./output.png --api-key YOUR_API_KEY
```

## 技术栈

- Python 3.8+
- 阿里云视觉智能开放平台 API
- Pillow 图片处理

## 安装

```bash
pip install -r requirements.txt
```

## 配置

设置环境变量或通过命令行传入 API Key：

```bash
export ALIBABA_CLOUD_API_KEY="your-api-key"
```
