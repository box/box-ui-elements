/**
 * @flow
 * @file Show more/less button
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../../../../components/plain-button';

import messages from './messages';

type Props = {
    isMore: boolean,
    onClick: () => void,
};

const CollapsableMessageToggle = ({ isMore, onClick }: Props): React.Node => (
    <PlainButton className="bcs-ActivityMessage-toggleMoreLess" onClick={onClick} type="button">
        <FormattedMessage {...(isMore ? messages.activityMessageSeeMore : messages.activityMessageSeeLess)} />
    </PlainButton>
);

export default CollapsableMessageToggle;
