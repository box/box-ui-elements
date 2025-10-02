import * as React from 'react';
import type { View } from '../../common/types/core';
import type { UploadItem, UploadStatus } from '../../common/types/upload';
import './UploadsManager.scss';
export interface UploadsManagerProps {
    isDragging: boolean;
    isExpanded: boolean;
    isResumableUploadsEnabled: boolean;
    isVisible: boolean;
    items: UploadItem[];
    onItemActionClick: React.MouseEventHandler<HTMLButtonElement>;
    onRemoveActionClick: (item: UploadItem) => void;
    onUpgradeCTAClick?: () => void;
    onUploadsManagerActionClick: (status: UploadStatus) => void;
    toggleUploadsManager: () => void;
    view: View;
}
declare const UploadsManager: ({ isDragging, isExpanded, isResumableUploadsEnabled, isVisible, items, onItemActionClick, onRemoveActionClick, onUpgradeCTAClick, onUploadsManagerActionClick, toggleUploadsManager, view, }: UploadsManagerProps) => React.JSX.Element;
export default UploadsManager;
