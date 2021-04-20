import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import ActivityCard from '../ActivityCard';
import SelectableActivityCard, { Props } from '../SelectableActivityCard';
// @ts-ignore flow import
import * as keys from '../../../../utils/keys';

type MockEventProps = {
    key?: string;
    target?: HTMLElement;
};

describe('elements/content-sidebar/activity-feed/SelectableActivityCard', () => {
    const getDefaults = (): Props => ({
        children: <span>Child Span</span>,
        onSelect: jest.fn(),
    });

    const getMockEvent = ({ key, target = document.createElement('div') }: MockEventProps = {}) => ({
        key,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        currentTarget: {
            focus: jest.fn(),
        },
        target,
    });

    const getWrapper = (props = {}): ShallowWrapper =>
        shallow(<SelectableActivityCard {...getDefaults()} {...props} />);

    test('should render children and HTML div props', () => {
        const wrapper = getWrapper({ className: 'foo', 'data-prop': 'bar' });

        expect(wrapper.find(ActivityCard).hasClass('bcs-SelectableActivityCard')).toBe(true);
        expect(wrapper.find(ActivityCard).hasClass('foo')).toBe(true);
        expect(wrapper.prop('data-prop')).toEqual('bar');
        expect(wrapper.find('span').text()).toEqual('Child Span');
    });

    test('should render ActivityCard with button attributes', () => {
        const wrapper = getWrapper();

        expect(wrapper.props()).toMatchObject({
            'aria-disabled': false,
            onClick: expect.any(Function),
            onKeyDown: expect.any(Function),
            role: 'button',
            tabIndex: 0,
        });
    });

    test.each([true, false])('should render aria-disabled based on isDisabled prop as %s', isDisabled => {
        const wrapper = getWrapper({ isDisabled });

        expect(wrapper.prop('aria-disabled')).toEqual(isDisabled);
    });

    describe('click handling', () => {
        test('should not call onSelect if card is disabled', () => {
            const onSelect = jest.fn();
            const wrapper = getWrapper({ isDisabled: true, onSelect });

            wrapper.simulate('click', getMockEvent());

            expect(onSelect).not.toHaveBeenCalled();
        });

        test('should call onSelect if card is not disabled', () => {
            const onSelect = jest.fn();
            const clickEvent = getMockEvent();
            const wrapper = getWrapper({ isDisabled: false, onSelect });

            wrapper.simulate('click', clickEvent);

            expect(clickEvent.preventDefault).toHaveBeenCalled();
            expect(clickEvent.stopPropagation).toHaveBeenCalled();
            expect(clickEvent.currentTarget.focus).toHaveBeenCalled();
            expect(onSelect).toHaveBeenCalled();
        });

        test.each(['a', 'button'])('should not call onSelect if event target nodeName is %s', nodeName => {
            const onSelect = jest.fn();
            const wrapper = getWrapper({ isDisabled: true, onSelect });

            wrapper.simulate('click', getMockEvent({ target: document.createElement(nodeName) }));

            expect(onSelect).not.toHaveBeenCalled();
        });
    });

    describe('key handling', () => {
        test('should not process if card is disabled', () => {
            const decodeSpy = jest.spyOn(keys, 'decode');
            const onSelect = jest.fn();
            const wrapper = getWrapper({ isDisabled: true, onSelect });

            wrapper.simulate('keydown', getMockEvent());

            expect(decodeSpy).not.toHaveBeenCalled();
            expect(onSelect).not.toHaveBeenCalled();
        });

        test.each(['a', 'button'])('should not process if event target nodeName is %s', nodeName => {
            const decodeSpy = jest.spyOn(keys, 'decode');
            const onSelect = jest.fn();
            const wrapper = getWrapper({ isDisabled: true, onSelect });

            wrapper.simulate('keydown', getMockEvent({ target: document.createElement(nodeName) }));

            expect(decodeSpy).not.toHaveBeenCalled();
            expect(onSelect).not.toHaveBeenCalled();
        });

        test.each(['Space', 'Enter'])('should call onSelect if key is %s', key => {
            const onSelect = jest.fn();
            const wrapper = getWrapper({ onSelect });

            wrapper.simulate('keydown', getMockEvent({ key }));

            expect(onSelect).toHaveBeenCalled();
        });

        test.each(['ArrowDown', 'ArrowLeft', 'Escape'])('should not call onSelect if key is %s', key => {
            const onSelect = jest.fn();
            const wrapper = getWrapper({ onSelect });

            wrapper.simulate('keydown', getMockEvent({ key }));

            expect(onSelect).not.toHaveBeenCalled();
        });
    });
});
