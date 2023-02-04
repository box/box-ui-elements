import React from 'react';

import ItemListIcon from '../ItemListIcon';

describe('features/content-explorer/item-list/ItemListIcon', () => {
    const renderComponent = props => shallow(<ItemListIcon {...props} />);

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = renderComponent();

            expect(wrapper.find('IconCell').length).toBe(1);
            expect(wrapper.prop('rowData')).toEqual({
                type: undefined,
                extension: undefined,
                has_collaborations: false,
                is_externally_owned: false,
            });
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
            // externalFolder
            {
                type: 'folder',
                hasCollaborations: false,
                isExternallyOwned: true,
            },
        ].forEach(rowData => {
            test('should render correct folder icon', () => {
                const wrapper = renderComponent(rowData);

                expect(wrapper.find('IconCell').length).toBe(1);
                expect(wrapper).toMatchSnapshot();
            });
        });

        test('should render correct file icon', () => {
            const rowData = { type: 'file', extension: 'boxnote' };
            const wrapper = renderComponent(rowData);

            expect(wrapper.find('IconCell').length).toBe(1);
            expect(wrapper.prop('rowData')).toEqual(expect.objectContaining(rowData));
        });

        test('should render correct bookmark icon', () => {
            const rowData = { type: 'web_link' };
            const wrapper = renderComponent(rowData);

            expect(wrapper.find('IconCell').length).toBe(1);
            expect(wrapper.prop('rowData')).toEqual(expect.objectContaining(rowData));
        });
    });
});
