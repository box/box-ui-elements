/**
 * @flow
 * @file Upload state content component
 */

import React from 'react';

type Props = {
    message?: React$Element<any>,
    inputLabel?: React$Element<any>,
    useButton?: boolean,
    onChange?: Function
};

/* eslint-disable jsx-a11y/label-has-for */
const UploadStateContent = ({ message, inputLabel, useButton = false, onChange }: Props) => {
    const messageContent = message ? <div className='bcu-upload-state-message'>{message}</div> : null;
    const inputLabelClass = useButton ? 'btn btn-primary buik-input-btn' : 'buik-input-link';
    const inputContent = (
        <label className={inputLabelClass}>
            {inputLabel}
            <input className='buik-input' multiple type='file' onChange={onChange} />
        </label>
    );

    return (
        <div>
            {messageContent}
            {inputLabel ? inputContent : null}
        </div>
    );
};
/* eslint-enable jsx-a11y/label-has-for */

export default UploadStateContent;
