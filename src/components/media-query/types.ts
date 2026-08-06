import { HOVER_TYPE, POINTER_TYPE } from './constants';

export type MediaPointerType = (typeof POINTER_TYPE)[keyof typeof POINTER_TYPE];
export type MediaHoverType = (typeof HOVER_TYPE)[keyof typeof HOVER_TYPE];

export interface MediaFeatures {
    anyHover?: MediaHoverType;
    anyPointer?: MediaPointerType;
    hover?: MediaHoverType;
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
    pointer?: MediaPointerType;
}

export interface MediaShape {
    anyHover: MediaHoverType;
    anyPointer: MediaPointerType;
    hover: MediaHoverType;
    isTouchDevice: boolean;
    pointer: MediaPointerType;
    size: string;
    viewHeight: number;
    viewWidth: number;
}

export type MediaQuery = string | MediaFeatures;
