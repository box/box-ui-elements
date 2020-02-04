import React from 'react';
import { shallow } from 'enzyme';

import Fieldset from '../Fieldset';

describe('components/fieldset/Fieldset', () => {
    test('should render a fieldset with a legend', () => {
        const wrapper = shallow(
            <Fieldset title="hello">
                <div className="child" />
            </Fieldset>,
        );

        expect(wrapper.is('fieldset')).toBe(true);
        expect(wrapper.find('legend').text()).toEqual('hello');
        expect(wrapper.find('.child').length).toBe(1);
    });

    test('should render fieldset with specified class', () => {
        const wrapper = shallow(
            <Fieldset className="test" title="hello">
                <div className="child" />
            </Fieldset>,
        );

        expect(wrapper.hasClass('fieldset')).toBe(true);
        expect(wrapper.hasClass('test')).toBe(true);
    });
});
