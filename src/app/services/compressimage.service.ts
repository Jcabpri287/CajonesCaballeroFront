// src/app/services/compress-image.service.ts
import { Injectable } from '@angular/core';
import Compressor from 'canvas-compress';

@Injectable({
  providedIn: 'root'
})
export class CompressImageService {
  async compressImage(canvas: HTMLCanvasElement, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const compressor = new Compressor(canvas, {
        quality: quality,
        mimeType: 'image/jpeg',
        success(result) {
          resolve(result.toDataURL('image/jpeg', quality));
        },
        error(err) {
          reject(err);
        }
      });
    });
  }
}
