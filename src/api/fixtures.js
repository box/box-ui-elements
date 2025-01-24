// @flow
import {
    FILE_ACTIVITY_TYPE_ANNOTATION,
    FILE_ACTIVITY_TYPE_COMMENT,
    FILE_ACTIVITY_TYPE_TASK,
    FILE_ACTIVITY_TYPE_VERSION,
    TASK_NEW_NOT_STARTED,
} from '../constants';

export const annotations = [
    {
        created_at: '2022-08-19T03:39:00-07:00',
        created_by: {
            id: '18836063658',
            name: 'John Doe',
            login: 'jdoe@box.com',
            type: 'user',
        },
        description: {
            message: 'test',
        },
        modified_at: '2022-08-19T03:39:00-07:00',
        modified_by: {
            id: '18836063658',
            name: 'John Doe',
            login: 'jdoe@box.com',
            type: 'user',
        },
        target: {
            location: {
                value: 1,
                type: 'page',
            },
            shape: {
                height: 48.275862068965516,
                type: 'rect',
                width: 44.827586206896555,
                x: 24.137931034482758,
                y: 20.689655172413794,
            },
            type: 'region',
        },
        id: '4441340671',
        replies: [
            {
                created_at: '1970-01-01T00:00:00.003Z',
                created_by: {
                    id: '12',
                    type: 'user',
                    name: 'u3_name',
                    login: 'u3@box.com',
                },
                id: '21',
                item: {
                    type: 'file',
                    id: 'f1',
                },
                message: 'Test message',
                modified_at: '1970-01-01T00:00:00.003Z',
                type: 'comment',
                parent: null,
                permissions: {
                    can_delete: false,
                    can_edit: false,
                    can_reply: true,
                    can_resolve: true,
                },
                replies: [],
                total_reply_count: 0,
                status: 'open',
            },
        ],
        status: 'open',
        type: 'annotation',
        permissions: {
            can_edit: true,
            can_delete: true,
            can_resolve: true,
        },
        file_version: {
            id: '1080675498428',
            version_number: 1,
            type: 'file_version',
        },
    },
];

export const fileActivitiesVersion = {
    end: {
        created_at: '2022-01-05T10:12:28.000-08:00',
        created_by: {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
        id: '123',
        number: 1,
        uploader_display_name: 'John Doe',
        type: 'file_version',
    },
    start: {
        created_at: '2022-01-05T10:12:28.000-08:00',
        created_by: {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
        id: '123',
        number: 1,
        uploader_display_name: 'John Doe',
        type: 'file_version',
    },
    action_by: [
        {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
    ],
    created_by: [
        {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
    ],
    type: 'versions',
    action_type: 'created',
};

export const promotedFileActivitiesVersion = {
    end: {
        created_at: '2022-01-05T10:12:28.000-08:00',
        created_by: {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
        id: '123',
        number: 4,
        uploader_display_name: 'John Doe',
        type: 'file_version',
        promoted_from: 2,
        promoted_by: {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
    },
    start: {
        created_at: '2022-01-05T10:12:28.000-08:00',
        created_by: {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
        id: '123',
        number: 4,
        uploader_display_name: 'John Doe',
        type: 'file_version',
        promoted_from: 2,
        promoted_by: {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
    },
    action_by: [
        {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
    ],
    created_by: [
        {
            id: '42',
            name: 'John Doe',
            login: 'johndoe@box.com',
            type: 'user',
        },
    ],
    type: 'versions',
    action_type: 'promoted',
};

export const annotationsWithFormattedReplies = [
    {
        created_at: '2022-08-19T03:39:00-07:00',
        created_by: {
            id: '18836063658',
            name: 'John Doe',
            login: 'jdoe@box.com',
            type: 'user',
        },
        description: {
            message: 'test',
        },
        modified_at: '2022-08-19T03:39:00-07:00',
        modified_by: {
            id: '18836063658',
            name: 'John Doe',
            login: 'jdoe@box.com',
            type: 'user',
        },
        target: {
            location: {
                value: 1,
                type: 'page',
            },
            shape: {
                height: 48.275862068965516,
                type: 'rect',
                width: 44.827586206896555,
                x: 24.137931034482758,
                y: 20.689655172413794,
            },
            type: 'region',
        },
        id: '4441340671',
        replies: [
            {
                created_at: '1970-01-01T00:00:00.003Z',
                created_by: {
                    id: '12',
                    type: 'user',
                    name: 'u3_name',
                    login: 'u3@box.com',
                },
                id: '21',
                item: {
                    type: 'file',
                    id: 'f1',
                },
                message: 'Test message',
                modified_at: '1970-01-01T00:00:00.003Z',
                tagged_message: 'Test message',
                type: 'comment',
                parent: null,
                permissions: {
                    can_delete: false,
                    can_edit: false,
                    can_reply: true,
                    can_resolve: true,
                },
                replies: [],
                total_reply_count: 0,
                status: 'open',
            },
        ],
        status: 'open',
        type: 'annotation',
        permissions: {
            can_edit: true,
            can_delete: true,
            can_resolve: true,
        },
        file_version: {
            id: '1080675498428',
            version_number: 1,
            type: 'file_version',
        },
    },
];

export const task = {
    created_by: {
        type: 'task_collaborator',
        target: { name: 'Jay-Z', id: '100' },
        id: '000',
        role: 'CREATOR',
        status: TASK_NEW_NOT_STARTED,
    },
    created_at: '2019-01-01',
    due_at: '2019-02-02',
    id: '0',
    name: 'task message',
    type: 'task',
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
    permissions: {
        can_update: false,
        can_delete: false,
        can_create_task_collaborator: false,
        can_create_task_link: false,
    },
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
    status: TASK_NEW_NOT_STARTED,
};

export const threadedComments = [
    {
        created_at: '1970-01-01T00:00:00.001Z',
        created_by: {
            id: '10',
            type: 'user',
            name: 'u1_name',
            login: 'u1@box.com',
        },
        id: '20',
        item: {
            type: 'file',
            id: 'f1',
        },
        message: '@[111:Aaron Levie] these tigers are cool!',
        modified_at: '1970-01-01T00:00:00.001Z',
        type: 'comment',
        parent: null,
        permissions: {
            can_delete: false,
            can_edit: false,
            can_reply: true,
            can_resolve: true,
        },
        replies: [
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
                message: '@[u1:Mateusz Mamczarz] Yes, they really are!',
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
        ],
        total_reply_count: 1,
        status: 'open',
    },
    {
        created_at: '1970-01-01T00:00:00.003Z',
        created_by: {
            id: '12',
            type: 'user',
            name: 'u3_name',
            login: 'u3@box.com',
        },
        id: '21',
        item: {
            type: 'file',
            id: 'f1',
        },
        message: 'Test message',
        modified_at: '1970-01-01T00:00:00.003Z',
        type: 'comment',
        parent: null,
        permissions: {
            can_delete: false,
            can_edit: false,
            can_reply: true,
            can_resolve: true,
        },
        replies: [],
        total_reply_count: 0,
        status: 'open',
    },
];

export const threadedCommentsFormatted = [
    {
        created_at: '1970-01-01T00:00:00.001Z',
        created_by: {
            id: '10',
            type: 'user',
            name: 'u1_name',
            login: 'u1@box.com',
        },
        id: '20',
        item: {
            type: 'file',
            id: 'f1',
        },
        message: '@[111:Aaron Levie] these tigers are cool!',
        modified_at: '1970-01-01T00:00:00.001Z',
        tagged_message: '@[111:Aaron Levie] these tigers are cool!',
        type: 'comment',
        parent: null,
        permissions: {
            can_delete: false,
            can_edit: false,
            can_reply: true,
            can_resolve: true,
        },
        replies: [
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
                message: '@[u1:Mateusz Mamczarz] Yes, they really are!',
                modified_at: '1970-01-01T00:00:00.002Z',
                tagged_message: '@[u1:Mateusz Mamczarz] Yes, they really are!',
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
        ],
        total_reply_count: 1,
        status: 'open',
    },
    {
        created_at: '1970-01-01T00:00:00.003Z',
        created_by: {
            id: '12',
            type: 'user',
            name: 'u3_name',
            login: 'u3@box.com',
        },
        id: '21',
        item: {
            type: 'file',
            id: 'f1',
        },
        message: 'Test message',
        modified_at: '1970-01-01T00:00:00.003Z',
        tagged_message: 'Test message',
        type: 'comment',
        parent: null,
        permissions: {
            can_delete: false,
            can_edit: false,
            can_reply: true,
            can_resolve: true,
        },
        replies: [],
        total_reply_count: 0,
        status: 'open',
    },
];

export const fileActivities = [
    { activity_type: FILE_ACTIVITY_TYPE_VERSION, source: { versions: fileActivitiesVersion } },
    { activity_type: FILE_ACTIVITY_TYPE_ANNOTATION, source: { annotation: annotationsWithFormattedReplies[0] } },
    { activity_type: FILE_ACTIVITY_TYPE_COMMENT, source: { comment: threadedCommentsFormatted[0] } },
    {
        activity_type: FILE_ACTIVITY_TYPE_TASK,
        source: {
            task: {
                ...task,
                assigned_to: {
                    ...task.assigned_to,
                    entries: [
                        {
                            id: '1',
                            target: { name: 'Beyonce', id: '2', avatar_url: '', type: 'user' },
                            status: 'not_started',
                            permissions: {
                                can_delete: false,
                                can_update: false,
                            },
                            role: 'assignee',
                            type: 'task_collaborator',
                        },
                    ],
                },
                created_by: task.created_by.target,
                status: 'not_started',
                task_type: 'general',
            },
        },
    },
];

export default {
    fileActivities,
    task,
    threadedComments,
    threadedCommentsFormatted,
};
