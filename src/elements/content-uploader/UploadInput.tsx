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
    inputLabel?: React.ReactNode;
    inputLabelClass?: string;
    isFolderUpload?: boolean;
    isMultiple?: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    /** Optional callback to validate files before selection. Return false to prevent selection. */
    onSelection?: (files: FileList) => boolean;
}

const UploadInput = ({
    inputLabel,
    inputLabelClass = '',
    isFolderUpload = false,
    isMultiple = true,
    onChange,
    onSelection,
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
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
        <label className={inputLabelClass} onKeyDown={onKeyDown} role="button" tabIndex={0}>
            {inputLabel}
            <input
                data-testid="upload-input"
                directory={isFolderUpload ? '' : undefined}
                multiple={isMultiple}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const { files } = event.target;
                    if (onSelection && files) {
                        const shouldContinue = onSelection(files);
                        if (!shouldContinue) {
                            return;
                        }
                    }
                    onChange(event);
                }}
                ref={inputRef}
                type="file"
                webkitdirectory={isFolderUpload ? '' : undefined}
            />
        </label>
    ) : null;
};

export default UploadInput;
