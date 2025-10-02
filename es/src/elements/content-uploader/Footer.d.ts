import * as React from 'react';
import './Footer.scss';
export interface FooterProps {
    errorCode?: string;
    fileLimit: number;
    hasFiles: boolean;
    isDone: boolean;
    isLoading: boolean;
    onCancel: () => void;
    onClose?: () => void;
    onUpload: () => void;
}
declare const Footer: ({ isLoading, hasFiles, errorCode, onCancel, onClose, onUpload, fileLimit, isDone }: FooterProps) => React.JSX.Element;
export default Footer;
