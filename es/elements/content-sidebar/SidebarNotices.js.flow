/**
 * @flow
 * @file Preview details sidebar notices component
 * @author Box
 */

import * as React from 'react';
import getProp from 'lodash/get';
import SharedLinkExpirationNotice from '../../features/item-details/SharedLinkExpirationNotice';
import ItemExpirationNotice from '../../features/item-details/ItemExpirationNotice';
import { addTime } from '../../utils/datetime';

import DateField from '../common/date';

import type { BoxItem } from '../../common/types/core';

const ONE_MINUTE_IN_MS = 60000;

const NOTICE_DATE_FORMAT = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
};

type Props = {
    file: BoxItem,
};

const SidebarNotices = ({ file }: Props) => {
    const itemExpiration = getProp(file, 'expires_at');
    const sharedLinkExpiration = getProp(file, 'shared_link.unshared_at');

    if (!itemExpiration && !sharedLinkExpiration) {
        return null;
    }

    return (
        <>
            {!!itemExpiration && (
                <ItemExpirationNotice
                    expiration={
                        <DateField
                            // $FlowFixMe
                            date={addTime(new Date(itemExpiration), ONE_MINUTE_IN_MS)}
                            dateFormat={NOTICE_DATE_FORMAT}
                            relative={false}
                        />
                    }
                    itemType="file"
                />
            )}
            {!!sharedLinkExpiration && (
                <SharedLinkExpirationNotice
                    expiration={
                        <DateField
                            // $FlowFixMe
                            date={addTime(new Date(sharedLinkExpiration), ONE_MINUTE_IN_MS)}
                            dateFormat={NOTICE_DATE_FORMAT}
                            relative={false}
                        />
                    }
                />
            )}
        </>
    );
};

export default SidebarNotices;
