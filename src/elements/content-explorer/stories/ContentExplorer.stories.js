// @flow

import * as React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import Modal from 'react-modal';

import ContentExplorer from '../ContentExplorer';
import ContentPicker from '../../content-picker';
import mockTheme from '../../common/__mocks__/mockTheme';

export const basic = {};

export const withSidebar = {
    args: {
        contentPreviewProps: {
            contentSidebarProps: {
                detailsSidebarProps: {
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true,
                },
                features: global.FEATURE_FLAGS,
                hasActivityFeed: true,
                hasMetadata: true,
                hasSkills: true,
            },
        },
    },
};

export const withTheming = {
    args: {
        theme: mockTheme,
    },
};

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

export const withMoveAction = {
    args: {
        itemActions: [
            {
                label: 'Move',
                onAction: item => {
                    const { id: itemId, type } = item;

                    const container = document.createElement('picker-container');
                    container.setAttribute('id', 'picker_' + Date.now());

                    const portal = document.getElementById('picker-portal');
                    portal.appendChild(container);

                    const handleClosePicker = () => {
                        portal.innerHTML = '';
                    };

                    const handleChooseFolder = async selection => {
                        const { id: parentId } = selection[0];

                        if (type === 'file' || type === 'folder') {
                            await fetch(`https://api.box.com/2.0/${type}s/${itemId}`, {
                                method: 'PUT',
                                headers: {
                                    Authorization: 'Bearer KwSEiDXeUAkt35ezmuKX5xO93ITe3xej',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ parent: { id: parentId } }),
                            });
                        }

                        const event = new Event('item-update');
                        document.dispatchEvent(event);

                        handleClosePicker();
                    };

                    render(
                        <Modal
                            className="be-modal-dialog-content-full-bleed"
                            isOpen
                            overlayClassName="be-modal-dialog-overlay"
                            parentSelector={() => container}
                            portalClassName="be-modal"
                        >
                            <IntlProvider locale="en">
                                <ContentPicker
                                    canSetShareAccess={false}
                                    maxSelectable={1}
                                    onCancel={handleClosePicker}
                                    onChoose={handleChooseFolder}
                                    rootFolderId="310548011544"
                                    token="KwSEiDXeUAkt35ezmuKX5xO93ITe3xej"
                                    type="folder"
                                />
                            </IntlProvider>
                        </Modal>,
                        container,
                    );
                },
            },
        ],
        rootFolderId: '310548011544',
        token: 'KwSEiDXeUAkt35ezmuKX5xO93ITe3xej',
    },
};

export default {
    title: 'Elements/ContentExplorer',
    component: ContentExplorer,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
};
