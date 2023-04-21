// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import PlainButton from '../../../../components/plain-button';

import './RepliesToggle.scss';

type Props = {
    onHideReplies: (index: number) => void,
    onShowReplies: () => void,
    repliesShownCount: number,
    repliesTotalCount: number,
};

const RepliesToggle = ({ onShowReplies, onHideReplies, repliesShownCount, repliesTotalCount }: Props) => {
    if (repliesTotalCount <= 1) {
        return null;
    }

    const hasMoreRepliesToShow = repliesTotalCount > repliesShownCount;
    const toggleMessage = hasMoreRepliesToShow ? messages.showReplies : messages.hideReplies;
    const repliesToLoadCount = Math.max(repliesTotalCount - repliesShownCount, 0);

    const handleToggle = () => {
        if (hasMoreRepliesToShow) {
            onShowReplies();
        } else if (repliesShownCount) {
            onHideReplies(repliesShownCount - 1);
        }
    };

    return (
        <PlainButton className="bcs-RepliesToggle" onClick={handleToggle} type="button" data-testid="replies-toggle">
            <FormattedMessage values={{ repliesToLoadCount }} {...toggleMessage} />
        </PlainButton>
    );
};

export default RepliesToggle;
