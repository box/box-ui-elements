import * as React from 'react';
import type { View } from '../../common/types/core';
import type { UploadStatus } from '../../common/types/upload';
import './OverallUploadsProgressBar.scss';
export interface OverallUploadsProgressBarProps {
    customPrompt?: {
        defaultMessage: string;
        description: string;
        id: string;
    };
    hasMultipleFailedUploads: boolean;
    isDragging: boolean;
    isExpanded: boolean;
    isResumeVisible: boolean;
    isVisible: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
    onUploadsManagerActionClick: (status: UploadStatus) => void;
    percent: number;
    view: View;
}
declare const OverallUploadsProgressBar: ({ customPrompt, hasMultipleFailedUploads, isDragging, isExpanded, isResumeVisible, isVisible, onClick, onKeyDown, onUploadsManagerActionClick, percent, view, }: OverallUploadsProgressBarProps) => React.JSX.Element;
export default OverallUploadsProgressBar;
