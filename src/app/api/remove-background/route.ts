import { NextRequest, NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert File to Blob
    const arrayBuffer = await imageFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: imageFile.type });

    // Remove background using local AI model
    const resultBlob = await removeBackground(blob, {
      progress: (key, current, total) => {
        console.log(`Downloading model: ${key} - ${current}/${total}`);
      }
    });

    // Convert Blob to Buffer
    const arrayBufferResult = await resultBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBufferResult);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-bg.png"',
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    );
  }
}
