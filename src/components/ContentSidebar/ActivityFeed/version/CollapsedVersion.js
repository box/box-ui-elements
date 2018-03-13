import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PlainButton from '../../../components/plain-button';
import IconInfoInverted from '../../../icons/general/IconInfoInverted';
import { UserPropType } from '../../../common/box-proptypes';

import messages from '../messages';

import './Version.scss';

function getMessageForAction(action, collaborators, versionStart, versionEnd) {
    // We only support collapsing for multiple upload versions
    if (action !== 'upload') {
        return null;
    }
    const collaboratorIDs = Object.keys(collaborators);
    const numberOfCollaborators = collaboratorIDs.length;

    if (numberOfCollaborators === 1) {
        const collaborator = collaborators[collaboratorIDs[0]];
        return (
            <FormattedMessage
                {...messages.versionUploadCollapsed}
                values={{
                    name: <strong>{collaborator.name}</strong>,
                    versions: (
                        <span className='box-ui-version-range'>
                            {versionStart} - {versionEnd}
                        </span>
                    )
                }}
            />
        );
    }

    return (
        <FormattedMessage
            {...messages.versionMultipleUsersUploaded}
            values={{
                numberOfCollaborators,
                versions: (
                    <span className='box-ui-version-range'>
                        {versionStart} - {versionEnd}
                    </span>
                )
            }}
        />
    );
}

const CollapsedVersion = ({ action, collaborators, intl, onInfo, versions, versionStart, versionEnd }) => (
    <div className='box-ui-collapsed-version'>
        <span className='box-ui-version-message'>
            {getMessageForAction(action, collaborators, versionStart, versionEnd)}
        </span>
        {onInfo ? (
            <span className='box-ui-version-actions'>
                <PlainButton
                    aria-label={intl.formatMessage(messages.getVersionInfo)}
                    className='box-ui-version-info'
                    onClick={() => {
                        onInfo({ versions });
                    }}
                    type='button'
                >
                    <IconInfoInverted height={16} width={16} />
                </PlainButton>
            </span>
        ) : null}
    </div>
);

CollapsedVersion.displayName = 'CollapsedVersion';

CollapsedVersion.propTypes = {
    action: PropTypes.oneOf(['upload']).isRequired,
    collaborators: PropTypes.objectOf(UserPropType).isRequired,
    intl: intlShape.isRequired,
    onInfo: PropTypes.func,
    versions: PropTypes.array,
    versionStart: PropTypes.number.isRequired,
    versionEnd: PropTypes.number.isRequired
};

export { CollapsedVersion as CollapsedVersionBase };
export default injectIntl(CollapsedVersion);
