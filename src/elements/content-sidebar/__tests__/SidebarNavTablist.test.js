import * as React from 'react';
import CustomRouter from '../../common/routing/customRouter';
import SidebarNavTablist from '../SidebarNavTablist';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
    KEYS,
} from '../../../constants';

describe('elements/content-sidebar/SidebarNavTablist', () => {
    test('should correctly render children', () => {
        const MockChildren = () => <div />;

        const wrapper = shallow(
            <CustomRouter initialEntries={['/']}>
                <SidebarNavTablist>
                    <MockChildren />
                </SidebarNavTablist>
            </CustomRouter>,
        );

        const sidebarNav = wrapper.find(SidebarNavTablist);
        expect(sidebarNav.dive().type()).toEqual('div');
        expect(sidebarNav.dive().hasClass('bcs-SidebarNav-main')).toBe(true);
        expect(sidebarNav.dive().exists(MockChildren)).toBe(true);
    });

    describe('handleKeyDown', () => {
        const viewList = [SIDEBAR_VIEW_ACTIVITY, SIDEBAR_VIEW_DETAILS, SIDEBAR_VIEW_SKILLS, SIDEBAR_VIEW_METADATA];

        test.each`
            key                | route
            ${KEYS.arrowUp}    | ${SIDEBAR_VIEW_ACTIVITY}
            ${KEYS.arrowDown}  | ${SIDEBAR_VIEW_SKILLS}
            ${KEYS.arrowRight} | ${SIDEBAR_VIEW_DETAILS}
        `('should navigate to right sidebar panels when a user presses different arrow keys', ({ key, route }) => {
            const wrapper = shallow(
                <CustomRouter initialEntries={[`/${SIDEBAR_VIEW_DETAILS}`]}>
                    <SidebarNavTablist>
                        {viewList.map(view => {
                            return <div sidebarView={view} key={view} />;
                        })}
                    </SidebarNavTablist>
                </CustomRouter>,
            );

            const event = {
                key,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            };
            const sidebarNav = wrapper.find(SidebarNavTablist);
            sidebarNav.dive().props().onKeyDown(event);

            if (key === KEYS.arrowUp || key === KEYS.arrowDown) {
                expect(event.preventDefault).toBeCalled();
                expect(event.stopPropagation).toBeCalled();
            }

            const history = wrapper.find('Router').prop('history');
            expect(history.location.pathname).toBe(`/${route}`);
        });
    });
});
