import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { Button } from '@box/blueprint-web';

import { RESIN_TAG_TARGET } from '../../common/variables';
import { STATUS_ERROR } from '../../constants';

import messages from '../common/messages';
import type { UploadStatus } from '../../common/types/upload';

import './UploadsManagerAction.scss';

export interface UploadsManagerActionProps {
    hasMultipleFailedUploads: boolean;
    intl: IntlShape;
    onClick: (status: UploadStatus) => void;
}

const UploadsManagerAction = ({ hasMultipleFailedUploads, intl, onClick }: UploadsManagerActionProps) => {
    const handleResumeClick = event => {
        event.stopPropagation();
        onClick(STATUS_ERROR);
    };

    const resumeMessage = hasMultipleFailedUploads ? messages.resumeAll : messages.resume;

    const resin = { [RESIN_TAG_TARGET]: 'uploadresumeheader' };

    return (
        <div className="bcu-uploads-manager-action">
            <Button onClick={handleResumeClick} size="small" variant="primary" {...resin}>
                {intl.formatMessage(resumeMessage)}
            </Button>
        </div>
    );
};

export default injectIntl(UploadsManagerAction);
