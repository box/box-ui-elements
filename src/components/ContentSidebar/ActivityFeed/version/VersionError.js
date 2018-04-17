/**
 * @flow
 * @file Version Error component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../../../messages';

import './Version.scss';

function getErrorMessage(errorCode: string): React.Node {
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

const VersionError = ({ errorCode }: Props): React.Node => (
    <div className='bcs-version error'>
        <span className='bcs-version-message'>{getErrorMessage(errorCode)}</span>
    </div>
);

export default VersionError;
