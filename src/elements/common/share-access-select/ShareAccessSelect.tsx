/**
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import * as React from 'react';
import { useIntl } from 'react-intl';
import { ACCESS_NONE, ACCESS_OPEN, ACCESS_COLLAB, ACCESS_COMPANY } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';

import './ShareAccessSelect.scss';

import messages from '../messages';

export interface ShareAccessSelectProps {
    canSetShareAccess: boolean;
    className: string;
    item: BoxItem;
    onChange: (value: string, item: BoxItem) => void;
}

const ShareAccessSelect = ({ className, canSetShareAccess, onChange, item }: ShareAccessSelectProps) => {
    const { formatMessage } = useIntl();
    const { allowed_shared_link_access_levels: allowedSharedAccessLevels, permissions, shared_link: sharedLink } = item;

    if (!allowedSharedAccessLevels) {
        return <span />;
    }

    const { access = ACCESS_NONE } = sharedLink || {};
    const { can_set_share_access: allowShareAccessChange } = permissions || {};

    const changeHandler = ({ target }: React.ChangeEvent<HTMLSelectElement>) => onChange(target.value, item);
    const allowOpen = allowedSharedAccessLevels.indexOf(ACCESS_OPEN) > -1;
    const allowCollab = allowedSharedAccessLevels.indexOf(ACCESS_COLLAB) > -1;
    const allowCompany = allowedSharedAccessLevels.indexOf(ACCESS_COMPANY) > -1;
    const allowed = canSetShareAccess && allowShareAccessChange && (allowOpen || allowCompany || allowCollab);

    if (!allowed) {
        return <span />;
    }

    /* eslint-disable jsx-a11y/no-onchange */
    return (
        <select className={`be-share-access-select ${className}`} onChange={changeHandler} value={access}>
            {allowOpen ? <option value={ACCESS_OPEN}>{formatMessage(messages.shareAccessOpen)}</option> : null}
            {allowCollab ? <option value={ACCESS_COLLAB}>{formatMessage(messages.shareAccessCollab)}</option> : null}
            {allowCompany ? <option value={ACCESS_COMPANY}>{formatMessage(messages.shareAccessCompany)}</option> : null}
            <option value={ACCESS_NONE}>
                {access === ACCESS_NONE
                    ? formatMessage(messages.shareAccessNone)
                    : formatMessage(messages.shareAccessRemove)}
            </option>
        </select>
    );
};

export default ShareAccessSelect;
