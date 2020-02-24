import * as React from 'react';
import { shallow } from 'enzyme';
import SecurityBlockedState from '../SecurityBlockedState';

describe('icons/states/SecurityBlockedState', () => {
    test('should correctly render default icon with default colors', () => {
        const wrapper = shallow(<SecurityBlockedState />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const wrapper = shallow(<SecurityBlockedState primaryColor="#fcfcfc" secondaryColor="#eee" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height and default viewBox value', () => {
        const wrapper = shallow(<SecurityBlockedState height={131} width={200} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const wrapper = shallow(<SecurityBlockedState title="abcde" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with custom class name', () => {
        const wrapper = shallow(<SecurityBlockedState className="empty" />);
        expect(wrapper).toMatchSnapshot();
    });
});
