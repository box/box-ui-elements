/**
 * @flow
 * @file Collapsed Version component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import PlainButton from 'box-react-ui/lib/components/plain-button';
import IconInfoInverted from 'box-react-ui/lib/icons/general/IconInfoInverted';

import messages from 'elements/common/messages';
import { ACTIVITY_TARGETS } from 'elements/common/interactionTargets';

import './Version.scss';

function getMessageForAction(
    action: string,
    collaborators: { [collaborator_id: string]: User },
    version_start: number,
    version_end: number,
): React.Node {
    // We only support collapsing for multiple upload versions
    if (action !== 'upload') {
        return null;
    }

    const collaboratorIDs = Object.keys(collaborators);
    const numberOfCollaborators = collaboratorIDs.length;

    const versionRange: React.Node = (
        <span className="bcs-version-range">
            {version_start} - {version_end}
        </span>
    );

    if (numberOfCollaborators === 1) {
        const collaborator = collaborators[collaboratorIDs[0]];
        return (
            <FormattedMessage
                {...messages.versionUploadCollapsed}
                values={{
                    name: <strong>{collaborator.name}</strong>,
                    versions: versionRange,
                }}
            />
        );
    }

    return (
        <FormattedMessage
            {...messages.versionMultipleUsersUploaded}
            values={{
                numberOfCollaborators,
                versions: versionRange,
            }}
        />
    );
}

type Props = {
    action: 'upload',
    collaborators: { [collaborator_id: string]: User },
    onInfo?: Function,
    versions: FileVersions,
    version_start: number,
    version_end: number,
} & InjectIntlProvidedProps;

const CollapsedVersion = ({
    action,
    collaborators,
    intl,
    onInfo,
    versions,
    version_start,
    version_end,
}: Props): React.Node => (
    <div className="bcs-collapsed-version">
        <span className="bcs-version-message">
            {getMessageForAction(action, collaborators, version_start, version_end)}
        </span>
        {onInfo ? (
            <span className="bcs-version-actions">
                <PlainButton
                    aria-label={intl.formatMessage(messages.getVersionInfo)}
                    className="bcs-version-info"
                    onClick={() => {
                        onInfo({ versions });
                    }}
                    type="button"
                    data-resin-target={ACTIVITY_TARGETS.VERSION_CARD}
                >
                    <IconInfoInverted height={16} width={16} />
                </PlainButton>
            </span>
        ) : null}
    </div>
);

export { CollapsedVersion as CollapsedVersionBase };
export default injectIntl(CollapsedVersion);
