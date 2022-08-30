// @flow
import { TASK_NEW_NOT_STARTED } from '../../constants';

export const filterableActivityFeedItems = {
    annotationOpen: {
        type: 'annotation',
        id: 'open2',
        tagged_message: '',
        message: 'test',
        created_at: '2022-07-26T09:08:20-07:00',
        created_by: {
            type: 'user',
            id: '6187936317',
            name: 'Jhon',
            login: 'jdoe@box.com',
        },
        modified_at: '2022-07-26T09:08:20-07:00',
        permissions: {
            can_delete: true,
            can_edit: true,
            can_reply: true,
        },
        status: 'open',
    },
    annotationResolved: {
        type: 'annotation',
        id: 'open2',
        tagged_message: '',
        message: 'test',
        created_at: '2022-07-26T09:08:20-07:00',
        created_by: {
            type: 'user',
            id: '6187936317',
            name: 'Jhon',
            login: 'jdoe@box.com',
        },
        modified_at: '2022-07-26T09:08:20-07:00',
        permissions: {
            can_delete: true,
            can_edit: true,
            can_reply: true,
        },
        status: 'resolved',
    },
    commentOpen: {
        type: 'comment',
        id: 'open1',
        tagged_message: '',
        message: 'test',
        created_at: '2022-07-26T09:08:20-07:00',
        created_by: {
            type: 'user',
            id: '6187936317',
            name: 'Jhon',
            login: 'jdoe@box.com',
        },
        modified_at: '2022-07-26T09:08:20-07:00',
        permissions: {
            can_delete: true,
            can_edit: true,
            can_reply: true,
        },
        status: 'open',
    },
    commentResolved: {
        type: 'comment',
        id: 'open1',
        tagged_message: '',
        message: 'test',
        created_at: '2022-07-26T09:08:20-07:00',
        created_by: {
            type: 'user',
            id: '6187936317',
            name: 'Jhon',
            login: 'jdoe@box.com',
        },
        modified_at: '2022-07-26T09:08:20-07:00',
        permissions: {
            can_delete: true,
            can_edit: true,
            can_reply: true,
        },
        status: 'resolved',
    },
    taskItem: {
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
    },
};

export default {
    filterableActivityFeedItems,
};
