import * as React from 'react';
export declare const fileVersion: {
    args: {
        collection: unknown[];
        contentSidebarProps: {
            hasActivityFeed: boolean;
            hasSkills: boolean;
            hasVersions: boolean;
            detailsSidebarProps: {
                hasAccessStats: boolean;
                hasClassification: boolean;
                hasNotices: boolean;
                hasProperties: boolean;
                hasRetentionPolicy: boolean;
                hasVersions: boolean;
            };
        };
        fileId: any;
    };
};
export declare const noSidebar: {
    args: {
        fileId: any;
    };
};
export declare const withSidebar: {
    args: {
        collection: unknown[];
        contentSidebarProps: {
            hasActivityFeed: boolean;
            hasSkills: boolean;
            detailsSidebarProps: {
                hasAccessStats: boolean;
                hasClassification: boolean;
                hasNotices: boolean;
                hasProperties: boolean;
                hasRetentionPolicy: boolean;
                hasVersions: boolean;
            };
        };
        fileId: any;
    };
};
declare const _default: {
    title: string;
    component: any;
    render: ({ ...args }: {
        [x: string]: any;
    }) => React.JSX.Element;
    args: {
        features: Record<string, boolean>;
        fileId: string;
        hasHeader: boolean;
        token: string;
    };
    parameters: {
        chromatic: {
            disableSnapshot: boolean;
        };
    };
};
export default _default;
