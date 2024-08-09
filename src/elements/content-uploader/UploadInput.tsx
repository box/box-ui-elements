import * as React from 'react';

// https://stackoverflow.com/questions/72787050/typescript-upload-directory-property-directory-does-not-exist-on-type
// Extend the InputHTMLAttributes interface to include the directory attribute
declare module 'react' {
    interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
        directory?: string;
        webkitdirectory?: string;
    }
}

export interface UploadInputProps {
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    inputLabel?: React.ReactNode;
    inputLabelClass?: string;
    isFolderUpload?: boolean;
    isMultiple?: boolean;
}

const UploadInput = ({
    handleChange,
    inputLabel,
    inputLabelClass = '',
    isFolderUpload = false,
    isMultiple = true,
}: UploadInputProps) => {
    const inputRef = React.useRef(null);

    const onKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (inputRef.current) {
                inputRef.current.click();
            }
        }
    };

    return inputLabel ? (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-noninteractive-tabindex
        <label className={inputLabelClass} onKeyDown={onKeyDown} tabIndex={0}>
            {inputLabel}
            <input
                data-testid="upload-input"
                directory={isFolderUpload ? '' : undefined}
                multiple={isMultiple}
                onChange={handleChange}
                ref={inputRef}
                type="file"
                webkitdirectory={isFolderUpload ? '' : undefined}
            />
        </label>
    ) : null;
};

export default UploadInput;
