import * as React from 'react';
import { shallow } from 'enzyme';

import Keywords from '../Keywords';

describe('components/ContentSidebar/ActivityFeed/keywords/Keywords', () => {
    test('should correctly render keywords', () => {
        const props = {
            action: 'applied',
            words: 'cartoon font logo brand clip art illustration line artwork',
        };

        const wrapper = shallow(<Keywords {...props} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render info icon if words are not passed', () => {
        const props = { action: 'applied', words: '' };

        const wrapper = shallow(<Keywords {...props} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render info icon', () => {
        const wrapper = shallow(<Keywords action="applied" words="cartoon font logo" />);
        const info = shallow(wrapper.find('Info').getElement());

        expect(info).toMatchSnapshot();
    });
});
