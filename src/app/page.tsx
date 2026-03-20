'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setResultImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    setProgress('Loading AI model...');
    try {
      // Convert base64 to blob
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'image.png');

      setProgress('Processing... (first time may take longer to download model)');
      
      const apiResponse = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        const error = await apiResponse.json();
        throw new Error(error.error || 'Failed to process');
      }

      const resultBlob = await apiResponse.blob();
      const url = URL.createObjectURL(resultBlob);
      setResultImage(url);
      setProgress('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process image');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'removed-bg.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          🖼️ Image Background Remover
        </h1>
        <p className="text-center text-slate-400 mb-8">
          AI-powered background removal using local AI model
        </p>

        <div className="max-w-2xl mx-auto mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-sm text-slate-300">
            💡 <strong>No API Key needed!</strong> This version uses a local AI model.
            First time processing may take longer to download the model.
          </p>
        </div>

        <div
          className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            dragOver
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-slate-700 hover:border-slate-600'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {originalImage ? (
            <div className="space-y-4">
              <img
                src={originalImage}
                alt="Original"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <p className="text-slate-400">Original Image</p>
              <button
                onClick={() => {
                  setOriginalImage(null);
                  setResultImage(null);
                }}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Choose Another Image
              </button>
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-lg text-slate-300 mb-2">
                Drag & drop an image here
              </p>
              <p className="text-slate-500">or click to browse</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {originalImage && (
          <div className="max-w-2xl mx-auto mt-8">
            <button
              onClick={handleRemoveBackground}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {progress || 'Processing...'}
                </span>
              ) : (
                '✨ Remove Background'
              )}
            </button>
          </div>
        )}

        {resultImage && (
          <div className="max-w-2xl mx-auto mt-8 space-y-4">
            <div className="relative">
              <img
                src={resultImage}
                alt="Result"
                className="max-h-64 mx-auto rounded-lg shadow-lg bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMhYCiD4WtAHD6XAtDgcMyCgUsdAAlKVTk46xT9H0MxcDwfM+YGcY+UA8D4B2XwD6lZ9pFoAAAAASUVORK5CYII=')]"
              />
              <p className="text-center text-slate-400 mt-2">
                Result (Transparent Background)
              </p>
            </div>
            <button
              onClick={downloadResult}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all"
            >
              ⬇️ Download Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
