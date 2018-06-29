/**
 * @flow
 * @file Input element for folder/file upload
 * @author Box
 */

import * as React from 'react';

type Props = {
    isMultiple?: boolean,
    isFolderUpload?: boolean,
    inputLabelClass?: string,
    inputLabel?: React.Node,
    handleChange: Function
};

const UploadInput = ({
    isMultiple = true,
    isFolderUpload = false,
    inputLabelClass = '',
    inputLabel,
    handleChange
}: Props) =>
    inputLabel ? (
        // eslint-disable-next-line jsx-a11y/label-has-for
        <label className={inputLabelClass}>
            {inputLabel}
            <input
                multiple={isMultiple}
                type='file'
                onChange={handleChange}
                directory={isFolderUpload ? '' : undefined}
                webkitdirectory={isFolderUpload ? '' : undefined}
            />
        </label>
    ) : null;

export default UploadInput;
