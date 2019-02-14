// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Badge from '../../components/badge';
import { Link } from '../../components/link';

import messages from './messages';

import './ReferAFriendAd.scss';

const ReferAFriendAd = () => (
    <div>
        <Badge type="success">
            <FormattedMessage {...messages.referAFriendBadgeText} />
        </Badge>
        &nbsp;&nbsp;
        <FormattedMessage {...messages.referAFriendText} />
        &nbsp;
        <Link
            className="refer-a-friend-reward-center-link"
            href="/master/settings/rewardCenter"
            rel="noopener noreferrer"
            target="_blank"
        >
            <FormattedMessage {...messages.referAFriendRewardCenterLinkText} />
        </Link>
    </div>
);

export default ReferAFriendAd;
