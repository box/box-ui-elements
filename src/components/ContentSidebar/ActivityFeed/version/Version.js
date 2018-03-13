import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PlainButton from '../../../components/plain-button';
import IconInfoInverted from '../../../icons/general/IconInfoInverted';
import { UserPropType } from '../../../common/box-proptypes';

import messages from '../messages';

import './Version.scss';

function getMessageForAction(name, action, versionNumber) {
    switch (action) {
        case 'upload':
            return (
                <FormattedMessage
                    {...messages.versionUploaded}
                    values={{
                        name: <strong>{name}</strong>,
                        versionNumber
                    }}
                />
            );
        case 'delete':
            return (
                <FormattedMessage
                    {...messages.versionDeleted}
                    values={{
                        name: <strong>{name}</strong>,
                        versionNumber
                    }}
                />
            );
        case 'restore':
            return (
                <FormattedMessage
                    {...messages.versionRestored}
                    values={{
                        name: <strong>{name}</strong>,
                        versionNumber
                    }}
                />
            );
        default:
            return null;
    }
}

const Version = ({ action, createdBy, id, intl, onInfo, versionNumber }) => (
    <div className='box-ui-version'>
        <span className='box-ui-version-message'>{getMessageForAction(createdBy.name, action, versionNumber)}</span>
        {onInfo ? (
            <span className='box-ui-version-actions'>
                <PlainButton
                    aria-label={intl.formatMessage(messages.getVersionInfo)}
                    className='box-ui-version-info'
                    onClick={() => {
                        onInfo({ id, versionNumber });
                    }}
                    type='button'
                >
                    <IconInfoInverted height={16} width={16} />
                </PlainButton>
            </span>
        ) : null}
    </div>
);

Version.displayName = 'Version';

Version.propTypes = {
    action: PropTypes.oneOf(['delete', 'restore', 'upload']).isRequired,
    createdBy: UserPropType.isRequired,
    id: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onInfo: PropTypes.func,
    versionNumber: PropTypes.number
};

export { Version as VersionBase };
export default injectIntl(Version);
