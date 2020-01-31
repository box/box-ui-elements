import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { TYPE_DEFAULT, TYPE_INFO, TYPE_WARN, TYPE_ERROR } from '../constants';

import { Notification } from '..';

const sandbox = sinon.sandbox.create();
let clock;

describe('components/notification/Notification', () => {
    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        clock.restore();
    });

    test('should render a notification when initialized', () => {
        const wrapper = mount(<Notification>test</Notification>);

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
            const component = mount(<Notification type={type}>test</Notification>);

            expect(component.find('div.notification').hasClass(type)).toBe(true);
        });

        test('should render a correct icon when initialized', () => {
            const component = mount(<Notification type={type}>test</Notification>);
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
            const component = mount(<Notification overflow={overflowOption}>test</Notification>);

            expect(component.find('div.notification').hasClass(expectedClass)).toBe(true);
        });
    });

    test('should call the onClose when the close button is clicked', () => {
        const closeMock = sinon.spy();

        const component = mount(
            <div>
                <Notification onClose={closeMock}>test</Notification>
            </div>,
        );

        const closeBtn = component.find('button');
        closeBtn.simulate('click');

        expect(closeMock.called).toBe(true);
    });

    test('should only call onClose once when the close button is clicked and the short duration expires', () => {
        const closeMock = sinon.spy();

        const component = mount(
            <Notification duration="short" onClose={closeMock}>
                test
            </Notification>,
        );

        const closeBtn = component.find('button');
        closeBtn.simulate('click');

        clock.tick(5000 + 10);

        expect(closeMock.calledOnce).toBe(true);
    });

    test('should call the onClose when the short duration expires', () => {
        const closeMock = sinon.spy();

        mount(
            <Notification duration="short" onClose={closeMock}>
                test
            </Notification>,
        );

        clock.tick(5000 + 10);

        expect(closeMock.called).toBe(true);
    });

    test('should call the onClose when the long duration expires', () => {
        const closeMock = sinon.spy();

        mount(
            <Notification duration="long" onClose={closeMock}>
                test
            </Notification>,
        );

        clock.tick(10000 + 10);

        expect(closeMock.called).toBe(true);
    });

    test('should only call onClose once when the close button is clicked and the long duration expires', () => {
        const closeMock = sinon.spy();

        const component = mount(
            <Notification duration="long" onClose={closeMock}>
                test
            </Notification>,
        );

        const closeBtn = component.find('button');
        closeBtn.simulate('click');

        clock.tick(10000 + 10);

        expect(closeMock.calledOnce).toBe(true);
    });

    test("should not call the onClose when the short duration hasn't expired", () => {
        const closeMock = sinon.spy();

        mount(
            <Notification duration="short" onClose={closeMock}>
                test
            </Notification>,
        );

        clock.tick(50);

        expect(closeMock.called).toBe(false);
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
