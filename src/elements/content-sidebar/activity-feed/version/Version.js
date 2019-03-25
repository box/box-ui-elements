/**
 * @flow
 * @file Version component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import PlainButton from '../../../../components/plain-button';
import IconInfoInverted from '../../../../icons/general/IconInfoInverted';

import messages from '../../../common/messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';

import './Version.scss';
import {
    VERSION_UPLOAD_ACTION,
    VERSION_DELETE_ACTION,
    VERSION_RESTORE_ACTION,
    PLACEHOLDER_USER,
} from '../../../../constants';

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
    id: string,
    modified_by: User,
    onInfo?: Function,
    version_number: string,
    version_restored?: string,
} & InjectIntlProvidedProps;

const Version = ({ action, modified_by, id, intl, onInfo, version_number, version_restored }: Props): React.Node => {
    const modifiedByUser = modified_by || PLACEHOLDER_USER;
    return (
        <div className="bcs-version">
            <span className="bcs-version-message">
                {getMessageForAction(modifiedByUser.name, action, version_restored || version_number)}
            </span>
            {onInfo ? (
                <span className="bcs-version-actions">
                    <PlainButton
                        aria-label={intl.formatMessage(messages.getVersionInfo)}
                        className="bcs-version-info"
                        data-resin-target={ACTIVITY_TARGETS.VERSION_CARD}
                        onClick={() => {
                            onInfo({ id, version_number });
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

export { Version as VersionBase };
export default injectIntl(Version);
