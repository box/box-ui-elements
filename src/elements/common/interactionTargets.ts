export const SIDEBAR_NAV_TARGETS = {
    BOXAI: 'sidebarboxai',
    ACTIVITY: 'sidebaractivity',
    DETAILS: 'sidebardetails',
    SIGN: 'sidebarsign',
    SKILLS: 'sidebarskills',
    METADATA: 'sidebarmetadata',
    TOGGLE: 'sidebartoggle',
    DOCGEN: 'sidebardocgen',
} as const;

export const SECTION_TARGETS = {
    FILE_PROPERTIES: 'fileproperties',
    ACCESS_STATS: 'accessstats',
    CLASSIFICATION: 'classification',
} as const;

export const DETAILS_TARGETS = {
    ACCESS_STATS: {
        COMMENTS: 'accessstats-comments',
        DOWNLOADS: 'accessstats-downloads',
        EDITS: 'accessstats-edits',
        PREVIEWS: 'accessstats-previews',
        VIEWS: 'accessstats-views',
        VIEW_DETAILS: 'accessstats-viewdetails',
    },
    CLASSIFICATION_ADD: 'addclassification',
    CLASSIFICATION_EDIT: 'editclassification',
    DESCRIPTION: 'description',
    VERSION_HISTORY: 'versionhistory',
} as const;

export const ACTIVITY_TARGETS = {
    ANNOTATION_OPTIONS_DELETE: 'activityfeed-annotation-delete',
    ANNOTATION_OPTIONS_EDIT: 'activityfeed-annotation-edit',
    ANNOTATION_OPTIONS_RESOLVE: 'activityfeed-annotation-resolve',
    ANNOTATION_OPTIONS_UNRESOLVE: 'activityfeed-annotation-unresolve',
    ANNOTATION_OPTIONS: 'activityfeedannotation',
    APPROVAL_FORM_ADD_TASK: 'activityfeed-apporvalformaddtask',
    APPROVAL_FORM_CANCEL: 'activityfeed-approvalformcancel',
    APPROVAL_FORM_POST: 'activityfeed-approvalformpost',
    COMMENT_OPTIONS: 'activityfeedcomment',
    COMMENT_OPTIONS_DELETE: 'activityfeed-comment-delete',
    COMMENT_OPTIONS_EDIT: 'activityfeed-comment-edit',
    INLINE_DELETE_CANCEL: 'activityfeed-delete-cancel',
    INLINE_DELETE_CONFIRM: 'activityfeed-delete-confirm',
    MENTION: 'activityfeed-mentionlink',
    PROFILE: 'activityfeed-profilelink',
    TASK_APPROVE: 'activityfeed-taskapprove',
    TASK_COMPLETE: 'activityfeed-taskcomplete',
    TASK_DATE_PICKER: 'activityfeed-taskdatepicker',
    TASK_VIEW_DETAILS: 'activityfeed-viewtaskdetails',
    TASK_OPTIONS: 'activityfeedtask',
    TASK_OPTIONS_DELETE: 'activityfeed-task-delete',
    TASK_OPTIONS_EDIT: 'activityfeed-task-edit',
    TASK_REJECT: 'activityfeed-taskreject',
    VERSION_CARD: 'activityfeed-versioninfo',
} as const;

export const SKILLS_TARGETS = {
    FACES: {
        CARD: 'skill-facecard',
        FACE: 'skill-face',
        DELETE: 'skill-facedelete',
        EDIT: 'skill-faceedit',
        EDIT_SAVE: 'skill-faceeditsave',
        EDIT_CANCEL: 'skill-faceeditcancel',
        TIMELINE: 'skill-facetimeslice',
    },
    KEYWORDS: {
        CARD: 'skill-keywordcard',
        EDIT: 'skill-keywordedit',
        EDIT_SAVE: 'skill-keywordeditsave',
        EDIT_CANCEL: 'skill-keywordeditcancel',
        TIMELINE: 'skill-keywordtimeslice',
        SELECT: 'skill-keywordselect',
    },
    TRANSCRIPTS: {
        CARD: 'skill-transcriptcard',
        COPY: 'skill-transcriptcopy',
        EDIT: 'skill-transcriptedit',
        EXPAND: 'skill-transcriptexpand',
        EDIT_SAVE: 'skill-transcripteditsave',
        EDIT_CANCEL: 'skill-transcripteditcancel',
        TRANSCRIPT: 'skill-transcript',
        EDIT_TEXT: 'skill-transcriptedittext',
    },
    TIMELINE: {
        NEXT: 'skill-timelimelinenext',
        PREVIOUS: 'skill-timelineprevious',
    },
} as const;

export const INTERACTION_TARGET = 'data-resin-target';

export type ActivityTargetType = (typeof ACTIVITY_TARGETS)[keyof typeof ACTIVITY_TARGETS];
