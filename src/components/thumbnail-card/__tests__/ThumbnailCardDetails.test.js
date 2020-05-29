// @flow
import * as React from 'react';

import ThumbnailCardDetails from '../ThumbnailCardDetails';

const getWrapper = (props = {}) => shallow(<ThumbnailCardDetails title={<div>Foo Bar!</div>} {...props} />);

describe('components/thumbnail-card/ThumbnailCardDetails', () => {
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

    test('should render actionItem if it is passed in', () => {
        const actionItem = <div className="action-item">Action Item</div>;
        const wrapper = getWrapper({ actionItem });

        expect(wrapper.find('.action-item').length).toBe(1);
    });
});
