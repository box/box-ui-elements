/**
 * @flow strict
 * @file Versions Item Retention component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ReadableTime } from '../../../components/time';
import {
    VERSION_RETENTION_DELETE_ACTION,
    VERSION_RETENTION_REMOVE_ACTION,
    VERSION_RETENTION_INDEFINITE,
} from '../../../constants';
import messages from './messages';
import type { BoxItemVersionRetention } from '../../../common/types/core';

type Props = {
    retention?: BoxItemVersionRetention,
};

const RETENTION_MAP = {
    [VERSION_RETENTION_DELETE_ACTION]: messages.versionRetentionDelete,
    [VERSION_RETENTION_REMOVE_ACTION]: messages.versionRetentionRemove,
};

const VersionsItemRetention = ({ retention }: Props) => {
    const { disposition_at: dispositionAt, winning_retention_policy: retentionPolicy } = retention || {};
    const { disposition_action: dispositionAction, retention_length: retentionLength } = retentionPolicy || {};
    const dispositionAtTime = dispositionAt && new Date(dispositionAt).getTime();

    if (!dispositionAction) {
        return null;
    }

    return retentionLength === VERSION_RETENTION_INDEFINITE || !dispositionAtTime ? (
        <FormattedMessage {...messages.versionRetentionIndefinite} />
    ) : (
        <FormattedMessage
            {...RETENTION_MAP[dispositionAction]}
            values={{
                time: <ReadableTime timestamp={dispositionAtTime} showWeekday />,
            }}
        />
    );
};

export default VersionsItemRetention;
