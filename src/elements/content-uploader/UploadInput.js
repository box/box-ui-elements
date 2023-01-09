/**
 * @flow
 * @file Input element for folder/file upload
 * @author Box
 */

import * as React from 'react';

type Props = {
    handleChange: Function,
    inputLabel?: React.Node,
    inputLabelClass?: string,
    isFolderUpload?: boolean,
    isMultiple?: boolean,
};

const UploadInput = ({
    handleChange,
    inputLabel,
    inputLabelClass = '',
    isFolderUpload = false,
    isMultiple = true,
}: Props) => {
    const inputRef = React.useRef(null);

    const onKeyDown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (inputRef.current) {
                inputRef.current.click();
            }
        }
    };

    return inputLabel ? (
        <label className={inputLabelClass} onKeyDown={onKeyDown} tabIndex={0}>
            {inputLabel}
            <input
                ref={inputRef}
                directory={isFolderUpload ? '' : undefined}
                multiple={isMultiple}
                onChange={handleChange}
                type="file"
                webkitdirectory={isFolderUpload ? '' : undefined}
            />
        </label>
    ) : null;
};
export default UploadInput;
