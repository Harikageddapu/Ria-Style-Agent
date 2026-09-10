import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon, X, ArrowRight } from 'lucide-react';
import { SAMPLE_LOOKS } from '../data/zaraCatalog';

interface ImageUploaderProps {
  onImageSelected: (imageData: string, sampleInfo?: any) => void;
  selectedImage: string | null;
  loading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  selectedImage,
  loading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting or closing
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraError(null);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setCameraError('Camera access is not supported by your current browser or preview environment. Please select or drop a photo.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      // Gracefully handle permission dismissal or denial in iframe/preview
      const msg = err?.message || String(err);
      const isPermissionIssue =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        msg.includes('Permission dismissed') ||
        msg.includes('Permission denied') ||
        msg.includes('NotAllowedError');

      if (isPermissionIssue) {
        console.info('Camera permission was dismissed or not granted:', msg);
        setCameraError('Camera permission was dismissed or blocked in this browser preview. You can upload a photo or pick a sample look below.');
      } else {
        console.warn('Camera device could not be opened:', msg);
        setCameraError('Unable to connect to camera device. Please upload an image file or test drive a curated look.');
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      onImageSelected(dataUrl);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {/* If an image is already selected */}
      {selectedImage && !cameraActive ? (
        <div className="relative group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
          <div className="relative h-96 w-full flex items-center justify-center bg-black/40">
            <img
              src={selectedImage}
              alt="Analyzed Clothing"
              className="w-full h-full object-contain max-h-96"
            />
            {loading && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-sm font-editorial tracking-widest text-neutral-200 uppercase">
                  Deconstructing Silhouette & Tone...
                </p>
                <p className="text-xs text-neutral-400">
                  Vision agent running on Gemini Flash
                </p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono tracking-wider uppercase text-neutral-300">
                Active Garment Scan
              </span>
            </div>
            <button
              id="change-garment-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              Upload Different Image
            </button>
          </div>
        </div>
      ) : cameraActive ? (
        /* Camera Stream View */
        <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl p-4">
          <div className="relative aspect-video max-h-[420px] rounded-xl overflow-hidden bg-neutral-900">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Guide overlay box for framing clothing */}
            <div className="absolute inset-8 border border-white/30 border-dashed rounded-lg pointer-events-none flex items-center justify-center">
              <span className="text-xs font-mono uppercase tracking-widest text-white/70 bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                Position Clothing in Frame
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={stopCamera}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              id="capture-photo-btn"
              onClick={capturePhoto}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-transform active:scale-95 shadow-lg"
            >
              <Camera className="w-4 h-4" /> Snap Garment
            </button>
          </div>
        </div>
      ) : (
        /* Upload & Sample Selector View */
        <div className="space-y-6">
          <div
            id="dropzone-clothing"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-white bg-neutral-900/60 scale-[1.01]'
                : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-neutral-200 group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-editorial text-2xl tracking-wide text-neutral-100 font-medium">
                  Drop Clothing Image or Scan Outfit
                </h3>
                <p className="mt-1.5 text-xs text-neutral-400 max-w-md mx-auto">
                  Drag and drop any photograph of a blazer, dress, trousers, or full look.
                  Our vision agent extracts color palettes, silhouettes, and matches curated high-fashion pieces.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-white text-neutral-950 font-medium text-xs tracking-wider uppercase transition-colors">
                  Browse Photo
                </span>
                <button
                  type="button"
                  id="camera-scan-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-medium text-xs tracking-wider uppercase flex items-center gap-2 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" /> Use Camera
                </button>
              </div>
            </div>

            {cameraError && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-4 text-xs text-amber-200/90 bg-neutral-900/90 border border-amber-500/30 py-2 px-3 rounded-lg inline-flex items-center gap-3 max-w-md mx-auto text-left shadow-lg"
              >
                <span className="flex-1">{cameraError}</span>
                <button
                  type="button"
                  onClick={() => setCameraError(null)}
                  className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors"
                  title="Dismiss alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Curated Sample Outfits for instant test drive */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">
                  Or Test Drive Curated Zara Editorial Samples
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_LOOKS.map((sample) => (
                <div
                  key={sample.id}
                  id={`sample-card-${sample.id}`}
                  onClick={() => onImageSelected(sample.image, sample)}
                  className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={sample.image}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5 bg-neutral-900 border-t border-neutral-800">
                    <p className="text-xs font-medium text-neutral-200 truncate group-hover:text-white">
                      {sample.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">
                      {sample.garmentType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
