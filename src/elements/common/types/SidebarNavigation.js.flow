/* @flow */

// flow version is simplified compared to Type Script due to difficult to resolve problems with Union Types
// Type Script works better with Union Types

export const ViewType = Object.freeze({
    BOXAI: 'boxai',
    SKILLS: 'skills',
    ACTIVITY: 'activity',
    DETAILS: 'details',
    METADATA: 'metadata',
    DOCGEN: 'docgen',
});

export const FeedEntryType = Object.freeze({
    ANNOTATIONS: 'annotations',
    COMMENTS: 'comments',
    TASKS: 'tasks',
});

export type ViewTypeValues = $Values<typeof ViewType>;
export type FeedEntryTypeValues = $Values<typeof FeedEntryType>;

export type SidebarNavigation = {
    sidebar: ViewTypeValues,
    versionId?: string,
    activeFeedEntryType?: FeedEntryTypeValues,
    activeFeedEntryId?: string,
    fileVersionId?: string,
};

export type InternalSidebarNavigation = SidebarNavigation & {
    open: boolean,
};

export type SidebarNavigationHandler = (sidebar: SidebarNavigation, replace?: boolean) => void;

export type InternalSidebarNavigationHandler = (sidebar: InternalSidebarNavigation, replace?: boolean) => void;
