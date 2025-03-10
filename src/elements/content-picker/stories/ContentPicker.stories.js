// @flow
import ContentPicker from '../ContentPicker';

export const basic = {};

export const withCustomActions = {
    args: {
        itemActions: [
            { label: 'Alert', onAction: () => alert('This is an action!') },
            { label: 'Download All Files', onAction: () => alert('This is an action!'), type: 'folder' },
            {
                filter: ({ extension }) => extension?.toUpperCase() === 'PDF',
                label: 'Send Box Sign Request',
                onAction: () => alert('This is an action!'),
            },
        ],
    },
};

export default {
    title: 'Elements/ContentPicker',
    component: ContentPicker,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
};
