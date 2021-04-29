import React from 'react';
import { shallow } from 'enzyme';
// @ts-ignore flow import
import PreviewError from '../PreviewError';
import PreviewMask from '../PreviewMask';
import { PreviewLoading } from '../../../components/preview';

const getWrapper = (props = {}) => shallow(<PreviewMask {...props} />);

describe('elements/content-preview/PreviewMask', () => {
    describe('render()', () => {
        test('should render PreviewError if an error code is provided', () => {
            const wrapper = getWrapper({ errorCode: 'error' });
            expect(wrapper.exists(PreviewError)).toBe(true);
        });

        test('should render PreviewLoading if isLoading is true', () => {
            const wrapper = getWrapper({ isLoading: true });
            expect(wrapper.exists(PreviewLoading)).toBe(true);
        });

        test('should not render PreviewLoading if isLoading is true and error code is provided', () => {
            const wrapper = getWrapper({ errorCode: 'error', isLoading: true });
            expect(wrapper.exists(PreviewLoading)).toBe(false);
        });

        test('should render nothing if error is missing and isLoading is false', () => {
            const wrapper = getWrapper();
            expect(wrapper.isEmptyRender()).toBe(true);
        });
    });
});
