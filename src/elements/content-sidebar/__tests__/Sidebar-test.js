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
    const getWrapper = props => shallow(<Sidebar file={{ id: 'id' }} location={{ pathname: '/' }} {...props} />);

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

        test('should update if a user-initiated location change occurred', () => {
            const wrapper = getWrapper({ location: { pathname: '/activity' } });
            const instance = wrapper.instance();
            instance.setForcedByLocation = jest.fn();

            expect(wrapper.state('isDirty')).toBe(false);
            expect(instance.setForcedByLocation).not.toHaveBeenCalled();

            wrapper.setProps({ location: { pathname: '/details' } });

            expect(wrapper.state('isDirty')).toBe(true);
            expect(instance.setForcedByLocation).toHaveBeenCalled();
        });

        test('should not set isDirty if an app-initiated location change occurred', () => {
            const wrapper = getWrapper({ location: { pathname: '/activity' } });

            expect(wrapper.state('isDirty')).toBe(false);

            wrapper.setProps({ location: { pathname: '/details', state: { silent: true } } });

            expect(wrapper.state('isDirty')).toBe(false);
        });

        test('should set the forced open state if the location state is present', () => {
            const wrapper = getWrapper({ location: { pathname: '/' } });
            const instance = wrapper.instance();
            instance.isForced = jest.fn();

            wrapper.setProps({ location: { pathname: '/details' } });
            expect(instance.isForced).toHaveBeenCalledWith(); // Getter for render

            wrapper.setProps({ location: { pathname: '/details/inner', state: { open: true, silent: true } } });
            expect(instance.isForced).toHaveBeenCalledWith(); // Getter for render

            wrapper.setProps({ location: { pathname: '/', state: { open: true } } });
            expect(instance.isForced).toHaveBeenCalledWith(true);

            wrapper.setProps({ location: { pathname: '/', state: { open: false } } });
            expect(instance.isForced).toHaveBeenCalledWith(false);
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
