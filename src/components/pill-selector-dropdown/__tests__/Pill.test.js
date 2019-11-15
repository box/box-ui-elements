import React from 'react';

import Pill from '../Pill';

describe('components/pill-selector-dropdown/Pill', () => {
    const onRemoveStub = jest.fn();

    test('should render default component', () => {
        const wrapper = shallow(<Pill onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('bdl-Pill')).toBe(true);
        expect(wrapper.hasClass('is-selected')).toBe(false);
        expect(wrapper.childAt(0).text()).toEqual('box');
        expect(wrapper.childAt(1).hasClass('close-btn')).toBe(true);
        expect(wrapper.find('.close-btn').prop('onClick')).toEqual(onRemoveStub);
    });

    test('should have the selected class when isSelected is true', () => {
        const wrapper = shallow(<Pill isSelected isDisabled={false} onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('is-selected')).toBe(true);
    });

    test('should generate pill with invalid class when pill is not valid', () => {
        const wrapper = shallow(<Pill isValid={false} isSelected onRemove={onRemoveStub} text="box" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should disable click handler and add class when disabled', () => {
        const onRemoveMock = jest.fn();
        const wrapper = shallow(<Pill isDisabled isValid onRemove={onRemoveMock} text="box" />);
        wrapper.simulate('click');
        expect(onRemoveMock).not.toBeCalled();
        expect(wrapper.childAt(0).hasClass('is-disabled'));
    });

    test('should not call click handler when isDisabled is true', () => {
        const wrapper = shallow(<Pill onRemove={onRemoveStub} text="box" />);

        wrapper.setProps({ isDisabled: true });
        wrapper.find('.close-btn').simulate('click');
        expect(onRemoveStub).toHaveBeenCalledTimes(0);

        wrapper.setProps({ isDisabled: false });
        wrapper.find('.close-btn').simulate('click');
        expect(onRemoveStub).toHaveBeenCalledTimes(1);
    });
});
