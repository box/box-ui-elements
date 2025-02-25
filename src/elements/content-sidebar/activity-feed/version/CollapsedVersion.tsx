import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import ActivityCard from '../ActivityCard';
import IconInfo from '../../../../icons/general/IconInfo';
import PlainButton from '../../../../components/plain-button';
import { ButtonType } from '../../../../components/button';
import messages from '../../../common/messages';
import selectors from '../../../common/selectors/version';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import type { User, FileVersions } from '../../../../common/types/core';
import { ACTION_TYPE_CREATED, ACTION_TYPE_RESTORED, ACTION_TYPE_TRASHED } from '../../../../constants';
import './Version.scss';

const ACTION_MESSAGE_UPLOAD = 'uploaded';
const ACTION_MESSAGE_RESTORE = 'restored';
const ACTION_MESSAGE_TRASH = 'deleted';

function getMessageForAction(
    action: string,
    collaborators: { [collaborator_id: string]: User } = {},
    version_start: number,
    version_end: number,
    shouldUseUAA?: boolean,
    action_by?: User[],
): React.ReactNode {
    if (
        action !== 'upload' &&
        action !== ACTION_TYPE_RESTORED &&
        action !== ACTION_TYPE_TRASHED &&
        action !== ACTION_TYPE_CREATED
    ) {
        return null;
    }

    let actionMessage = '';
    switch (action) {
        case ACTION_TYPE_CREATED:
            actionMessage = ACTION_MESSAGE_UPLOAD;
            break;
        case ACTION_TYPE_RESTORED:
            actionMessage = ACTION_MESSAGE_RESTORE;
            break;
        case ACTION_TYPE_TRASHED:
            actionMessage = ACTION_MESSAGE_TRASH;
            break;
        default:
            actionMessage = '';
            break;
    }

    const collaboratorIDs = Object.keys(collaborators);
    const numberOfCollaborators = shouldUseUAA ? action_by?.length : collaboratorIDs.length;

    const versionRange: React.ReactNode = (
        <span className="bcs-Version-range">
            {version_start} - {version_end}
        </span>
    );

    if (numberOfCollaborators === 1) {
        const collaborator = shouldUseUAA ? action_by?.[0] : collaborators[collaboratorIDs[0]];

        if (shouldUseUAA) {
            return (
                <FormattedMessage
                    {...messages.versionCollapsed}
                    values={{
                        name: <strong>{collaborator?.name}</strong>,
                        versions: versionRange,
                        actionMessage,
                    }}
                />
            );
        }

        return (
            <FormattedMessage
                {...messages.versionUploadCollapsed}
                values={{
                    name: <strong>{collaborator?.name}</strong>,
                    versions: versionRange,
                }}
            />
        );
    }

    if (shouldUseUAA) {
        return (
            <FormattedMessage
                {...messages.versionMultipleUsersCollapsed}
                values={{
                    numberOfCollaborators,
                    versions: versionRange,
                    actionMessage,
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

interface CollapsedVersionProps {
    action_by?: User[];
    action_type?: string;
    collaborators: { [collaborator_id: string]: User };
    id: string;
    intl: IntlShape;
    onInfo?: Function;
    shouldUseUAA?: boolean;
    version_end: number;
    version_start: number;
    versions: FileVersions;
}

export type { CollapsedVersionProps };

const CollapsedVersion = (props: CollapsedVersionProps): React.ReactNode => {
    const {
        action_by,
        action_type = ACTION_TYPE_CREATED,
        collaborators,
        id,
        intl,
        onInfo,
        shouldUseUAA,
        versions,
        version_start,
        version_end,
    } = props;
    // $FlowFixMe
    const action = shouldUseUAA ? action_type : selectors.getVersionAction(props);

    return (
        <ActivityCard className="bcs-Version">
            <span className="bcs-Version-message">
                {getMessageForAction(action, collaborators, version_start, version_end, shouldUseUAA, action_by)}
            </span>
            {onInfo ? (
                <span className="bcs-Version-actions">
                    <PlainButton
                        aria-label={intl.formatMessage(messages.getVersionInfo)}
                        className="bcs-Version-info"
                        data-resin-target={ACTIVITY_TARGETS.VERSION_CARD}
                        onClick={() => {
                            onInfo(shouldUseUAA ? { id, version_number: version_end } : { versions });
                        }}
                        type={ButtonType.BUTTON}
                    >
                        <IconInfo height={16} width={16} />
                    </PlainButton>
                </span>
            ) : null}
        </ActivityCard>
    );
};

export { CollapsedVersion as CollapsedVersionBase };
export default injectIntl(CollapsedVersion);
