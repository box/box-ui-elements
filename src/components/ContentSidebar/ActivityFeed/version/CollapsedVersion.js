/**
 * @flow
 * @file Collapsed Version component
 */

import React from 'react';
import type { Node } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import PlainButton from 'box-react-ui/lib/components/plain-button';
import IconInfoInverted from 'box-react-ui/lib/icons/general/IconInfoInverted';

import { User } from '../../../../flowTypes';

import messages from '../../../messages';

import './Version.scss';

function getMessageForAction(
    action: string,
    collaborators: { [collaborator_id: string]: User },
    versionStart: number,
    versionEnd: number
): Node {
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
                        <span className='bcs-version-range'>
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
                    <span className='bcs-version-range'>
                        {versionStart} - {versionEnd}
                    </span>
                )
            }}
        />
    );
}

type Props = {
    action: 'upload',
    collaborators: { [collaborator_id: string]: User },
    intl: intlShape.isRequired,
    onInfo: Function,
    versions: Array,
    versionStart: number,
    versionEnd: number
};

const CollapsedVersion = ({ action, collaborators, intl, onInfo, versions, versionStart, versionEnd }: Props): Node => (
    <div className='bcs-collapsed-version'>
        <span className='bcs-version-message'>
            {getMessageForAction(action, collaborators, versionStart, versionEnd)}
        </span>
        {onInfo ? (
            <span className='bcs-version-actions'>
                <PlainButton
                    aria-label={intl.formatMessage(messages.getVersionInfo)}
                    className='bcs-version-info'
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

export { CollapsedVersion as CollapsedVersionBase };
export default injectIntl(CollapsedVersion);
