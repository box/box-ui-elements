// @flow
import * as React from 'react';

type Props = {
    children: React.Node,
    hasReplies: boolean,
};

const ActivityThread = ({ children, hasReplies }: Props) => {
    if (hasReplies) {
        return <div className="bcs-ActivityThread">{children}</div>;
    }
    return children;
};

export default ActivityThread;
