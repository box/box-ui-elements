/**
 * @flow
 * @file Version Error component
 */

import React from 'react';
import type { Node } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../../../messages';

import './Version.scss';

function getErrorMessage(errorCode: string): Node {
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

const VersionError = ({ errorCode }: Props): Node => (
    <div className='bcs-version error'>
        <span className='bcs-version-message'>{getErrorMessage(errorCode)}</span>
    </div>
);

VersionError.displayName = 'VersionError';

export default VersionError;
