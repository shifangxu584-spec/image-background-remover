import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export const dynamic = 'force-dynamic';

interface AlibabaCloudResponse {
  Data?: {
    ImageURL?: string;
  };
  Code?: string;
  Message?: string;
}

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const apiKey = request.headers.get('x-api-key') || process.env.ALIBABA_CLOUD_API_KEY;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    // Convert image to base64
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageFormat = image.type.split('/')[1] || 'jpg';
    const mimeType = image.type || 'image/jpeg';

    // Call Alibaba Cloud API
    const requestData = JSON.stringify({
      imageURL: `data:${mimeType};base64,${base64Image}`,
      imageFormat: imageFormat === 'jpeg' ? 'jpg' : imageFormat,
    });

    const apiOptions = {
      hostname: 'vision.cn-hangzhou.aliyuncs.com',
      path: '/api/v1/recognition/background_removal',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        'X-Auth-Token': `APITOKEN:${apiKey}`,
      },
    };

    const result = await new Promise<Buffer>((resolve, reject) => {
      const req = https.request(apiOptions, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      });
      req.on('error', reject);
      req.write(requestData);
      req.end();
    });

    const response: AlibabaCloudResponse = JSON.parse(result.toString());

    if (response.Code && response.Code !== 'Success') {
      return NextResponse.json(
        { error: response.Message || 'API error' },
        { status: 500 }
      );
    }

    if (!response.Data?.ImageURL) {
      return NextResponse.json({ error: 'No result image' }, { status: 500 });
    }

    // Download result image
    const resultImage = await downloadImage(response.Data.ImageURL);

    return new NextResponse(resultImage, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
