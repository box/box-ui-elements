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
    isMultiple = true,
    isFolderUpload = false,
    inputLabelClass = '',
    inputLabel,
    handleChange,
}: Props) => {
    const hiddenInputRef = React.useRef(null);

    const onKeyDown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
            hiddenInputRef.current?.click();
        }
    };

    return inputLabel ? (
        <>
            <label className={inputLabelClass} tabIndex={0} onKeyDown={onKeyDown}>
                {inputLabel}
                <input
                    ref={hiddenInputRef}
                    directory={isFolderUpload ? '' : undefined}
                    multiple={isMultiple}
                    onChange={handleChange}
                    type="file"
                    webkitdirectory={isFolderUpload ? '' : undefined}
                />
            </label>
        </>
    ) : null;
};
export default UploadInput;
