import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import UploadInput from './UploadInput';
import messages from '../common/messages';

export interface UploadStateContentProps {
    fileInputLabel?: React.ReactNode;
    folderInputLabel?: React.ReactNode;
    message?: string;
    onChange?: Function;
    useButton?: boolean;
}

const UploadStateContent = ({
    fileInputLabel,
    folderInputLabel,
    message,
    onChange,
    useButton = false,
}: UploadStateContentProps) => {
    const inputLabelClass = useButton ? 'btn btn-primary be-input-btn' : 'be-input-link'; // TODO: Refactor to use Blueprint components
    const canUploadFolder = !useButton && !!folderInputLabel;

    let inputsContent;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!onChange) {
            return;
        }

        onChange(event);

        const {currentTarget} = event;
        currentTarget.value = ''; // Reset the file input selection
    };

    const fileInputContent = fileInputLabel ? (
        <UploadInput inputLabel={fileInputLabel} inputLabelClass={inputLabelClass} onChange={handleChange} />
    ) : null;
    const folderInputContent = canUploadFolder ? (
        <UploadInput
            inputLabel={folderInputLabel}
            inputLabelClass={inputLabelClass}
            isFolderUpload
            onChange={handleChange}
        />
    ) : null;

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
            {message && <div className="bcu-upload-state-message">{message}</div>}
            {inputsContent && <div className="bcu-upload-input-container">{inputsContent}</div>}
        </div>
    );
};

export default UploadStateContent;
