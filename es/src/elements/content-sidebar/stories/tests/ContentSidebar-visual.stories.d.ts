import { type StoryObj } from '@storybook/react';
import ContentSidebarComponent from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebarContent';
declare const _default: {
    title: string;
    component: any;
    args: {
        detailsSidebarProps: {
            hasProperties: boolean;
            hasNotices: boolean;
            hasAccessStats: boolean;
            hasClassification: boolean;
            hasRetentionPolicy: boolean;
        };
        features: Record<string, boolean>;
        fileId: string;
        hasActivityFeed: boolean;
        hasMetadata: boolean;
        hasSkills: boolean;
        hasVersions: boolean;
        token: string;
    };
};
export default _default;
export declare const Modernization: {
    args: {
        enableModernizedComponents: boolean;
    };
};
export declare const ContentSidebarWithBoxAIDisabled: StoryObj<typeof BoxAISidebar>;
export declare const ContentSidebarWithBoxAIEnabled: StoryObj<typeof BoxAISidebar>;
export declare const ContentSidebarDetailsTab: StoryObj<typeof ContentSidebarComponent>;
