import React from 'react';
import { shallow } from 'enzyme';
import ItemIcon from '../ItemIcon';

describe('icons/item-icon/ItemIcon', () => {
    const getWrapper = (props = {}) => shallow(<ItemIcon iconType="" {...props} />);

    describe.each([
        'audio',
        'bookmark',
        'boxcanvas',
        'boxnote',
        'code',
        'default',
        'document',
        'docuworks-binder',
        'docuworks-file',
        'dwg',
        'excel-spreadsheet',
        'folder-collab',
        'folder-external',
        'folder-plain',
        'google-docs',
        'google-sheets',
        'google-slides',
        'illustrator',
        'image',
        'indesign',
        'keynote',
        'numbers',
        'pages',
        'pdf',
        'photoshop',
        'powerpoint-presentation',
        'presentation',
        'spreadsheet',
        'text',
        'threed',
        'vector',
        'video',
        'word-document',
        'zip',
    ])('render()', iconType => {
        test(`should render ${iconType} component`, () => {
            const wrapper = getWrapper({ iconType });

            expect(wrapper).toMatchSnapshot();
        });

        test(`should render ${iconType} component with additional props`, () => {
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
