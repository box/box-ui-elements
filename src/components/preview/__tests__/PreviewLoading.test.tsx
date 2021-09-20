import React from 'react';
import { shallow } from 'enzyme';
import { PreviewLoading, PreviewLoadingRing, getIcon } from '..';
import { bdlBoxBlue } from '../../../styles/variables';

const getWrapper = (props = {}) => shallow(<PreviewLoading {...props} />);

describe('components/preview/PreviewLoading', () => {
    describe('render()', () => {
        test('should get the color and icon based on the provided extension', () => {
            const PDFIcon = getIcon('pdf');
            const wrapper = getWrapper({ extension: 'pdf' });

            expect(wrapper.children().type()).toEqual(PDFIcon);
            expect(wrapper.find(PreviewLoadingRing).prop('color')).toEqual('#D0021B');
        });

        test('should get a default color and icon if no extension is provided', () => {
            const DefaultIcon = getIcon();
            const wrapper = getWrapper();

            expect(wrapper.children().type()).toEqual(DefaultIcon);
            expect(wrapper.find(PreviewLoadingRing).prop('color')).toEqual(bdlBoxBlue);
        });

        test.each`
            extension | theme
            ${'doc'}  | ${'light'}
            ${'pdf'}  | ${'light'}
            ${'mp3'}  | ${'light'}
            ${'mov'}  | ${'dark'}
            ${'mp4'}  | ${'dark'}
        `('should set its theme based on the icon for its extension', ({ extension, theme }) => {
            const wrapper = getWrapper({ extension });

            expect(wrapper.prop('theme')).toEqual(theme);
        });
    });
});
