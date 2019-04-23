import React from 'react';
import { shallow } from 'enzyme';
import LocalStore from '../../../utils/LocalStore';
import {
    SIDEBAR_FORCE_KEY,
    SIDEBAR_FORCE_VALUE_CLOSED,
    SIDEBAR_FORCE_VALUE_OPEN,
    SidebarComponent as Sidebar,
} from '../Sidebar';

jest.mock('../../common/async-load', () => () => 'LoadableComponent');
jest.mock('../../../utils/LocalStore');

describe('elements/content-sidebar/Sidebar', () => {
    const getWrapper = props => shallow(<Sidebar file={{ id: 'id' }} {...props} />);

    beforeEach(() => {
        LocalStore.mockClear();
    });

    describe('componentDidUpdate', () => {
        beforeEach(() => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null),
            }));
        });

        test('should set isOpen if isLarge prop has changed', () => {
            const wrapper = getWrapper({ isLarge: true });

            expect(wrapper.state('isOpen')).toEqual(true);

            wrapper.setProps({ isLarge: false });

            expect(wrapper.state('isOpen')).toEqual(false);
        });
    });

    describe('isForced', () => {
        test('returns the current value from the localStore', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
            }));

            const wrapper = getWrapper();
            const instance = wrapper.instance();

            expect(instance.store.getItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY);
            expect(instance.isForced()).toEqual(SIDEBAR_FORCE_VALUE_OPEN);
        });

        test('returns an empty value from localStore if the value is unset', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => null),
            }));

            const wrapper = getWrapper();
            const instance = wrapper.instance();

            expect(instance.store.getItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY);
            expect(instance.isForced()).toEqual(null);
        });

        test('sets and then returns the value to localStore if passed in', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: jest.fn(),
            }));

            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.isForced(SIDEBAR_FORCE_VALUE_OPEN);

            expect(instance.store.setItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY, SIDEBAR_FORCE_VALUE_OPEN);
            expect(instance.store.getItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY);
            expect(instance.isForced()).toEqual(SIDEBAR_FORCE_VALUE_OPEN);
        });
    });

    describe('isForcedSet', () => {
        test('should return true if the value is not null', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.isForced = jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN);

            expect(instance.isForcedSet()).toBe(true);
        });

        test('should return false if the value is null', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.isForced = jest.fn(() => null);

            expect(instance.isForcedSet()).toBe(false);
        });
    });

    describe('render', () => {
        test.each`
            forced                        | isLarge  | expected
            ${SIDEBAR_FORCE_VALUE_CLOSED} | ${true}  | ${false}
            ${SIDEBAR_FORCE_VALUE_CLOSED} | ${false} | ${false}
            ${SIDEBAR_FORCE_VALUE_OPEN}   | ${true}  | ${true}
            ${SIDEBAR_FORCE_VALUE_OPEN}   | ${false} | ${true}
            ${null}                       | ${true}  | ${true}
            ${null}                       | ${false} | ${false}
        `(
            'should render the open state correctly with forced set to $forced and isLarge set to $isLarge',
            ({ expected, forced, isLarge }) => {
                LocalStore.mockImplementationOnce(() => ({
                    getItem: jest.fn(() => forced),
                    setItem: jest.fn(() => forced),
                }));

                const wrapper = getWrapper({ isLarge });

                expect(wrapper.hasClass('bcs-is-open')).toBe(expected);
            },
        );
    });
});
