import * as React from 'react';
import type { ViewMode } from '../flowTypes';
import './ViewModeChangeButton.scss';
export interface ViewModeChangeButtonProps {
    className?: string;
    onViewModeChange?: (viewMode: ViewMode) => void;
    viewMode: ViewMode;
}
declare const ViewModeChangeButton: ({ className, onViewModeChange, viewMode, ...rest }: ViewModeChangeButtonProps) => React.JSX.Element;
export default ViewModeChangeButton;
