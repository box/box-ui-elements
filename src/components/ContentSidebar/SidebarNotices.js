/**
 * @flow
 * @file Preview details sidebar notices component
 * @author Box
 */

import React, { Fragment } from 'react';
import getProp from 'lodash/get';
import SharedLinkExpirationNotice from 'box-react-ui/lib/features/item-details/SharedLinkExpirationNotice';
import { addTime } from 'box-react-ui/lib/utils/datetime';
import ItemExpirationNotice from 'box-react-ui/lib/features/item-details/ItemExpirationNotice';
import type { BoxItem } from '../../flowTypes';
import DateField from '../Date';

const ONE_MINUTE_IN_MS = 60000;

const NOTICE_DATE_FORMAT = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
};

type Props = {
    file: BoxItem
};

/**
 * Adds one minute to a ISO formatted date string
 *
 * @private
 * @param {string} expiration - an item or shared link expiration
 * @return {string} an ISO formatted date string
 */
export function addMinuteToExpiration(expiration: string) {
    let expirationDate = new Date(expiration);
    // One minute is added to account for dates set via a date picker.
    // These dates will actually be stored as 11:59PM the night before the item expires.
    expirationDate = addTime(expirationDate, ONE_MINUTE_IN_MS);
    return expirationDate.toISOString();
}

const SidebarNotices = ({ file }: Props) => {
    let sharedLinkExpiration = getProp(file, 'shared_link.unshared_at');
    let itemExpiration = getProp(file, 'expires_at');

    if (!itemExpiration && !sharedLinkExpiration) {
        return null;
    }

    if (sharedLinkExpiration) {
        sharedLinkExpiration = addMinuteToExpiration(sharedLinkExpiration);
    }

    if (itemExpiration) {
        itemExpiration = addMinuteToExpiration(itemExpiration);
    }

    return (
        <Fragment>
            {!!itemExpiration && (
                <ItemExpirationNotice
                    expiration={<DateField date={itemExpiration} dateFormat={NOTICE_DATE_FORMAT} relative={false} />}
                    itemType='file'
                />
            )}
            {!!sharedLinkExpiration && (
                <SharedLinkExpirationNotice
                    expiration={
                        <DateField date={sharedLinkExpiration} dateFormat={NOTICE_DATE_FORMAT} relative={false} />
                    }
                />
            )}
        </Fragment>
    );
};

export default SidebarNotices;
