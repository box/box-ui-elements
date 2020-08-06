// @flow
import * as React from 'react';

import * as libDom from '../../../utils/dom';

import ThumbnailCardDetails from '../ThumbnailCardDetails';

const getWrapper = (props = {}) => shallow(<ThumbnailCardDetails title={<div>Foo Bar!</div>} {...props} />);

jest.mock('../../../utils/dom', () => ({ useIsContentOverflowed: jest.fn() }));

describe('components/thumbnail-card/ThumbnailCardDetails', () => {
    beforeEach(() => {
        libDom.useIsContentOverflowed.mockReturnValue(false);
    });

    test('should render', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render icon', () => {
        const icon = <img alt="icon" />;
        const wrapper = getWrapper({ icon });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render subtitle', () => {
        const subtitle = <div>Subtitle!</div>;
        const wrapper = getWrapper({ subtitle });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render actionItem', () => {
        const actionItem = <button type="button">Click Me</button>;
        const wrapper = getWrapper({ actionItem });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render a Tooltip if shouldShowTooltipOnTitleHover is true and text is overflowed', () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);

        const shouldShowTooltipOnTitleHover = true;
        const title = 'super long title goes here';
        const wrapper = getWrapper({ shouldShowTooltipOnTitleHover, title });

        expect(wrapper.find('Tooltip').length).toBe(1);
    });
});
