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
}: Props) =>
    inputLabel ? (
        // eslint-disable-next-line jsx-a11y/label-has-for
        <label className={inputLabelClass}>
            {inputLabel}
            <input
                directory={isFolderUpload ? '' : undefined}
                multiple={isMultiple}
                onChange={handleChange}
                type="file"
                webkitdirectory={isFolderUpload ? '' : undefined}
            />
        </label>
    ) : null;

export default UploadInput;
