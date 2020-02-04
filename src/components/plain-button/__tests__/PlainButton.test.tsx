import React from 'react';
import { shallow } from 'enzyme';
import PlainButton from '../PlainButton';

describe('components/plain-button/PlainButton', () => {
    const getWrapper = (props = {}) => shallow(<PlainButton {...props} />);

    test('should correctly render children in Plainbutton', () => {
        const children = 'yooo';

        const wrapper = shallow(<PlainButton>{children}</PlainButton>);

        expect(wrapper.hasClass('btn-plain')).toBe(true);
        expect(wrapper.text()).toEqual(children);
    });

    test('should render component correctly and trigger onClick when isDisabled is false', () => {
        const onClick = jest.fn();
        const wrapper = getWrapper({
            onClick,
        });

        wrapper.simulate('click');

        expect(wrapper).toMatchSnapshot();
        expect(onClick).toHaveBeenCalled();
    });

    test('should render component correctly and prevent onClick when isDisabled is true', () => {
        const preventDefault = jest.fn();
        const stopPropagation = jest.fn();
        const onClick = jest.fn();
        const wrapper = getWrapper({
            isDisabled: true,
            onClick,
        });

        wrapper.simulate('click', {
            preventDefault,
            stopPropagation,
        });

        expect(wrapper).toMatchSnapshot();
        expect(preventDefault).toHaveBeenCalled();
        expect(stopPropagation).toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
    });
});
