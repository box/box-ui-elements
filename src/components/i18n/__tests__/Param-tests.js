import React from 'react';
import { mount } from 'enzyme';

import Param from '../Param';

// tests the Param component by itself... Normally this should appear
// inside of a FormattedCompMessage, as it wouldn't be too useful
// outside of it.
describe('components/i18n/Param', () => {
    test('should correctly render its string argument', () => {
        const wrapper = mount(<Param value="asdf" description="foo" />);

        expect(wrapper.text()).toEqual('asdf');
    });

    test('should correctly render its string argument', () => {
        const wrapper = mount(<Param value="asdf" description="foo" />);

        expect(wrapper.text()).toEqual('asdf');
    });

    test('should correctly render its numeric argument', () => {
        const wrapper = mount(<Param value={3} description="foo" />);

        expect(wrapper.text()).toEqual('3');
    });

    test('should throw when missing the description', () => {
        expect(() => {
            mount(<Param value="asdf" />);
        }).toThrow();
    });

    test('should render nothing if there is no value', () => {
        const wrapper = mount(<Param description="foo" />);

        expect(wrapper.text()).toEqual('');
    });
});
