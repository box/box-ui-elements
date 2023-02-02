import React from 'react';

import { ItemListIconCore as ItemListIcon } from '../ItemListIcon';

const intl = { formatMessage: jest.fn().mockImplementation(message => message.defaultMessage) };

describe('features/content-explorer/item-list/ItemListIcon', () => {
    const renderComponent = props => shallow(<ItemListIcon intl={intl} {...props} />);

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.find('FileIcon').length).toBe(1);
            expect(wrapper.prop('extension')).toEqual(undefined);
            expect(wrapper.prop('title')).toEqual('File');
        });

        [
            // personalFolder
            {
                type: 'folder',
                hasCollaborations: false,
                isExternallyOwned: false,
                title: 'Personal Folder',
            },
            // collabFolder
            {
                type: 'folder',
                hasCollaborations: true,
                isExternallyOwned: false,
                title: 'Collaborated Folder',
            },
            // externalCollabFolder
            {
                type: 'folder',
                hasCollaborations: true,
                isExternallyOwned: true,
                title: 'Collaborated Folder',
            },
            // externalFolder
            {
                type: 'folder',
                hasCollaborations: false,
                isExternallyOwned: true,
                title: 'External Folder',
            },
        ].forEach(({ title, ...props }) => {
            test('should render correct folder icon', () => {
                const wrapper = renderComponent(props);

                expect(wrapper.find('FolderIcon').length).toBe(1);
                expect(wrapper.prop('isCollab')).toEqual(props.hasCollaborations);
                expect(wrapper.prop('isExternal')).toEqual(props.isExternallyOwned);
                expect(wrapper.prop('title')).toEqual(title);

                expect(wrapper).toMatchSnapshot();
            });
        });

        test('should render correct file icon', () => {
            const extension = 'boxnote';
            const wrapper = renderComponent({ type: 'file', extension });

            expect(wrapper.find('FileIcon').length).toBe(1);
            expect(wrapper.prop('extension')).toEqual(extension);
            expect(wrapper.prop('title')).toEqual('File');

            expect(wrapper).toMatchSnapshot();
        });

        test('should render correct bookmark icon', () => {
            const wrapper = renderComponent({ type: 'web_link' });

            expect(wrapper.find('BookmarkIcon').length).toBe(1);
            expect(wrapper.prop('title')).toEqual('Bookmark');

            expect(wrapper).toMatchSnapshot();
        });
    });
});
