export const replies = [
    {
        created_at: '2020-09-20T00:00:00Z',
        created_by: {
            id: '1',
            login: 'johndoe',
            name: 'John Doe',
            type: 'user' as const,
        },
        id: '2485934',
        message: 'First reply',
        tagged_message: 'First reply',
        modified_at: '2020-09-20T00:00:00Z',
        modified_by: {
            id: '1',
            login: 'johndoe',
            name: 'John Doe',
            type: 'user' as const,
        },
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
        created_by: {
            id: '1',
            login: 'johndoe',
            name: 'John Doe',
            type: 'user' as const,
        },
        id: '24835935',
        message: 'Last reply',
        tagged_message: 'Last reply',
        modified_at: '2020-09-20T00:00:00Z',
        modified_by: {
            id: '1',
            login: 'johndoe',
            name: 'John Doe',
            type: 'user' as const,
        },
        permissions: {
            can_delete: true,
            can_edit: true,
            can_reply: false,
            can_resolve: true,
        },
        type: 'comment' as const,
    },
];

export default { replies };
