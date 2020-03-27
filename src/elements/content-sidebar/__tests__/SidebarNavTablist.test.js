import React from 'react';
import { createMemoryHistory } from 'history';
import SidebarNavTablist from '../SidebarNavTablist';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
    KEYS,
} from '../../../constants';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    withRouter: Component => Component,
}));

describe('elements/content-sidebar/SidebarNavTablist', () => {
    test('should correctly render children', () => {
        const MockChildren = () => <div />;

        const wrapper = shallow(
            <SidebarNavTablist>
                <MockChildren />
            </SidebarNavTablist>,
        );

        expect(wrapper.type()).toEqual('div');
        expect(wrapper.hasClass('bcs-SidebarNav-main')).toBe(true);
        expect(wrapper.exists(MockChildren)).toBe(true);
    });

    describe('handleKeyDown', () => {
        const viewList = [SIDEBAR_VIEW_ACTIVITY, SIDEBAR_VIEW_DETAILS, SIDEBAR_VIEW_SKILLS, SIDEBAR_VIEW_METADATA];

        test.each`
            key                | route
            ${KEYS.arrowUp}    | ${SIDEBAR_VIEW_ACTIVITY}
            ${KEYS.arrowDown}  | ${SIDEBAR_VIEW_SKILLS}
            ${KEYS.arrowRight} | ${SIDEBAR_VIEW_DETAILS}
        `('should navigate to right sidebar panels when a user presses different arrow keys', ({ key, route }) => {
            const history = createMemoryHistory({
                initialEntries: [`/${SIDEBAR_VIEW_DETAILS}`],
            });

            const wrapper = shallow(
                <SidebarNavTablist history={history}>
                    {viewList.map(view => {
                        return <div sidebarView={view} key={view} />;
                    })}
                </SidebarNavTablist>,
            );

            const event = {
                key,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            };
            wrapper.props().onKeyDown(event);

            if (key === KEYS.arrowUp || key === KEYS.arrowDown) {
                expect(event.preventDefault).toBeCalled();
                expect(event.stopPropagation).toBeCalled();
            }
            expect(history.location.pathname).toBe(`/${route}`);
        });
    });
});
