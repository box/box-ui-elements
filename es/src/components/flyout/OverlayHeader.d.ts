import * as React from 'react';
import './OverlayHeader.scss';
export interface OverlayHeaderProps {
    /** Components to render in the header */
    children?: React.ReactNode;
    /** Set className to the overlay header */
    className?: string;
    /** Are OverlayHeader actions enabled */
    isOverlayHeaderActionEnabled?: boolean;
}
declare const OverlayHeader: ({ children, className, isOverlayHeaderActionEnabled }: OverlayHeaderProps) => React.JSX.Element;
export default OverlayHeader;
