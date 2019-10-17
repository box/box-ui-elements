import React from 'react';

import ItemListIcon from '../ItemListIcon';

describe('features/content-explorer/item-list/ItemListIcon', () => {
    const renderComponent = props => shallow(<ItemListIcon {...props} />);

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.find('FileIcon').length).toBe(1);
            expect(wrapper.prop('extension')).toEqual(undefined);
            expect(wrapper.prop('title')).toBeTruthy();
        });

        [
            // personalFolder
            {
                type: 'folder',
                hasCollaborations: false,
                isExternallyOwned: false,
            },
            // collabFolder
            {
                type: 'folder',
                hasCollaborations: true,
                isExternallyOwned: false,
            },
            // externalCollabFolder
            {
                type: 'folder',
                hasCollaborations: true,
                isExternallyOwned: true,
            },
        ].forEach(props => {
            test('should render correct folder icon', () => {
                const wrapper = renderComponent(props);

                expect(wrapper.find('FolderIcon').length).toBe(1);
                expect(wrapper.prop('isCollab')).toEqual(props.hasCollaborations);
                expect(wrapper.prop('isExternal')).toEqual(props.isExternallyOwned);
                expect(wrapper.prop('title')).toBeTruthy();

                expect(wrapper).toMatchSnapshot();
            });
        });

        test('should render correct file icon', () => {
            const extension = 'boxnote';
            const wrapper = renderComponent({ type: 'file', extension });

            expect(wrapper.find('FileIcon').length).toBe(1);
            expect(wrapper.prop('extension')).toEqual(extension);
            expect(wrapper.prop('title')).toBeTruthy();
        });

        test('should render correct bookmark icon', () => {
            const wrapper = renderComponent({ type: 'web_link' });

            expect(wrapper.find('BookmarkIcon').length).toBe(1);
            expect(wrapper.prop('title')).toBeTruthy();
        });
    });
});
