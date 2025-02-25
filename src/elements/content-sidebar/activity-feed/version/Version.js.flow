/**
 * @flow
 * @file Version component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import ActivityCard from '../ActivityCard';
import IconInfo from '../../../../icons/general/IconInfo';
import messages from '../../../common/messages';
import PlainButton from '../../../../components/plain-button';
import selectors from '../../../common/selectors/version';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import {
    FILE_REQUEST_NAME,
    VERSION_UPLOAD_ACTION,
    VERSION_DELETE_ACTION,
    VERSION_PROMOTE_ACTION,
    VERSION_RESTORE_ACTION,
} from '../../../../constants';
import type { User } from '../../../../common/types/core';
import './Version.scss';

type Props = {
    id: string,
    intl: IntlShape,
    modified_by: User,
    onInfo?: Function,
    version_number: string,
    version_promoted?: string,
};

const ACTION_MAP = {
    [VERSION_DELETE_ACTION]: messages.versionDeleted,
    [VERSION_PROMOTE_ACTION]: messages.versionPromoted,
    [VERSION_RESTORE_ACTION]: messages.versionRestored,
    [VERSION_UPLOAD_ACTION]: messages.versionUploaded,
};

const Version = (props: Props): React.Node => {
    // $FlowFixMe
    const action = selectors.getVersionAction(props);
    const { id, intl, onInfo, version_number, version_promoted } = props;
    // $FlowFixMe
    const user = selectors.getVersionUser(props);
    const name = user.name === FILE_REQUEST_NAME ? intl.formatMessage(messages.fileRequestDisplayName) : user.name;
    return (
        <ActivityCard className="bcs-Version">
            <span className="bcs-Version-message">
                <FormattedMessage
                    {...ACTION_MAP[action]}
                    values={{
                        name: <strong>{name}</strong>,
                        version_number,
                        version_promoted,
                    }}
                />
            </span>
            {onInfo ? (
                <span className="bcs-Version-actions">
                    <PlainButton
                        aria-label={intl.formatMessage(messages.getVersionInfo)}
                        className="bcs-Version-info"
                        data-resin-target={ACTIVITY_TARGETS.VERSION_CARD}
                        onClick={() => {
                            onInfo({ id, version_number });
                        }}
                        type="button"
                    >
                        <IconInfo height={16} width={16} />
                    </PlainButton>
                </span>
            ) : null}
        </ActivityCard>
    );
};

export { Version as VersionBase };
export default injectIntl(Version);
