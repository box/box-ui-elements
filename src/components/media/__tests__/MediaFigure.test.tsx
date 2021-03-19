import React from 'react';
import { shallow } from 'enzyme';

import MediaFigure from '../MediaFigure';

describe('components/Media/MediaFigure', () => {
    test('"as" prop changes root element', () => {
        const wrapper = shallow(<MediaFigure>foo</MediaFigure>);
        const wrapperAs = shallow(<MediaFigure as="div">bar</MediaFigure>);
        expect(wrapper.is('figure')).toBe(true);
        expect(wrapperAs.is('div')).toBe(true);
    });
});
