import { user } from './annotations';

const replies = [
    {
        created_at: '2020-09-20T00:00:00Z',
        created_by: user,
        id: '2485934',
        message: 'test reply',
        modified_at: '2020-09-20T00:00:00Z',
        modified_by: user,
        permissions: {
            can_delete: true,
            can_edit: true,
            can_reply: false,
            can_resolve: true,
        },
        type: 'comment' as const,
    },
    {
        created_at: '2020-09-20T00:00:00Z',
        created_by: user,
        id: '24835935',
        message: 'Another reply',
        modified_at: '2020-09-20T00:00:00Z',
        modified_by: user,
        permissions: {
            can_delete: true,
            can_edit: true,
            can_reply: false,
            can_resolve: true,
        },
        type: 'comment' as const,
    },
];

export default replies;
