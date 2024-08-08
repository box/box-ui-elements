// @flow
import {
    FILE_ACTIVITY_TYPE_VERSION,
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
    TASK_NEW_NOT_STARTED,
} from '../../constants';

export const filterableActivityFeedItems = {
    annotationOpen: {
        activity_type: FEED_ITEM_TYPE_ANNOTATION,
        source: {
            annotation: {
                created_at: '2022-07-26T09:08:20-07:00',
                created_by: {
                    id: '6187936317',
                    name: 'Jhon',
                    login: 'jdoe@box.com',
                    type: 'user',
                },
                description: {
                    message: 'test',
                },
                id: 'open2',
                modified_at: '2022-07-26T09:08:20-07:00',
                permissions: {
                    can_delete: true,
                    can_edit: true,
                    can_reply: true,
                },
                status: 'open',
                type: FEED_ITEM_TYPE_ANNOTATION,
            },
        },
    },
    annotationResolved: {
        activity_type: FEED_ITEM_TYPE_ANNOTATION,
        source: {
            annotation: {
                created_at: '2022-07-26T09:08:20-07:00',
                created_by: {
                    type: 'user',
                    id: '6187936317',
                    name: 'Jhon',
                    login: 'jdoe@box.com',
                },
                description: {
                    message: 'test',
                },
                id: 'open2',
                modified_at: '2022-07-26T09:08:20-07:00',
                permissions: {
                    can_delete: true,
                    can_edit: true,
                    can_reply: true,
                },
                status: 'resolved',
                type: FEED_ITEM_TYPE_ANNOTATION,
            },
        },
    },
    commentOpen: {
        activity_type: FEED_ITEM_TYPE_COMMENT,
        source: {
            comment: {
                created_at: '2022-07-26T09:08:20-07:00',
                created_by: {
                    type: 'user',
                    id: '6187936317',
                    name: 'Jhon',
                    login: 'jdoe@box.com',
                },
                id: 'open1',
                message: 'test',
                modified_at: '2022-07-26T09:08:20-07:00',
                permissions: {
                    can_delete: true,
                    can_edit: true,
                    can_reply: true,
                },
                status: 'open',
                type: FEED_ITEM_TYPE_COMMENT,
            },
        },
    },
    commentResolved: {
        activity_type: FEED_ITEM_TYPE_COMMENT,
        source: {
            comment: {
                created_at: '2022-07-26T09:08:20-07:00',
                created_by: {
                    type: 'user',
                    id: '6187936317',
                    name: 'Jhon',
                    login: 'jdoe@box.com',
                },
                id: 'open1',
                message: 'test',
                modified_at: '2022-07-26T09:08:20-07:00',
                permissions: {
                    can_delete: true,
                    can_edit: true,
                    can_reply: true,
                },
                status: 'resolved',
                type: FEED_ITEM_TYPE_COMMENT,
            },
        },
    },
    taskItem: {
        activity_type: FEED_ITEM_TYPE_TASK,
        source: {
            task: {
                assigned_to: {
                    entries: [
                        {
                            id: '1',
                            target: { name: 'Beyonce', id: '2', avatar_url: '', type: 'user' },
                            status: TASK_NEW_NOT_STARTED,
                            permissions: {
                                can_delete: false,
                                can_update: false,
                            },
                            role: 'ASSIGNEE',
                            type: 'task_collaborator',
                        },
                    ],
                    limit: 10,
                    next_marker: null,
                },
                created_at: '2019-01-01',
                created_by: {
                    type: 'task_collaborator',
                    target: { name: 'Jay-Z', id: '100' },
                    id: '000',
                    role: 'CREATOR',
                    status: TASK_NEW_NOT_STARTED,
                },
                due_at: '2019-02-02',
                id: '0',
                permissions: {
                    can_update: false,
                    can_delete: false,
                    can_create_task_collaborator: false,
                    can_create_task_link: false,
                },
                status: TASK_NEW_NOT_STARTED,
                task_links: {
                    entries: [
                        {
                            id: '03',
                            type: 'task_link',
                            target: {
                                type: 'file',
                                id: '4',
                            },
                            permissions: {
                                can_delete: false,
                                can_update: false,
                            },
                        },
                    ],
                    limit: 1,
                    next_marker: null,
                },
                type: FEED_ITEM_TYPE_TASK,
            },
        },
    },
    versionItem: {
        activity_type: FILE_ACTIVITY_TYPE_VERSION,
        source: {
            versions: {
                id: '1060370614597',
                authenticated_download_url: 'https://someurl.com',
                created_at: '2022-07-06T03:01:28-07:00',
                extension: 'boxnote',
                is_download_available: true,
                modified_at: '2022-07-06T03:01:28-07:00',
                modified_by: {
                    type: 'user',
                    id: '18836063940',
                    name: 'John Doe',
                    login: 'jdoe@box.com',
                },
                name: 'Title',
                permissions: {
                    can_download: true,
                    can_preview: true,
                    can_delete: true,
                    can_annotate: false,
                    can_view_annotations_all: true,
                    can_view_annotations_self: true,
                    can_create_annotations: false,
                    can_view_annotations: false,
                },
                restored_at: null,
                restored_by: null,
                retention: null,
                size: 4159,
                trashed_at: null,
                trashed_by: null,
                type: FEED_ITEM_TYPE_VERSION,
                uploader_display_name: 'John Doe',
            },
        },
    },
};

export const formattedReplies = [
    {
        created_at: '1970-01-01T00:00:00.002Z',
        created_by: {
            id: '11',
            type: 'user',
            name: 'u2_name',
            login: 'u2@box.com',
        },
        id: '21',
        item: {
            type: 'file',
            id: 'f1',
        },
        tagged_message: '@[u1:Mateusz Mamczarz] Yes, they really are!',
        modified_at: '1970-01-01T00:00:00.002Z',
        type: 'comment',
        parent: {
            id: 'c1',
            type: 'comment',
        },
        permissions: {
            can_delete: false,
            can_edit: false,
            can_reply: false,
            can_resolve: true,
        },
        replies: [],
        total_reply_count: 0,
        status: 'open',
    },
    {
        created_at: '1970-01-01T00:00:00.002Z',
        created_by: {
            id: '11',
            type: 'user',
            name: 'u2_name',
            login: 'u2@box.com',
        },
        id: '22',
        item: {
            type: 'file',
            id: 'f1',
        },
        tagged_message: '@[u1:Mateusz Mamczarz] Yes, they really are!',
        modified_at: '1970-01-01T00:00:00.002Z',
        type: 'comment',
        parent: {
            id: 'c1',
            type: 'comment',
        },
        permissions: {
            can_delete: false,
            can_edit: false,
            can_reply: false,
            can_resolve: true,
        },
        replies: [],
        total_reply_count: 0,
        status: 'open',
    },
];

export default {
    filterableActivityFeedItems,
    formattedReplies,
};
