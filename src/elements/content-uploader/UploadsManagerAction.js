/**
 * @flow
 * @file Uploads Manager action component
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../common/messages';
import PrimaryButton from '../../components/primary-button';
import { STATUS_ERROR } from '../../constants';
import { RESIN_TAG_TARGET } from '../../common/variables';
import './UploadsManagerAction.scss';

type Props = {
    hasMultipleFailedUploads: boolean,
    onClick: Function,
};

const UploadsManagerAction = ({ onClick, hasMultipleFailedUploads }: Props) => {
    const handleResumeClick = event => {
        event.stopPropagation();
        onClick(STATUS_ERROR);
    };

    const resumeMessage = hasMultipleFailedUploads ? messages.resumeAll : messages.resume;

    const resin = { [RESIN_TAG_TARGET]: 'uploadresumeheader' };

    return (
        <div className="bcu-uploads-manager-action">
            <PrimaryButton onClick={handleResumeClick} type="button" {...resin}>
                <FormattedMessage {...resumeMessage} />
            </PrimaryButton>
        </div>
    );
};

export default UploadsManagerAction;
