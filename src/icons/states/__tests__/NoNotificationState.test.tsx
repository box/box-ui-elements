import React from 'react';
import { shallow } from 'enzyme';
import NoNotificationState from '../NoNotificationState';

describe('icons/states/NoNotificationStae', () => {
    test('should correctly render default icon', () => {
        const wrapper = shallow(<NoNotificationState />);
        expect(wrapper.hasClass('no-notification-state')).toBeTruthy();
    });

    test('should correctly render the icon with specified class', () => {
        const className = 'my-state';
        const wrapper = shallow(<NoNotificationState className={className} />);

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 140;
        const height = 150;
        const wrapper = shallow(<NoNotificationState height={height} width={width} />);

        expect(wrapper.prop('width')).toEqual(width);
        expect(wrapper.prop('height')).toEqual(height);
    });

    test('should correctly render svg with specified title', () => {
        const title = 'oh hi there';
        const wrapper = shallow(<NoNotificationState title={title} />);

        expect(wrapper.prop('title')).toEqual(title);
    });

    test('should override color in svg when specified', () => {
        const color = '#acf';
        const wrapper = shallow(<NoNotificationState color={color} />);

        expect(wrapper).toMatchSnapshot();
    });
});
