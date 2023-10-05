import React from 'react';

const ActivityFeedContext = React.createContext();

export function useActivityFeedContext() {
    return React.useContext(ActivityFeedContext);
}

export default ActivityFeedContext;
