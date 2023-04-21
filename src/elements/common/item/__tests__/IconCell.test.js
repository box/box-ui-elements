import React from 'react';

import { IconCellBase as IconCell } from '../IconCell';

const intl = {
    formatMessage: jest.fn().mockImplementation(message => message.defaultMessage),
};

describe('elements/common/item/IconCell', () => {
    const getWrapper = props => shallow(<IconCell intl={intl} {...props} />);

    describe('render()', () => {
        test('should render default file icon', () => {
            const rowData = { type: undefined };
            const wrapper = getWrapper({ rowData });

            expect(wrapper.name()).toBe('FileIcon');
            expect(wrapper.prop('extension')).toBe(undefined);
            expect(wrapper.prop('title')).toBe('File');
        });

        [
            // personalFolder
            {
                rowData: {
                    type: 'folder',
                    has_collaborations: false,
                    is_externally_owned: false,
                },
                title: 'Personal Folder',
            },
            // collabFolder
            {
                rowData: {
                    type: 'folder',
                    has_collaborations: true,
                    is_externally_owned: false,
                },
                title: 'Collaborated Folder',
            },
            // externalCollabFolder
            {
                rowData: {
                    type: 'folder',
                    has_collaborations: true,
                    is_externally_owned: true,
                },
                title: 'Collaborated Folder',
            },
            // externalFolder
            {
                rowData: {
                    type: 'folder',
                    has_collaborations: false,
                    is_externally_owned: true,
                },
                title: 'External Folder',
            },
        ].forEach(({ rowData, title }) => {
            test('should render correct folder icon', () => {
                const wrapper = getWrapper({ rowData });

                expect(wrapper.name()).toBe('FolderIcon');
                expect(wrapper.prop('isCollab')).toBe(rowData.has_collaborations);
                expect(wrapper.prop('isExternal')).toBe(rowData.is_externally_owned);
                expect(wrapper.prop('title')).toBe(title);
            });
        });

        test('should render correct file icon', () => {
            const extension = 'boxnote';
            const rowData = { type: 'file', extension };
            const wrapper = getWrapper({ rowData });

            expect(wrapper.name()).toBe('FileIcon');
            expect(wrapper.prop('extension')).toBe(extension);
            expect(wrapper.prop('title')).toBe('File');
        });

        test('should render correct bookmark icon', () => {
            const rowData = { type: 'web_link' };
            const wrapper = getWrapper({ rowData });

            expect(wrapper.name()).toBe('BookmarkIcon');
            expect(wrapper.prop('title')).toBe('Bookmark');
        });
    });
});
