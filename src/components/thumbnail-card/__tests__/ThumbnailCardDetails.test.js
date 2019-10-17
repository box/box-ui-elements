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
});
