import React from 'react';

import MediaFigure from '../MediaFigure';

describe('components/Media/MediaFigure', () => {
    test('"as" prop changes root element', () => {
        const wrapper = shallow(<MediaFigure />);
        const wrapperAs = shallow(<MediaFigure as="div" />);
        expect(wrapper.is('figure')).toBe(true);
        expect(wrapperAs.is('div')).toBe(true);
    });
});
