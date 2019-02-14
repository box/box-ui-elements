/**
 * @flow
 * @file Upload state content component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../common/messages';
import UploadInput from './UploadInput';

type Props = {
    fileInputLabel?: React.Node,
    folderInputLabel?: React.Node,
    message?: React.Node,
    onChange?: Function,
    useButton?: boolean,
};

const UploadStateContent = ({ fileInputLabel, folderInputLabel, message, onChange, useButton = false }: Props) => {
    const messageContent = message ? <div className="bcu-upload-state-message">{message}</div> : null;
    const inputLabelClass = useButton ? 'btn btn-primary be-input-btn' : 'be-input-link';
    const shouldShowFolderUploadInput = !useButton && !!folderInputLabel;

    const handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        if (!onChange) {
            return;
        }

        onChange(event);

        const currentTarget = (event.currentTarget: HTMLInputElement);
        // resets the file input selection
        currentTarget.value = '';
    };

    const fileInputContent = (
        <UploadInput handleChange={handleChange} inputLabel={fileInputLabel} inputLabelClass={inputLabelClass} />
    );
    const folderInputContent = shouldShowFolderUploadInput ? (
        <UploadInput
            handleChange={handleChange}
            inputLabel={folderInputLabel}
            inputLabelClass={inputLabelClass}
            isFolderUpload
        />
    ) : null;

    let inputsContent;
    if (fileInputContent && folderInputContent) {
        inputsContent = (
            <FormattedMessage
                {...messages.uploadOptions}
                values={{
                    option1: fileInputContent,
                    option2: folderInputContent,
                }}
            />
        );
    } else if (fileInputContent) {
        inputsContent = fileInputContent;
    }

    return (
        <div>
            {messageContent}
            {inputsContent && <div className="bcu-upload-input-container">{inputsContent}</div>}
        </div>
    );
};

export default UploadStateContent;
