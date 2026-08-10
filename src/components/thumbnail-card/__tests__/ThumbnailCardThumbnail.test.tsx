import * as React from 'react';
import { shallow } from 'enzyme';

import ThumbnailCardThumbnail from '../ThumbnailCardThumbnail';

const getWrapper = (props = {}) => shallow(<ThumbnailCardThumbnail thumbnail={<div>Foo Bar!</div>} {...props} />);

describe('components/thumbnail-card/ThumbnailCardThumbnail', () => {
    test('should render', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });
});
