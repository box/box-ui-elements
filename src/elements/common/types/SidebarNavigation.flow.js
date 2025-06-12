/* @flow */

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

type VersionSidebarView = {
    sidebar: 'activity' | 'details',
    versionId: string,
};

export type ActivityAnnotationsSidebarView = {
    sidebar: 'activity',
    activeFeedEntryType: 'annotations',
    fileVersionId: string,
    activeFeedEntryId: string,
};
type ActivityCommentsSidebarView = {
    sidebar: 'activity',
    activeFeedEntryType: 'comments' | 'tasks',
    activeFeedEntryId: string,
};

export type SidebarNavigation =
    | {
          sidebar: ViewTypeValues,
      }
    | VersionSidebarView
    | ActivityCommentsSidebarView
    | ActivityAnnotationsSidebarView;

export type InternalSidebarNavigation = SidebarNavigation & {
    open: boolean,
};

export type SidebarNavigationHandler = (sidebar: SidebarNavigation, replace?: boolean) => void;

export type InternalSidebarNavigationHandler = (sidebar: InternalSidebarNavigation, replace?: boolean) => void;
