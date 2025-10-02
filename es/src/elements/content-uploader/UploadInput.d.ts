import * as React from 'react';
declare module 'react' {
    interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
        directory?: string;
        webkitdirectory?: string;
    }
}
export interface UploadInputProps {
    inputLabel?: React.ReactNode;
    inputLabelClass?: string;
    isFolderUpload?: boolean;
    isMultiple?: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}
declare const UploadInput: ({ inputLabel, inputLabelClass, isFolderUpload, isMultiple, onChange, }: UploadInputProps) => React.JSX.Element;
export default UploadInput;
