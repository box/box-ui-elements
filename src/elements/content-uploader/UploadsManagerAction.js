/**
 * @flow
 * @file Uploads Manager action component
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../common/messages';
import PrimaryButton from '../../components/primary-button';
import { STATUS_ERROR } from '../../constants';

type Props = {
    numFailedUploads: number,
    onClick: Function,
};

const UploadsManagerAction = ({ onClick, numFailedUploads }: Props) => {
    const handleResumeClick = event => {
        event.stopPropagation();
        onClick(STATUS_ERROR);
    };

    const resumeMessage =
        numFailedUploads > 1 ? <FormattedMessage {...messages.resumeAll} /> : <FormattedMessage {...messages.resume} />;

    return (
        <PrimaryButton onClick={handleResumeClick} type="button">
            {resumeMessage}
        </PrimaryButton>
    );
};

export { UploadsManagerAction };
export default UploadsManagerAction;
