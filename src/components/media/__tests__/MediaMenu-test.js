import React from 'react';

import MediaMenu from '../MediaMenu';

describe('components/Media/MediaMenu', () => {
    test('props are spread onto button', () => {
        const extraProps = {
            'aria-label': 'label for menu',
            'data-testid': 'a-menu',
            'resin-target': 'my-menu',
        };
        const className = 'foo';
        const wrapper = mount(<MediaMenu className={className} {...extraProps} />);

        expect(wrapper.find('PlainButton').props()).toEqual(expect.objectContaining(extraProps));
        expect(wrapper.find('PlainButton').prop('className')).toBe(`bdl-Media-menu ${className}`);
    });
});
