import React, { useEffect, useState } from 'react';
import flow from 'lodash/flow';
import noop from 'lodash/noop';

import { withAPIContext } from '../common/api-context';

import './ActivityIndicator.scss';

export function ActivityIndicator({ api, features, file }) {
    const [count, setCount] = useState(0);
    const [shouldShowIndicator, setShouldShowIndicator] = useState(false);
    const [canLoadActivities, setCanLoadActivities] = useState(true);

    useEffect(() => {
        // early return to not refetch on every re-render
        if (!canLoadActivities) {
            return;
        }
        setCanLoadActivities(false);
        api.getFeedAPI().feedItems(
            file,
            false,
            (data: Array<unknown>) => {
                if (data.length > 0) {
                    // has comments, replies, annotations or tasks
                    setCount(data.length);
                    setShouldShowIndicator(true);
                }
            },
            noop,
            noop,
            {
                shouldShowAnnotations: true,
                shouldShowAppActivity: true,
                shouldShowReplies: true,
                shouldShowTasks: true,
                shouldShowVersions: false, // do we need to inform about versions?
                shouldUseUAA: false, // don't know what this is
            },
        );
    }, [api, features, file, canLoadActivities]);

    return shouldShowIndicator ? <div className="bcs-activity-indicator">{count}</div> : null;
}

export default flow([withAPIContext])(ActivityIndicator);
