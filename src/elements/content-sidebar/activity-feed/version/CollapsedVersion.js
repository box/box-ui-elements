/**
 * @flow
 * @file Collapsed Version component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import IconInfoInverted from '../../../../icons/general/IconInfoInverted';
import PlainButton from '../../../../components/plain-button';
import messages from '../../../common/messages';
import selectors from '../../../common/selectors/version';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import type { User, FileVersions } from '../../../../common/types/core';
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
        <span className="bcs-Version-range">
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
    collaborators: { [collaborator_id: string]: User },
    onInfo?: Function,
    version_end: number,
    version_start: number,
    versions: FileVersions,
} & InjectIntlProvidedProps;

const CollapsedVersion = (props: Props): React.Node => {
    // $FlowFixMe
    const action = selectors.getVersionAction(props);
    const { collaborators, intl, onInfo, versions, version_start, version_end } = props;

    return (
        <div className="bcs-Version">
            <span className="bcs-Version-message">
                {getMessageForAction(action, collaborators, version_start, version_end)}
            </span>
            {onInfo ? (
                <span className="bcs-Version-actions">
                    <PlainButton
                        aria-label={intl.formatMessage(messages.getVersionInfo)}
                        className="bcs-Version-info"
                        data-resin-target={ACTIVITY_TARGETS.VERSION_CARD}
                        onClick={() => {
                            onInfo({ versions });
                        }}
                        type="button"
                    >
                        <IconInfoInverted height={16} width={16} />
                    </PlainButton>
                </span>
            ) : null}
        </div>
    );
};

export { CollapsedVersion as CollapsedVersionBase };
export default injectIntl(CollapsedVersion);
