/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import type { BoxItem } from '../../flowTypes';
import { ACCESS_NONE, ACCESS_OPEN, ACCESS_COLLAB, ACCESS_COMPANY } from '../../constants';

type Props = {
    canSetShareAccess: boolean,
    onChange: Function,
    item: BoxItem,
    getLocalizedMessage: Function,
    className: string
};

/* eslint-disable jsx-a11y/label-has-for */
const ShareAccessSelect = ({ className, canSetShareAccess, onChange, item, getLocalizedMessage }: Props) => {
    const { allowed_shared_link_access_levels: allowedSharedAccessLevels, permissions, shared_link: sharedLink } = item;

    if (!allowedSharedAccessLevels) {
        return <span />;
    }

    const { access = ACCESS_NONE } = sharedLink || {};
    const { can_set_share_access: allowShareAccessChange } = permissions || {};

    const changeHandler = ({ target }) => onChange(target.value, item);
    const allowOpen = allowedSharedAccessLevels.indexOf(ACCESS_OPEN) > -1;
    const allowCollab = allowedSharedAccessLevels.indexOf(ACCESS_COLLAB) > -1;
    const allowCompany = allowedSharedAccessLevels.indexOf(ACCESS_COMPANY) > -1;
    const allowed = canSetShareAccess && allowShareAccessChange && (allowOpen || allowCompany || allowCollab);

    if (!allowed) {
        return <span />;
    }

    return (
        <select className={className} value={access} onChange={changeHandler}>
            {allowOpen
                ? <option value={ACCESS_OPEN}>
                    {getLocalizedMessage('buik.item.share.access.open')}
                </option>
                : null}
            {allowCollab
                ? <option value={ACCESS_COLLAB}>
                    {getLocalizedMessage('buik.item.share.access.collaborators')}
                </option>
                : null}
            {allowCompany
                ? <option value={ACCESS_COMPANY}>
                    {getLocalizedMessage('buik.item.share.access.company')}
                </option>
                : null}
            <option value={ACCESS_NONE}>
                {access === ACCESS_NONE
                    ? getLocalizedMessage('buik.item.share.access.none')
                    : getLocalizedMessage('buik.item.share.access.remove')}
            </option>
        </select>
    );
};

export default ShareAccessSelect;
