import React from 'react';
import sinon from 'sinon';

import Toggle from '..';

describe('components/toggle/Toggle', () => {
    const getWrapper = (props = {}) =>
        shallow(<Toggle label="Enter things" name="toggle" onChange={() => {}} {...props} />);

    test('should correctly render default component', () => {
        const wrapper = getWrapper();

        expect(wrapper.hasClass('toggle-container')).toBeTruthy();
        expect(wrapper.hasClass('is-toggle-right-aligned')).toBeFalsy();
        expect(wrapper.find('input').prop('checked')).toBeFalsy();
        expect(wrapper.find('.toggle-simple-description').length).toBeFalsy();
    });

    test('should put className on the container when className is passed in', () => {
        const className = 'foobar';
        const wrapper = getWrapper();
        wrapper.setProps({ className });
        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    test('should correctly render default component with on state', () => {
        const wrapper = getWrapper();
        wrapper.setProps({ isOn: true });
        expect(wrapper.find('input').prop('checked')).toBeTruthy();
    });

    test('should call onChange when input changes', () => {
        const onChange = sinon.spy();
        const wrapper = getWrapper({
            onChange,
        });
        const event = { target: { checked: true } };
        wrapper.find('input').simulate('change', event);
        sinon.assert.calledOnce(onChange);
        sinon.assert.calledWithMatch(onChange, event);
    });

    test('should render a description div when description passed in', () => {
        const wrapper = getWrapper();
        const description = 'foobar';
        wrapper.setProps({ description });
        expect(wrapper.find('.toggle-simple-description').text()).toEqual(description);
    });

    test('should render properly when isToggleRightAligned prop is true', () => {
        const wrapper = getWrapper({
            isToggleRightAligned: true,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render properly when random props are passed in', () => {
        const wrapper = getWrapper({
            'data-resin-target': 'toggle',
        });

        expect(wrapper).toMatchSnapshot();
    });
});
