/**
 * @flow
 * @file Preview details sidebar notices component
 * @author Box
 */

import React from 'react';
import SharedLinkExpirationNotice from 'box-react-ui/lib/features/item-details/SharedLinkExpirationNotice';

import DateField from '../Date';

type Props = {
    sharedLinkExpiration: ?string
};

const SidebarNotices = ({ sharedLinkExpiration }: Props) => (
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
);

export default SidebarNotices;
