import React, { useEffect, useState } from 'react';
import flow from 'lodash/flow';
// import noop from 'lodash/noop';

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
        // api.getFeedAPI().feedItems(
        //     file,
        //     false,
        //     (data: Array<unknown>) => {
        //         console.log('data', data);
        //         if (data.length > 0) {
        //             // has comments, replies, annotations or tasks
        //             setCount(data.length);
        //             setShouldShowIndicator(true);
        //         }
        //     },
        //     noop,
        //     noop,
        //     {
        //         shouldShowAnnotations: false,
        //         shouldShowAppActivity: false,
        //         shouldShowReplies: false,
        //         shouldShowTasks: false,
        //         shouldShowVersions: false, // do we need to inform about versions?
        //         shouldUseUAA: true, // don't know what this is
        //     },
        // );

        const activityTypes = ['annotation', 'app_activity', 'comment', 'task'];
        const { permissions = {} } = file;
        const feedAPI = api.getFeedAPI();

        feedAPI.file = file;
        feedAPI.fetchFileActivities(permissions, activityTypes, true).then(data => {
            if (data.entries.length > 0) {
                // has comments, replies, annotations or tasks
                setCount(data.entries.length);
                setShouldShowIndicator(true);
            }
        });
    }, [api, features, file, canLoadActivities]);

    return shouldShowIndicator ? <div className="bcs-activity-indicator">{count}</div> : null;
}

export default flow([withAPIContext])(ActivityIndicator);
