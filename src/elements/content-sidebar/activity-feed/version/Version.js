/**
 * @flow
 * @file Version component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import PlainButton from 'box-react-ui/lib/components/plain-button';
import IconInfoInverted from 'box-react-ui/lib/icons/general/IconInfoInverted';

import messages from 'elements/common/messages';
import { ACTIVITY_TARGETS } from 'elements/common/interactionTargets';

import './Version.scss';
import {
    VERSION_UPLOAD_ACTION,
    VERSION_DELETE_ACTION,
    VERSION_RESTORE_ACTION,
    PLACEHOLDER_USER,
} from '../../../../constants';

// eslint-disable-next-line
import type { InjectIntlProvidedProps } from 'react-intl';

function getMessageForAction(name: React.Node, action: string, version_number: string): React.Node {
    switch (action) {
        case VERSION_UPLOAD_ACTION:
            return (
                <FormattedMessage
                    {...messages.versionUploaded}
                    values={{
                        name: <strong>{name}</strong>,
                        version_number,
                    }}
                />
            );
        case VERSION_DELETE_ACTION:
            return (
                <FormattedMessage
                    {...messages.versionDeleted}
                    values={{
                        name: <strong>{name}</strong>,
                        version_number,
                    }}
                />
            );
        case VERSION_RESTORE_ACTION:
            return (
                <FormattedMessage
                    {...messages.versionRestored}
                    values={{
                        name: <strong>{name}</strong>,
                        version_number,
                    }}
                />
            );
        default:
            return null;
    }
}

type Props = {
    action: 'delete' | 'restore' | 'upload',
    modified_by: User,
    id: string,
    onInfo?: Function,
    version_number: string,
} & InjectIntlProvidedProps;

const Version = ({ action, modified_by, id, intl, onInfo, version_number }: Props): React.Node => {
    const modifiedByUser = modified_by || PLACEHOLDER_USER;
    return (
        <div className="bcs-version">
            <span className="bcs-version-message">
                {getMessageForAction(modifiedByUser.name, action, version_number)}
            </span>
            {onInfo ? (
                <span className="bcs-version-actions">
                    <PlainButton
                        aria-label={intl.formatMessage(messages.getVersionInfo)}
                        className="bcs-version-info"
                        onClick={() => {
                            onInfo({ id, version_number });
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
};

export { Version as VersionBase };
export default injectIntl(Version);
