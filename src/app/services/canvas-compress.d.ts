// src/app/services/canvas-compress.d.ts
declare module 'canvas-compress' {
  interface CompressorOptions {
    quality?: number;
    mimeType?: string;
    success?(result: HTMLCanvasElement): void;
    error?(err: Error): void;
  }

  class Compressor {
    constructor(canvas: HTMLCanvasElement, options: CompressorOptions);
  }

  export default Compressor;
}
