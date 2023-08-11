import React from 'react';

import RoundPill from '../RoundPill';

describe('components/RoundPill-selector-dropdown/RoundPill', () => {
    const onRemoveStub = jest.fn();

    test('should render default component', () => {
        const wrapper = shallow(<RoundPill onRemove={onRemoveStub} text="box" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should set custom class name when provided', () => {
        const wrapper = shallow(<RoundPill className="MyClass" onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('MyClass')).toBe(true);
    });

    test('should render avatar if showAvatar prop is true', () => {
        const wrapper = shallow(<RoundPill onRemove={onRemoveStub} showAvatar text="box" />);

        expect(wrapper).toMatchSnapshot();

        expect(wrapper.find('LabelPillIcon')).toHaveLength(2);
    });

    test('should have the selected class when isSelected is true', () => {
        const wrapper = shallow(<RoundPill isDisabled={false} isSelected onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('bdl-RoundPill--selected')).toBe(true);
    });

    test('should generate LabelPill with error class when isValid prop is false', () => {
        const wrapper = shallow(<RoundPill isValid={false} onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('bdl-RoundPill--error')).toBe(true);
    });

    test('should generate LabelPill with warning class when hasWarning prop is true', () => {
        const wrapper = shallow(<RoundPill hasWarning onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('bdl-RoundPill--warning')).toBe(true);
    });

    test('should generate LabelPill with error class when isValid is false and hasWarning is true', () => {
        const wrapper = shallow(<RoundPill hasWarning isValid={false} onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('bdl-RoundPill--error')).toBe(true);
    });

    test('should disable click handler and add class when disabled', () => {
        const onRemoveMock = jest.fn();
        const wrapper = shallow(<RoundPill isDisabled isValid onRemove={onRemoveMock} text="box" />);
        wrapper.simulate('click');
        expect(onRemoveMock).not.toBeCalled();
        expect(wrapper.childAt(0).hasClass('is-disabled'));
        expect(wrapper.hasClass('bdl-RoundPill--disabled')).toBe(true);
    });

    test('should not call click handler when isDisabled is true', () => {
        const wrapper = shallow(<RoundPill onRemove={onRemoveStub} text="box" />);

        wrapper.setProps({ isDisabled: true });
        wrapper.find('LabelPillIcon').simulate('click');
        expect(onRemoveStub).toHaveBeenCalledTimes(0);

        wrapper.setProps({ isDisabled: false });
        wrapper.find('LabelPillIcon').simulate('click');
        expect(onRemoveStub).toHaveBeenCalledTimes(1);
    });

    test('should do nothing when getPillImageUrl returns a rejected Promise', () => {
        const wrapper = shallow(
            <RoundPill getPillImageUrl={() => Promise.reject(new Error())} id="123" name="name" showAvatar />,
        );
        expect(wrapper.state('avatarUrl')).toBe(undefined);
        const instance = wrapper.instance();

        instance.componentDidMount();

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.state('avatarUrl')).toBeUndefined();
            expect(wrapper.find('LabelPillIcon').length).toBe(2);
            expect(wrapper.find('LabelPillIcon[avatarUrl]').length).toBe(0);
        });
    });

    test.each([
        [contact => `/test?id=${contact.id}`, '/test?id=123'],
        [contact => Promise.resolve(`/test?id=${contact.id}`), '/test?id=123'],
    ])('should use the avatar URL when the prop (and show avatar) are provided', (getPillImageUrl, expected) => {
        const wrapper = shallow(<RoundPill getPillImageUrl={getPillImageUrl} id="123" name="name" showAvatar />);
        expect(wrapper.state('avatarUrl')).toBe(undefined);
        const instance = wrapper.instance();

        instance.componentDidMount();

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.state('avatarUrl')).toBe(expected);
            expect(wrapper.find('LabelPillIcon').length).toBe(2);
            expect(wrapper.find('LabelPillIcon[avatarUrl]').props().avatarUrl).toEqual(expected);
        });
    });

    test('should not have the avatar URL when the id prop is missing', () => {
        const wrapper = shallow(
            <RoundPill getPillImageUrl={contact => `/test?id=${contact.id}`} name="name" showAvatar />,
        );

        expect(wrapper.find('LabelPillIcon').length).toBe(2);
        expect(wrapper.find('LabelPillIcon[avatarUrl]').length).toBe(0);
    });
});
