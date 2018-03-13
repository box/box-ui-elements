import React from 'react';
import { shallow } from 'enzyme';

import Keywords from '../Keywords';

describe('features/activity-feed/keywords/Keywords', () => {
    test('should correctly render keywords', () => {
        const props = {
            action: 'applied',
            words: 'cartoon font logo brand clip art illustration line artwork'
        };

        const wrapper = shallow(<Keywords {...props} />);

        expect(wrapper.find('.box-ui-keywords-message').length).toBe(1);
        expect(wrapper.find('Info').length).toBe(1);
    });

    test('should not render info icon if words are not passed', () => {
        const props = { action: 'applied', words: '' };

        const wrapper = shallow(<Keywords {...props} />);

        expect(wrapper.find('.box-ui-keywords-message').length).toBe(1);
        expect(wrapper.find('Info').length).toBe(0);
    });

    test('should correctly render info icon', () => {
        const wrapper = shallow(<Keywords action='applied' words='cartoon font logo' />);
        const info = shallow(wrapper.find('Info').getElement());

        expect(info.find('Tooltip').length).toBe(1);
        expect(info.find('IconInfoInverted').length).toBe(1);
    });
});
