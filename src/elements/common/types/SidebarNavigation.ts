export enum ViewType {
    BOXAI = 'boxai',
    SKILLS = 'skills',
    ACTIVITY = 'activity',
    DETAILS = 'details',
    METADATA = 'metadata',
    DOCGEN = 'docgen',
}

export enum FeedEntryType {
    ANNOTATIONS = 'annotations',
    COMMENTS = 'comments',
    TASKS = 'tasks',
}

type VersionSidebarView = {
    sidebar: ViewType.ACTIVITY | ViewType.DETAILS;
    versionId: string;
};

export type ActivityAnnotationsSidebarView = {
    sidebar: ViewType.ACTIVITY;
    activeFeedEntryType: FeedEntryType.ANNOTATIONS;
    fileVersionId: string;
    activeFeedEntryId: string;
};
type ActivityCommentsSidebarView = {
    sidebar: ViewType.ACTIVITY;
    activeFeedEntryType: FeedEntryType.COMMENTS | FeedEntryType.TASKS;
    activeFeedEntryId: string;
};

export type SidebarNavigation =
    | {
          sidebar: ViewType;
      }
    | VersionSidebarView
    | ActivityCommentsSidebarView
    | ActivityAnnotationsSidebarView;

export type InternalSidebarNavigation = SidebarNavigation & {
    open: boolean;
};

export type SidebarNavigationHandler = (sidebar: SidebarNavigation, replace?: boolean) => void;

export type InternalSidebarNavigationHandler = (sidebar: InternalSidebarNavigation, replace?: boolean) => void;
