/**
 * @flow
 * @file Preview details sidebar notices component
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import SharedLinkExpirationNotice from 'box-react-ui/lib/features/item-details/SharedLinkExpirationNotice';
import SidebarSection from './SidebarSection';
import { addTime } from '../../util/datetime';
import type { BoxItem } from '../../flowTypes';
import DateField from '../Date';

const ONE_MINUTE_IN_MS = 60000;

type Props = {
    file: BoxItem
};

const SidebarNotices = ({ file }: Props) => {
    let sharedLinkExpiration = getProp(file, 'shared_link.unshared_at');

    if (sharedLinkExpiration) {
        sharedLinkExpiration = new Date(sharedLinkExpiration);
        // One minute is added to account for dates set via a date picker.
        // These dates will actually be stored as 11:59PM the night before the item expires.
        sharedLinkExpiration = addTime(sharedLinkExpiration, ONE_MINUTE_IN_MS);
        sharedLinkExpiration = sharedLinkExpiration.toISOString();
    }

    return (
        !!sharedLinkExpiration && (
            <SidebarSection>
                <SharedLinkExpirationNotice
                    expiration={
                        <DateField
                            date={sharedLinkExpiration}
                            dateFormat={{
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }}
                            relative={false}
                        />
                    }
                />
            </SidebarSection>
        )
    );
};

export default SidebarNotices;
