// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { ButtonType } from 'types';
import messages from './messages';
import PlainButton from '../../../../components/plain-button';

type Props = {
    isAlwaysExpanded?: boolean,
    isRepliesLoading: boolean,
    onHideReplies: (index: number) => void,
    onShowReplies: () => void,
    repliesShownCount: number,
    repliesTotalCount: number,
};

const RepliesToggle = ({
    isAlwaysExpanded = false,
    isRepliesLoading,
    onShowReplies,
    onHideReplies,
    repliesShownCount,
    repliesTotalCount,
}: Props) => {
    if (isAlwaysExpanded || isRepliesLoading || repliesTotalCount <= 1) {
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
        <PlainButton className="bcs-Replies-toggle" onClick={handleToggle} type={ButtonType.BUTTON}>
            <FormattedMessage values={{ repliesToLoadCount }} {...toggleMessage} />
        </PlainButton>
    );
};

export default RepliesToggle;
