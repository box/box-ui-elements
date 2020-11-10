import React from 'react';

import { PILL_VARIANT_DEFAULT, PILL_VARIANT_WARNING, PILL_VARIANT_WAIVED } from '../constants';

import RoundPill from '../RoundPill';

describe('components/RoundPill-selector-dropdown/RoundPill', () => {
    const onRemoveStub = jest.fn();

    test('should render default component', () => {
        const wrapper = shallow(<RoundPill onRemove={onRemoveStub} text="box" />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render avatar if showAvatar prop is true', () => {
        const wrapper = shallow(<RoundPill onRemove={onRemoveStub} showAvatar text="box" />);

        expect(wrapper).toMatchSnapshot();

        expect(wrapper.find('LabelPillIcon')).toHaveLength(2);
    });

    test('should have the selected class when isSelected is true', () => {
        const wrapper = shallow(<RoundPill isSelected isDisabled={false} onRemove={onRemoveStub} text="box" />);

        expect(wrapper.hasClass('bdl-RoundPill--selected')).toBe(true);
    });

    test.each`
        isValid  | variant                 | expectedClass
        ${true}  | ${PILL_VARIANT_DEFAULT} | ${'bdl-RoundPill'}
        ${false} | ${PILL_VARIANT_DEFAULT} | ${'bdl-RoundPill--error'}
        ${true}  | ${PILL_VARIANT_WARNING} | ${'bdl-RoundPill--warning'}
        ${true}  | ${PILL_VARIANT_WAIVED}  | ${'bdl-RoundPill--waived'}
        ${false} | ${PILL_VARIANT_WARNING} | ${'bdl-RoundPill--error'}
        ${false} | ${PILL_VARIANT_WAIVED}  | ${'bdl-RoundPill--error'}
    `(
        'should set $expectedClass class on pill when isValid is $isValid and pill variant is $variant',
        ({ isValid, variant, expectedClass }) => {
            const mutuallyExclusiveClasses = [
                'bdl-RoundPill--error',
                'bdl-RoundPill--warning',
                'bdl-RoundPill--waived',
            ];
            const wrapper = shallow(
                <RoundPill isValid={isValid} variant={variant} onRemove={onRemoveStub} text="box" />,
            );

            mutuallyExclusiveClasses.forEach(className => {
                if (className !== expectedClass) {
                    expect(wrapper.hasClass(className)).toBe(false);
                }
            });
            expect(wrapper.hasClass(expectedClass)).toBe(true);
        },
    );

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
            <RoundPill name="name" id="123" showAvatar getPillImageUrl={() => Promise.reject(new Error())} />,
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
        const wrapper = shallow(<RoundPill name="name" id="123" showAvatar getPillImageUrl={getPillImageUrl} />);
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
            <RoundPill name="name" showAvatar getPillImageUrl={contact => `/test?id=${contact.id}`} />,
        );

        expect(wrapper.find('LabelPillIcon').length).toBe(2);
        expect(wrapper.find('LabelPillIcon[avatarUrl]').length).toBe(0);
    });
});
