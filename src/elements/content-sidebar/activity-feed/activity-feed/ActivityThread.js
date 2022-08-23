// @flow
import * as React from 'react';
import ActivityCard from '../ActivityCard';

type Props = {
    children: React.Node,
};

const ActivityThread = ({ children }: Props) => {
    return <ActivityCard className="bcs-ActivityThread">{children}</ActivityCard>;
};

export default ActivityThread;
