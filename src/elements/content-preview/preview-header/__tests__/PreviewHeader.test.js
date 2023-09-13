import React from 'react';
import { shallow } from 'enzyme';

import ContentAnswers from '../../../../features/content-answers/ContentAnswers';
import PreviewHeader from '..';

describe('elements/content-preview/preview-header/PreviewHeader', () => {
    const getWrapper = (props = {}) => shallow(<PreviewHeader {...props} />).dive();

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

    it('should render contentAnswers if prop show is set to true', () => {
        const contentAnswersProps = { show: true };
        const file = { id: '123' };
        const wrapper = getWrapper({ contentAnswersProps, file });

        expect(wrapper.find(ContentAnswers).length).toBe(1);
    });

    test.each([
        [true, true],
        [false, false],
    ])(`print button should be %s if canPrint is %s `, (expected, value) => {
        const wrapper = getWrapper({ canPrint: value });
        expect(wrapper.exists('[title="Print"]')).toBe(expected);
    });
});
