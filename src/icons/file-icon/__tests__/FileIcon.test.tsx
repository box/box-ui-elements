import React from 'react';
import { shallow } from 'enzyme';
import FileIcon from '../FileIcon';

describe('icons/file-icon/FileIcon', () => {
    const getWrapper = (props = {}) => shallow(<FileIcon {...props} />);

    test('should render default 32 icon when no extension and dimension is defined', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test.each([
        'doc',
        'docx',
        'docm',
        'gdoc',
        'gsheet',
        'gslides',
        'gslide',
        'key',
        'numbers',
        'pages',
        'ppt',
        'pptx',
        'pptm',
        'xls',
        'xlsm',
        'xlsb',
        'zip',
        'heic',
        'heif',
        'HEIC',
        'HEIF',
        'xbd',
        'xdw',
    ])(`should render the expected icon when %s is defined`, extension => {
        const wrapper = getWrapper({ extension });

        expect(wrapper).toMatchSnapshot();
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
