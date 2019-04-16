import React from 'react';
import { shallow } from 'enzyme';
import LocalStore from '../../../utils/LocalStore';
import { SIDEBAR_FORCE_VALUE_CLOSED, SIDEBAR_FORCE_VALUE_OPEN, SidebarComponent as Sidebar } from '../Sidebar';

jest.mock('../../common/async-load', () => () => 'LoadableComponent');
jest.mock('../../../utils/LocalStore');

describe('elements/content-sidebar/Sidebar', () => {
    const getWrapper = props => shallow(<Sidebar file={{ id: 'id' }} {...props} />);

    beforeEach(() => {
        LocalStore.mockClear();
    });

    describe('componentDidUpdate', () => {
        beforeEach(() => {
            LocalStore.mockImplementation(() => ({
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
