import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../messages';

import './Version.scss';

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'tooManyVersions':
            return <FormattedMessage {...messages.versionTooManyVersions} />;
        default:
            return null;
    }
}

const VersionError = ({ errorCode }) => (
    <div className='box-ui-version error'>
        <span className='box-ui-version-message'>{getErrorMessage(errorCode)}</span>
    </div>
);

VersionError.displayName = 'VersionError';

VersionError.propTypes = {
    errorCode: PropTypes.string.isRequired
};

export default VersionError;
