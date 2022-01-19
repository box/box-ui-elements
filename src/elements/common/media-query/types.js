// @flow

import { POINTER_TYPE_NONE, POINTER_TYPE_FINE, POINTER_TYPE_COARSE } from './constants';

export type MediaPointerType = POINTER_TYPE_NONE | POINTER_TYPE_FINE | POINTER_TYPE_COARSE;
export type MediaHoverType = 'none' | 'hover';

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
    anyHover: 'none' | 'hover',
    anyPointer: 'none' | 'fine' | 'coarse',
    hover: 'none' | 'hover',
    pointer: 'none' | 'fine' | 'coarse',
    size: boolean,
};

export type MediaQuery = string | MediaFeatures;
