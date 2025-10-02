import * as React from 'react';
export interface FolderIconProps {
    /** Dimension of the icon */
    dimension?: number;
    /** If true displays collaborated folder icon */
    isCollab?: boolean;
    /** If true displays externally collaborated folder icon */
    isExternal?: boolean;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string;
}
declare const FolderIcon: ({ dimension, isCollab, isExternal, title }: FolderIconProps) => React.JSX.Element;
export default FolderIcon;
