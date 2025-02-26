import * as React from 'react';
import { shallow } from 'enzyme';
import PreviewHeader from '..';

describe('elements/content-preview/preview-header/PreviewHeader', () => {
    const getWrapper = (props = {}) => shallow(<PreviewHeader {...props} />);

    it('should render only a logo if logoUrl is provided', () => {
        const wrapper = getWrapper({ logoUrl: 'box' });

        expect(wrapper.exists('FileInfo')).toBe(false);
        expect(wrapper.find('Logo').prop('url')).toBe('box');
    });

    it('should render file info by default if logoUrl is not provided', () => {
        const wrapper = getWrapper();

        expect(wrapper.exists('Logo')).toBe(false);
        expect(wrapper.exists('FileInfo')).toBe(true);
    });

    test.each`
        file             | show     | expected
        ${{ id: '123' }} | ${true}  | ${true}
        ${{ id: '123' }} | ${false} | ${false}
        ${{}}            | ${true}  | ${false}
        ${{}}            | ${false} | ${false}
    `('should render ContentAnswers correctly with given file and show prop', ({ file, show, expected }) => {
        const contentAnswersProps = { show };
        const wrapper = getWrapper({ contentAnswersProps, file });

        expect(wrapper.exists('.bcpr-PreviewHeader-contentAnswers')).toBe(expected);
    });

    it('should render ContentAnswers correctly and provided the correct props', () => {
        const file = { extension: 'doc', file_version: { id: '1' }, id: '123' };
        const contentAnswersProps = { show: true };
        const wrapper = getWrapper({
            contentAnswersProps,
            file,
        });
        expect(wrapper.find('.bcpr-PreviewHeader-contentAnswers').prop('file')).toBe(file);
    });

    test.each([
        [true, true],
        [false, false],
    ])(`print button should be %s if canPrint is %s `, (expected, value) => {
        const wrapper = getWrapper({ canPrint: value });
        expect(wrapper.exists('[title="Print"]')).toBe(expected);
    });
});
