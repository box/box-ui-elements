import * as React from 'react';
import type { View } from '../../common/types/core';
import './UploadState.scss';
export interface UploadStateProps {
    canDrop: boolean;
    hasItems: boolean;
    isFolderUploadEnabled: boolean;
    isOver: boolean;
    isTouch: boolean;
    onSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    view: View;
}
declare const UploadState: ({ canDrop, hasItems, isOver, isTouch, view, onSelect, isFolderUploadEnabled, }: UploadStateProps) => React.JSX.Element;
export default UploadState;
