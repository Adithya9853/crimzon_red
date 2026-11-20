/// <reference types="vite/client" />

declare module 'virtual:preetham-media' {
  export type PreethamCategoryId =
    | 'nature'
    | 'wildlife'
    | 'birds'
    | 'portraits'
    | 'travel'
    | 'landscapes'
    | 'instagram-reels';

  export interface ScannedMediaItem {
    id: string;
    filename: string;
    title: string;
    extension: string;
    src: string;
    categoryId: PreethamCategoryId;
    mediaType: 'image' | 'video';
  }

  export const folderExists: boolean;
  export const items: ScannedMediaItem[];
  export const categoryCounts: Record<PreethamCategoryId, number>;
}
