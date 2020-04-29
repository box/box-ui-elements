const mockAnnotation = {
    created_at: 'Thu Sep 20 33658 19:45:39 GMT-0600 (CST)',
    creatd_by: { name: 'John', id: '987' },
    description: 'mock annotation',
    file_version: {
        id: '123',
    },
    id: '135',
    modified_at: 'Thu Sep 20 33658 19:46:39 GMT-0600 (CST)',
    modified_by: { name: 'John', id: '987' },
    permissions: { can_delete: true, can_edit: true },
    target: {
        location: {
            type: 'page',
            value: 1,
        },
        shape: {
            type: 'rect',
            height: 10,
            width: 10,
            x: 1,
            y: 1,
        },
        type: 'region',
    },
};

export { mockAnnotation as default };
