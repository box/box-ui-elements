import * as React from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@box/blueprint-web';

import { RESIN_TAG_TARGET } from '../../common/variables';
import { STATUS_ERROR } from '../../constants';

import messages from '../common/messages';
import type { UploadStatus } from '../../common/types/upload';

import './UploadsManagerAction.scss';

export interface UploadsManagerActionProps {
    hasMultipleFailedUploads: boolean;
    onClick: (status: UploadStatus) => void;
}

const UploadsManagerAction = ({ hasMultipleFailedUploads, onClick }: UploadsManagerActionProps) => {
    const { formatMessage } = useIntl();

    const handleResumeClick = event => {
        event.stopPropagation();
        onClick(STATUS_ERROR);
    };

    return (
        <div className="bcu-uploads-manager-action">
            <Button
                className="bcu-UploadsManagerAction-button"
                onClick={handleResumeClick}
                {...{ [RESIN_TAG_TARGET]: 'uploadresumeheader' }}
            >
                {formatMessage(hasMultipleFailedUploads ? messages.resumeAll : messages.resume)}
            </Button>
        </div>
    );
};

export default UploadsManagerAction;
