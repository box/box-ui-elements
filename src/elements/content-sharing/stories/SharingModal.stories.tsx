import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import API from '../../../api';
import SharingModal from '../SharingModal';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import {
    MOCK_ITEM_API_RESPONSE,
    MOCK_USER_API_RESPONSE,
    MOCK_ITEM_ID,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

const createMockAPI = () => {
    const api = new API({
        apiHost: 'https://api.box.com',
        clientName: 'box-ui-elements',
        id: `file_${MOCK_ITEM_ID}`,
        token: process.env.BOX_SAMPLE_TOKEN || '',
    });

    // Mock API methods
    api.getFileAPI = () => ({
        getFile: (id, successCallback) => {
            successCallback(MOCK_ITEM_API_RESPONSE);
            return Promise.resolve(MOCK_ITEM_API_RESPONSE);
        },
    });

    api.getFolderAPI = () => ({
        getFolderFields: (id, successCallback) => {
            successCallback(MOCK_ITEM_API_RESPONSE);
            return Promise.resolve(MOCK_ITEM_API_RESPONSE);
        },
    });

    api.getUsersAPI = () => ({
        getUser: (id, successCallback) => {
            successCallback(MOCK_USER_API_RESPONSE);
            return Promise.resolve(MOCK_USER_API_RESPONSE);
        },
    });

    return api;
};

const meta: Meta<typeof SharingModal> = {
    title: 'Elements/ContentSharing/SharingModal',
    component: SharingModal,
    parameters: {
        docs: {
            description: {
                component:
                    'A modal component for sharing Box files and folders that provides sharing settings and collaboration features.',
            },
        },
    },
    argTypes: {
        api: { control: 'object' },
        config: { control: 'object' },
        displayInModal: { control: 'boolean' },
        isVisible: { control: 'boolean' },
        itemID: { control: 'text' },
        itemType: {
            control: 'select',
            options: [TYPE_FILE, TYPE_FOLDER],
            description: 'The type of item being shared - either file or folder',
        },
        language: { control: 'text' },
        messages: { control: 'object' },
        setIsVisible: { control: 'function' },
        uuid: { control: 'text' },
    },
    args: {
        displayInModal: true,
        isVisible: true,
        itemID: MOCK_ITEM_ID,
        itemType: TYPE_FILE,
        language: 'en',
    },
    decorators: [
        Story => (
            <IntlProvider locale="en">
                <Story />
            </IntlProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SharingModal>;

export const DefaultStory: Story = {
    args: {
        api: createMockAPI(),
        setIsVisible: () => {
            // eslint-disable-next-line no-console
            console.log('Modal visibility changed');
        },
    },
};

DefaultStory.storyName = 'Default';
