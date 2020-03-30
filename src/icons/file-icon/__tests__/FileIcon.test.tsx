import React from 'react';
import { shallow } from 'enzyme';
import FileIcon from '../FileIcon';

describe('icons/file-icon/FileIcon', () => {
    const getWrapper = (props = {}) => shallow(<FileIcon {...props} />);

    test('should render default 32 icon when no extension and dimension is defined', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });
    [
        {
            extension: 'doc',
        },
        {
            extension: 'docx',
        },
        {
            extension: 'docm',
        },
        {
            extension: 'gdoc',
        },
        {
            extension: 'gsheet',
        },
        {
            extension: 'gslides',
        },
        {
            extension: 'gslide',
        },
        {
            extension: 'key',
        },
        {
            extension: 'numbers',
        },
        {
            extension: 'pages',
        },
        {
            extension: 'ppt',
        },
        {
            extension: 'pptx',
        },
        {
            extension: 'pptm',
        },
        {
            extension: 'xls',
        },
        {
            extension: 'xlsm',
        },
        {
            extension: 'xlsb',
        },
        {
            extension: 'zip',
        },
        {
            extension: 'heic',
        },
        {
            extension: 'heif',
        },
        {
            extension: 'HEIC',
        },
        {
            extension: 'HEIF',
        },
    ].forEach(({ extension }) => {
        test('should render the expected icon when extension is defined', () => {
            const wrapper = getWrapper({ extension });

            expect(wrapper).toMatchSnapshot();
        });
    });

    test('should render 64 icon when dimension is defined', () => {
        const wrapper = getWrapper({ dimension: 64 });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render title when title is defined', () => {
        const wrapper = getWrapper({ title: 'title' });

        expect(wrapper).toMatchSnapshot();
    });
});
