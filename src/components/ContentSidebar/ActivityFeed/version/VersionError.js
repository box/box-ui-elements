/**
 * @flow
 * @file Version Error component
 */

import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../../../messages';

import './Version.scss';

function getErrorMessage(errorCode: string): ReactNode {
    switch (errorCode) {
        case 'tooManyVersions':
            return <FormattedMessage {...messages.versionTooManyVersions} />;
        default:
            return null;
    }
}

type Props = {
    errorCode: string
};

const VersionError = ({ errorCode }: Props): ReactNode => (
    <div className='bcs-version error'>
        <span className='bcs-version-message'>{getErrorMessage(errorCode)}</span>
    </div>
);

VersionError.displayName = 'VersionError';

export default VersionError;
