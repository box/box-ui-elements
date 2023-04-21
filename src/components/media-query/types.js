// @flow

import { POINTER_TYPE, HOVER_TYPE } from './constants';

export type MediaPointerType = POINTER_TYPE.none | POINTER_TYPE.coarse | POINTER_TYPE.fine;
export type MediaHoverType = HOVER_TYPE.none | HOVER_TYPE.hover;

export type MediaFeatures = {
    anyHover?: MediaHoverType,
    anyPointer?: MediaPointerType,
    hover?: MediaHoverType,
    maxHeight?: number,
    maxWidth?: number,
    minHeight?: number,
    minWidth?: number,
    pointer?: MediaPointerType,
};

export type MediaShape = {
    anyHover: MediaHoverType,
    anyPointer: MediaPointerType,
    hover: MediaHoverType,
    isTouchDevice: boolean,
    pointer: MediaPointerType,
    size: string,
    viewHeight: number,
    viewWidth: number,
};

export type MediaQuery = string | MediaFeatures;
