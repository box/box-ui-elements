import React from 'react';

import MediaMenu from '../MediaMenu';

describe('components/Media/MediaMenu', () => {
    test('label prop adds aria-label attribute to menu button', () => {
        const label = 'Open options';
        const wrapper = shallow(<MediaMenu label={label} />);
        expect(wrapper.find('PlainButton').prop('aria-label')).toBe(label);
    });
});
