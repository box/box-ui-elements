export enum ViewType {
    SKILLS = 'skills',
    DETAILS = 'details',
    METADATA = 'metadata',
    METADATA_REDESIGN = 'metadata_redesign',
    BOXAI = 'boxai',
    ACTIVITY = 'activity',
    VERSIONS = 'versions',
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

export type MetadataSidebarView = {
    sidebar: ViewType.METADATA | ViewType.METADATA_REDESIGN;
    filteredTemplateIds?: string;
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
    | MetadataSidebarView
    | ActivityCommentsSidebarView
    | ActivityAnnotationsSidebarView;

export type InternalSidebarNavigation = SidebarNavigation & {
    open?: boolean;
};

export type SidebarNavigationHandler = (sidebar: SidebarNavigation, replace?: boolean) => void;

export type InternalSidebarNavigationHandler = (sidebar: InternalSidebarNavigation, replace?: boolean) => void;
