import * as React from 'react';
export interface UploadStateContentProps {
    fileInputLabel?: React.ReactNode;
    folderInputLabel?: React.ReactNode;
    message?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    useButton?: boolean;
}
declare const UploadStateContent: ({ fileInputLabel, folderInputLabel, message, onChange, useButton, }: UploadStateContentProps) => React.JSX.Element;
export default UploadStateContent;
