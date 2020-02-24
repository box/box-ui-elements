import React from 'react';
import { shallow } from 'enzyme';
import ItemIcon from '../ItemIcon';

describe('icons/item-icon/ItemIcon', () => {
    const getWrapper = (props = {}) => shallow(<ItemIcon iconType="" {...props} />);

    describe('render()', () => {
        [
            {
                iconType: 'audio',
            },
            {
                iconType: 'bookmark',
            },
            {
                iconType: 'boxnote',
            },
            {
                iconType: 'code',
            },
            {
                iconType: 'default',
            },
            {
                iconType: 'document',
            },
            {
                iconType: 'dwg',
            },
            {
                iconType: 'excel-spreadsheet',
            },
            {
                iconType: 'folder-collab',
            },
            {
                iconType: 'folder-external',
            },
            {
                iconType: 'folder-plain',
            },
            {
                iconType: 'google-docs',
            },
            {
                iconType: 'google-sheets',
            },
            {
                iconType: 'google-slides',
            },
            {
                iconType: 'illustrator',
            },
            {
                iconType: 'image',
            },
            {
                iconType: 'indesign',
            },
            {
                iconType: 'keynote',
            },
            {
                iconType: 'numbers',
            },
            {
                iconType: 'pages',
            },
            {
                iconType: 'pdf',
            },
            {
                iconType: 'photoshop',
            },
            {
                iconType: 'powerpoint-presentation',
            },
            {
                iconType: 'presentation',
            },
            {
                iconType: 'spreadsheet',
            },
            {
                iconType: 'text',
            },
            {
                iconType: 'threed',
            },
            {
                iconType: 'folder-plain',
            },
            {
                iconType: 'vector',
            },
            {
                iconType: 'video',
            },
            {
                iconType: 'word-document',
            },
            {
                iconType: 'zip',
            },
            {
                iconType: '',
            },
        ].forEach(({ iconType }) => {
            test('should render default component', () => {
                const wrapper = getWrapper({ iconType });

                expect(wrapper).toMatchSnapshot();
            });

            test('should render component with additional props', () => {
                const wrapper = getWrapper({
                    className: 'test',
                    dimension: 10,
                    iconType,
                    title: 'title',
                });

                expect(wrapper).toMatchSnapshot();
            });
        });
    });
});
