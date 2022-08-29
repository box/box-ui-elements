// @flow
import * as React from 'react';
import ActivityCard from '../ActivityCard';

type Props = {
    children: React.Node,
    hasReplies: boolean,
};

const ActivityThread = ({ children, hasReplies }: Props) => {
    if (hasReplies) {
        return (
            <ActivityCard className="bcs-ActivityThread" data-testid="activity-thread">
                {children}
            </ActivityCard>
        );
    }
    return children;
};

export default ActivityThread;
