/* eslint-disable @typescript-eslint/camelcase */
export const annotations = [
    { id: 'anno_1', target: { shape: { height: 10, width: 10, x: 10, y: 10, type: 'rect' }, type: 'region' } },
    { id: 'anno_2', target: { shape: { height: 20, width: 20, x: 20, y: 20, type: 'rect' }, type: 'region' } },
    { id: 'anno_3', target: { shape: { height: 30, width: 30, x: 30, y: 30, type: 'rect' }, type: 'region' } },
];

export const scale = 1;

export const rect = {
    type: 'rect' as const,
    height: 10,
    width: 10,
    x: 10,
    y: 10,
};

export const target = {
    id: 'target_1',
    location: {
        type: 'page' as const,
        value: 1,
    },
    shape: rect,
    type: 'region' as const,
};

export const user = {
    id: '1',
    login: 'johndoe',
    name: 'John Doe',
    type: 'user' as const,
};

export const annotation = {
    created_at: '2020-09-20T00:00:00Z',
    created_by: user,
    description: {
        message: 'mock annotation',
        type: 'reply' as const,
    },
    file_version: {
        id: '123',
        type: 'file_version' as const,
    },
    id: '123',
    modified_at: '2020-09-20T00:00:00Z',
    modified_by: user,
    permissions: {
        can_delete: true,
        can_edit: true,
    },
    target,
    type: 'annotation' as const,
};
