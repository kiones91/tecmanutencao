'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  disabled?: boolean;
}

export default function SignaturePad({ onSave, disabled }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getCoordinates = (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in event && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in event) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e.nativeEvent, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e.nativeEvent, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#fcdc5d'; // Amarelo industrial primário
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSave('');
  };

  // Ajustar resolução interna do canvas para alta definição
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(2, 2);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="relative border-2 border-dashed border-[#232b3e] hover:border-[#fcdc5d]/40 rounded-2xl bg-[#111622] overflow-hidden transition-colors">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-44 touch-none cursor-crosshair block"
        />

        {/* Linha guia de assinatura */}
        <div className="absolute bottom-6 left-6 right-6 border-b border-[#232b3e] pointer-events-none flex justify-between items-center text-[10px] text-[#94a3b8]/50 uppercase tracking-widest pb-1 font-mono">
          <span>Assine sobre a linha</span>
          <PenTool className="w-3 h-3" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-[11px] text-[#94a3b8]">
          {hasDrawn ? '✓ Assinatura capturada' : 'Aguardando assinatura do cliente'}
        </span>
        <button
          type="button"
          onClick={clear}
          disabled={!hasDrawn || disabled}
          className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors py-1 px-2 rounded-lg bg-[#161c2c] border border-[#232b3e]"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>
    </div>
  );
}
