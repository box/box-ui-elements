import React from 'react';
import { mount } from 'enzyme';

import { TYPE_DEFAULT, TYPE_INFO, TYPE_WARN, TYPE_ERROR } from '../constants';

import { Notification } from '..';

describe('components/notification/Notification', () => {
    const getWrapper = props =>
        mount(
            <Notification onClose={jest.fn} {...props}>
                test
            </Notification>,
        );

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('should render a notification when initialized', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('div.notification').length).toBe(1);
        expect(wrapper.find('span').text()).toEqual('test');
    });

    [
        {
            type: 'info',
        },
        {
            type: 'warn',
        },
        {
            type: 'default',
        },
        {
            type: 'error',
        },
    ].forEach(({ type }) => {
        test(`should render a notification with ${type} styling when initialized`, () => {
            const component = getWrapper({ type });

            expect(component.find('div.notification').hasClass(type)).toBe(true);
        });

        test('should render a correct icon when initialized', () => {
            const component = getWrapper({ type });
            const iconBellCount = type === TYPE_DEFAULT ? 1 : 0;
            const iconSyncCount = type === TYPE_INFO ? 1 : 0;
            const iconAlertCircleCount = type === TYPE_ERROR ? 1 : 0;
            const iconInfoThinCount = type === TYPE_WARN ? 1 : 0;

            expect(component.find('IconBell').length).toBe(iconBellCount);
            expect(component.find('IconAlertCircle').length).toBe(iconAlertCircleCount);
            expect(component.find('IconSync').length).toBe(iconSyncCount);
            expect(component.find('IconInfoThin').length).toBe(iconInfoThinCount);
        });
    });

    [
        {
            overflowOption: undefined,
            expectedClass: 'wrap',
        },
        {
            overflowOption: 'wrap',
            expectedClass: 'wrap',
        },
        {
            overflowOption: 'ellipsis',
            expectedClass: 'ellipsis',
        },
    ].forEach(({ overflowOption, expectedClass }) => {
        test(`should render a notification with ${expectedClass} styling when passed the ${overflowOption} overflow option`, () => {
            const component = getWrapper({ overflow: overflowOption });

            expect(component.find('div.notification').hasClass(expectedClass)).toBe(true);
        });
    });

    test('should not set timeout if clickOnClose is set', () => {
        getWrapper({ clickOnClose: true });
        expect(setTimeout).toHaveBeenCalledTimes(0);
    });

    test('should call the onClose when the close button is clicked', () => {
        const closeMock = jest.fn();
        const component = getWrapper({ onClose: closeMock });

        const closeBtn = component.find('button');
        closeBtn.simulate('click');

        expect(closeMock).toHaveBeenCalledTimes(1);
    });

    test('should call onClose when Escape key is pressed', () => {
        const mockEvent = {
            key: 'Escape',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        };
        const closeMock = jest.fn();
        const component = getWrapper({ onClose: closeMock });

        component.simulate('keyDown', mockEvent);
        expect(closeMock).toHaveBeenCalled();
    });

    test('should only call onClose once when the close button is clicked and the short duration expires', () => {
        const closeMock = jest.fn();
        const component = getWrapper({ onClose: closeMock, duration: 'short' });
        const closeBtn = component.find('button');
        closeBtn.simulate('click');

        jest.advanceTimersByTime(5000 + 10);

        expect(closeMock).toHaveBeenCalledTimes(1);
    });

    test('should call the onClose when the short duration expires', () => {
        const closeMock = jest.fn();
        getWrapper({ onClose: closeMock, duration: 'short' });

        jest.advanceTimersByTime(5000 + 10);

        expect(closeMock).toHaveBeenCalledTimes(1);
    });

    test('should call the onClose when the long duration expires', () => {
        const closeMock = jest.fn();
        getWrapper({ onClose: closeMock, duration: 'long' });

        jest.advanceTimersByTime(10000 + 10);

        expect(closeMock).toHaveBeenCalledTimes(1);
    });

    test('should only call onClose once when the close button is clicked and the long duration expires', () => {
        const closeMock = jest.fn();
        const component = getWrapper({ onClose: closeMock, duration: 'long' });
        const closeBtn = component.find('button');
        closeBtn.simulate('click');

        jest.advanceTimersByTime(10000 + 10);

        expect(closeMock).toHaveBeenCalledTimes(1);
    });

    test("should not call the onClose when the short duration hasn't expired", () => {
        const closeMock = jest.fn();
        getWrapper({ onClose: closeMock, duration: 'short' });

        jest.advanceTimersByTime(50);

        expect(closeMock).toHaveBeenCalledTimes(0);
    });

    test('should render buttons and text when multiple children are passed in', () => {
        const wrapper = mount(
            <Notification>
                <span>test</span>
                <button type="button" className="btn">
                    dostuff
                </button>
            </Notification>,
        );

        expect(wrapper.find('span').text()).toEqual('test');
        expect(wrapper.find('.btn').text()).toEqual('dostuff');
    });
});
