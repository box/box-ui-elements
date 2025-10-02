import * as React from 'react';
export declare const EXTENSIONS: {
    [key: string]: {
        [key: string]: string;
    };
};
export interface FileIconProps {
    /** Dimension of the icon. */
    dimension?: number;
    /** Extension of file to display icon for. Defaults to generic icon */
    extension?: string;
    /** A string describing the icon if it's not purely decorative for accessibility */
    title?: string;
}
declare const FileIcon: ({ dimension, extension, title }: FileIconProps) => React.JSX.Element;
export default FileIcon;
