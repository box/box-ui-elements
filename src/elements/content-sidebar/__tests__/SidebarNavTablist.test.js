import * as React from 'react';
import { MemoryRouter, useHistory } from 'react-router-dom';
import { render, screen, userEvent } from '../../../test-utils/testing-library';
import SidebarNavTablist from '../SidebarNavTablist';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
    KEYS,
} from '../../../constants';

const MockTabComponent = React.forwardRef(
    (
        {
            sidebarView,
            elementId,
            internalSidebarNavigation,
            internalSidebarNavigationHandler,
            isOpen,
            onNavigate,
            routerDisabled,
            ...otherProps
        },
        ref,
    ) => (
        <button ref={ref} data-testid={`tab-${sidebarView}`} {...otherProps}>
            {sidebarView}
        </button>
    ),
);

describe('elements/content-sidebar/SidebarNavTablist', () => {
    const viewList = [SIDEBAR_VIEW_ACTIVITY, SIDEBAR_VIEW_DETAILS, SIDEBAR_VIEW_SKILLS, SIDEBAR_VIEW_METADATA];
    let testHistory;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderSidebarNavTablist = ({
        path = '/',
        props = {},
        children = [<MockTabComponent key="test" sidebarView="test" />],
    } = {}) => {
        let historyRef;

        const HistoryCapture = () => {
            const history = useHistory();
            historyRef = history;
            return null;
        };

        const result = render(
            <MemoryRouter initialEntries={[path]}>
                <HistoryCapture />
                <SidebarNavTablist {...props}>{children}</SidebarNavTablist>
            </MemoryRouter>,
        );

        testHistory = historyRef;
        return result;
    };

    test('should correctly render children', () => {
        renderSidebarNavTablist({
            props: { routerDisabled: false },
            children: [<MockTabComponent key="test" sidebarView="test" />],
        });

        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getByTestId('tab-test')).toBeInTheDocument();
    });

    describe('handleKeyDown with router', () => {
        test.each`
            key               | expectedPath
            ${KEYS.arrowUp}   | ${`/${SIDEBAR_VIEW_ACTIVITY}`}
            ${KEYS.arrowDown} | ${`/${SIDEBAR_VIEW_SKILLS}`}
        `('should navigate to $expectedPath when user presses $key', async ({ key, expectedPath }) => {
            const user = userEvent();
            const children = viewList.map(view => <MockTabComponent sidebarView={view} key={view} />);

            renderSidebarNavTablist({
                path: `/${SIDEBAR_VIEW_DETAILS}`,
                props: { routerDisabled: false },
                children,
            });

            const tablist = screen.getByRole('tablist');

            await user.click(tablist);
            await user.keyboard(`{${key}}`);

            expect(testHistory.location.pathname).toBe(expectedPath);
        });

        test('should not navigate when user presses arrow right', async () => {
            const user = userEvent();
            const children = viewList.map(view => <MockTabComponent sidebarView={view} key={view} />);

            renderSidebarNavTablist({
                path: `/${SIDEBAR_VIEW_DETAILS}`,
                props: { routerDisabled: false },
                children,
            });

            const tablist = screen.getByRole('tablist');

            await user.click(tablist);
            await user.keyboard(`{${KEYS.arrowRight}}`);

            expect(testHistory.location.pathname).toBe(`/${SIDEBAR_VIEW_DETAILS}`);
        });
    });

    describe('handleKeyDown with routerDisabled', () => {
        test.each`
            key               | expectedView
            ${KEYS.arrowUp}   | ${SIDEBAR_VIEW_ACTIVITY}
            ${KEYS.arrowDown} | ${SIDEBAR_VIEW_SKILLS}
        `(
            'should use internal navigation when routerDisabled=true and user presses $key',
            async ({ key, expectedView }) => {
                const user = userEvent();
                const mockInternalSidebarNavigationHandler = jest.fn();
                const internalSidebarNavigation = {
                    sidebar: SIDEBAR_VIEW_DETAILS,
                };

                const children = viewList.map(view => <MockTabComponent sidebarView={view} key={view} />);

                renderSidebarNavTablist({
                    props: {
                        routerDisabled: true,
                        internalSidebarNavigation,
                        internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
                    },
                    children,
                });

                const tablist = screen.getByRole('tablist');

                await user.click(tablist);
                await user.keyboard(`{${key}}`);

                expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith({
                    sidebar: expectedView,
                });
            },
        );

        test.each`
            currentView              | key               | expectedView
            ${SIDEBAR_VIEW_ACTIVITY} | ${KEYS.arrowUp}   | ${SIDEBAR_VIEW_METADATA}
            ${SIDEBAR_VIEW_METADATA} | ${KEYS.arrowDown} | ${SIDEBAR_VIEW_ACTIVITY}
        `(
            'should wrap around when navigating beyond tabs range: from $currentView with $key goes to $expectedView',
            async ({ currentView, key, expectedView }) => {
                const user = userEvent();
                const mockInternalSidebarNavigationHandler = jest.fn();
                const internalSidebarNavigation = {
                    sidebar: currentView,
                };

                const children = viewList.map(view => <MockTabComponent sidebarView={view} key={view} />);

                renderSidebarNavTablist({
                    props: {
                        routerDisabled: true,
                        internalSidebarNavigation,
                        internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
                    },
                    children,
                });

                const tablist = screen.getByRole('tablist');

                await user.click(tablist);
                await user.keyboard(`{${key}}`);

                expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith({
                    sidebar: expectedView,
                });
            },
        );

        test('should not call internal navigation handler when user presses arrow right', async () => {
            const user = userEvent();
            const mockInternalSidebarNavigationHandler = jest.fn();
            const internalSidebarNavigation = {
                sidebar: SIDEBAR_VIEW_DETAILS,
            };

            const children = viewList.map(view => <MockTabComponent sidebarView={view} key={view} />);

            renderSidebarNavTablist({
                props: {
                    routerDisabled: true,
                    internalSidebarNavigation,
                    internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
                },
                children,
            });

            const tablist = screen.getByRole('tablist');

            await user.click(tablist);
            await user.keyboard(`{${KEYS.arrowRight}}`);

            expect(mockInternalSidebarNavigationHandler).not.toHaveBeenCalled();
        });
    });
});
