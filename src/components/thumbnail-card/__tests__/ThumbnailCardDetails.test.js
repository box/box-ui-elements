// @flow
import * as React from 'react';

import { mount, shallow } from 'enzyme';

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

    test('should render a Tooltip if text is overflowed', () => {
        libDom.useIsContentOverflowed.mockReturnValue(true);

        const wrapper = mount(<ThumbnailCardDetails title={<div>Foo Bar!</div>} />);

        expect(wrapper.find('Tooltip').length).toBe(1);
    });
});
