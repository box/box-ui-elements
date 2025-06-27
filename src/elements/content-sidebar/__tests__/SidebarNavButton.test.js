import * as React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
// Using fireEvent for all click interactions instead of userEvent because 
// userEvent.pointer with right-click doesn't reliably trigger onClick handlers
import { render, screen, fireEvent } from '../../../test-utils/testing-library';
import SidebarNavButton from '../SidebarNavButton';

describe('elements/content-sidebar/SidebarNavButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWrapper = ({ children, ref, ...props }, path = '/') =>
        render(
            <MemoryRouter initialEntries={[path]}>
                <SidebarNavButton ref={ref} {...props}>
                    {children}
                </SidebarNavButton>
            </MemoryRouter>,
        );

    test('should render nav button properly', () => {
        renderWrapper({
            tooltip: 'foo',
            sidebarView: 'activity',
            children: 'test button',
        });
        const button = screen.getByRole('tab');

        expect(button).toHaveAttribute('aria-label', 'foo');
        expect(button).toHaveAttribute('aria-selected', 'false');
        expect(button).toHaveAttribute('aria-controls', 'activity-content');
        expect(button).toHaveAttribute('role', 'tab');
        expect(button).toHaveAttribute('tabindex', '-1');
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveAttribute('id', 'activity');
        expect(button).toHaveClass('bcs-NavButton');
        expect(button).not.toHaveClass('bcs-is-selected');
        expect(button).toHaveTextContent('test button');
    });

    test.each`
        isOpen       | expected
        ${true}      | ${true}
        ${false}     | ${false}
        ${undefined} | ${false}
    `('should render nav button properly when selected with the sidebar open or closed', ({ expected, isOpen }) => {
        const props = {
            isOpen,
            sidebarView: 'activity',
            tooltip: 'foo',
            children: 'test button',
        };
        renderWrapper(props, '/activity');
        const button = screen.getByRole('tab');

        if (expected) {
            expect(button).toHaveClass('bcs-is-selected');
            expect(button).toHaveAttribute('aria-selected', 'true');
            expect(button).toHaveAttribute('tabindex', '0');
        } else {
            expect(button).not.toHaveClass('bcs-is-selected');
            expect(button).toHaveAttribute('aria-selected', 'false');
            expect(button).toHaveAttribute('tabindex', '-1');
        }
    });

    test.each`
        path                | expected
        ${'/'}              | ${false}
        ${'/activity'}      | ${true}
        ${'/activity/'}     | ${true}
        ${'/activity/test'} | ${true}
        ${'/skills'}        | ${false}
    `('should reflect active state ($expected) correctly based on active path', ({ expected, path }) => {
        renderWrapper(
            {
                isOpen: true,
                sidebarView: 'activity',
                tooltip: 'foo',
                children: 'test button',
            },
            path,
        );
        const button = screen.getByRole('tab');

        if (expected) {
            expect(button).toHaveClass('bcs-is-selected');
            expect(button).toHaveAttribute('aria-selected', 'true');
            expect(button).toHaveAttribute('tabindex', '0');
        } else {
            expect(button).not.toHaveClass('bcs-is-selected');
            expect(button).toHaveAttribute('aria-selected', 'false');
            expect(button).toHaveAttribute('tabindex', '-1');
        }
    });

    test('should call onClick with sidebarView when clicked', () => {
        const mockOnClick = jest.fn();
        const mockSidebarView = 'activity';

        renderWrapper({
            onClick: mockOnClick,
            sidebarView: mockSidebarView,
            tooltip: 'test',
            children: 'button',
        });
        const button = screen.getByText('button');

        fireEvent.click(button);
        expect(mockOnClick).toBeCalledWith(mockSidebarView);
    });

    test.each`
        isDisabled   | expected
        ${true}      | ${true}
        ${false}     | ${false}
        ${undefined} | ${false}
    `('should apply bdl-is-disabled class when isDisabled is $isDisabled', ({ isDisabled, expected }) => {
        const content = 'Activity';
        renderWrapper({
            isDisabled,
            sidebarView: 'activity',
            tooltip: 'Activity',
            children: content,
        });

        const button = screen.getByRole('tab');
        if (expected) {
            expect(button).toHaveClass('bdl-is-disabled');
        } else {
            expect(button).not.toHaveClass('bdl-is-disabled');
        }
    });

    test.each`
        elementId    | sidebarView   | expectedId            | expectedAriaControls
        ${undefined} | ${'activity'} | ${'activity'}         | ${'activity-content'}
        ${''}        | ${'activity'} | ${'activity'}         | ${'activity-content'}
        ${'sidebar'} | ${'activity'} | ${'sidebar_activity'} | ${'sidebar_activity-content'}
        ${'main'}    | ${'skills'}   | ${'main_skills'}      | ${'main_skills-content'}
    `(
        'should generate correct id and aria-controls with elementId=$elementId and sidebarView=$sidebarView',
        ({ elementId, sidebarView, expectedId, expectedAriaControls }) => {
            renderWrapper({
                elementId,
                sidebarView,
                tooltip: 'test',
                children: 'test button',
            });

            const button = screen.getByRole('tab');
            expect(button).toHaveAttribute('id', expectedId);
            expect(button).toHaveAttribute('aria-controls', expectedAriaControls);
        },
    );

    test('should forward ref to the Button', () => {
        const ref = React.createRef();

        renderWrapper({
            ref,
            sidebarView: 'activity',
            tooltip: 'test',
            children: 'test button',
        });

        const button = screen.getByRole('tab');
        expect(ref.current).toBe(button);
    });

    describe('navigation on click', () => {
        const mockHistoryPush = jest.fn();
        const mockHistoryReplace = jest.fn();
        const mockHistory = {
            push: mockHistoryPush,
            replace: mockHistoryReplace,
            listen: jest.fn(),
            location: { pathname: '/activity' },
        };

        const renderWithRouter = (props, history = mockHistory) => {
            return render(
                <Router history={history}>
                    <SidebarNavButton sidebarView="activity" tooltip="test" {...props}>
                        Activity
                    </SidebarNavButton>
                </Router>,
            );
        };

        test('calls onClick handler and history.push on left click when not exact match', () => {
            const mockOnClick = jest.fn();
            const mockHistoryWithDifferentPath = {
                ...mockHistory,
                location: { pathname: '/activity/versions' },
            };

            renderWithRouter({ onClick: mockOnClick }, mockHistoryWithDifferentPath);

            const button = screen.getByText('Activity');
            fireEvent.click(button);

            expect(mockOnClick).toBeCalledWith('activity');
            expect(mockHistoryPush).toBeCalledWith({
                pathname: '/activity',
                state: { open: true },
            });
            expect(mockHistoryReplace).not.toBeCalled();
        });

        test('calls history.replace on left click when exact match', () => {
            const mockOnClick = jest.fn();

            renderWithRouter({ onClick: mockOnClick });

            const button = screen.getByText('Activity');
            fireEvent.click(button);

            expect(mockOnClick).toBeCalledWith('activity');
            expect(mockHistoryReplace).toBeCalledWith({
                pathname: '/activity',
                state: { open: true },
            });
            expect(mockHistoryPush).not.toBeCalled();
        });

        test('does not call history.push on right click', () => {
            const mockOnClick = jest.fn();

            renderWithRouter({ onClick: mockOnClick });

            const button = screen.getByText('Activity');
            fireEvent.click(button, { button: 1 });

            expect(mockOnClick).toBeCalledWith('activity');
            expect(mockHistoryPush).not.toBeCalled();
            expect(mockHistoryReplace).not.toBeCalled();
        });

        test('does not call history.push on prevented event', () => {
            const mockOnClick = jest.fn();

            renderWithRouter({ onClick: mockOnClick });

            const button = screen.getByText('Activity');

            button.addEventListener('click', e => e.preventDefault());
            fireEvent.click(button, { button: 0 });

            expect(mockOnClick).toBeCalledWith('activity');
            expect(mockHistoryPush).not.toBeCalled();
            expect(mockHistoryReplace).not.toBeCalled();
        });
    });
});

describe('elements/content-sidebar/SidebarNavButton - Router Disabled', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const defaultProps = {
        routerDisabled: true,
        tooltip: 'foo',
        sidebarView: 'activity',
        internalSidebarNavigation: { sidebar: 'skills' },
    };

    const renderWithoutRouter = ({ children = 'test button', ref, ...props }) =>
        render(
            <SidebarNavButton ref={ref} {...defaultProps} {...props}>
                {children}
            </SidebarNavButton>,
        );

    test('should render nav button properly', () => {
        renderWithoutRouter({});
        const button = screen.getByRole('tab');

        expect(button).toHaveAttribute('aria-label', 'foo');
        expect(button).toHaveAttribute('aria-selected', 'false');
        expect(button).toHaveAttribute('aria-controls', 'activity-content');
        expect(button).toHaveAttribute('role', 'tab');
        expect(button).toHaveAttribute('tabindex', '-1');
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveAttribute('id', 'activity');
        expect(button).toHaveClass('bcs-NavButton');
        expect(button).not.toHaveClass('bcs-is-selected');
        expect(button).toHaveTextContent('test button');
    });

    test.each`
        internalSidebarNavigation                        | expected
        ${null}                                         | ${false}
        ${undefined}                                    | ${false}
        ${{ sidebar: 'skills' }}                        | ${false}
        ${{ sidebar: 'activity' }}                      | ${true}
        ${{ sidebar: 'activity', versionId: '123' }}    | ${true}
    `('should reflect active state ($expected) correctly based on internal navigation', ({ expected, internalSidebarNavigation }) => {
        renderWithoutRouter({
            internalSidebarNavigation,
            isOpen: true,
        });
        const button = screen.getByRole('tab');

        if (expected) {
            expect(button).toHaveClass('bcs-is-selected');
            expect(button).toHaveAttribute('aria-selected', 'true');
            expect(button).toHaveAttribute('tabindex', '0');
        } else {
            expect(button).not.toHaveClass('bcs-is-selected');
            expect(button).toHaveAttribute('aria-selected', 'false');
            expect(button).toHaveAttribute('tabindex', '-1');
        }
    });

    test('should call onClick with sidebarView when clicked', () => {
        const mockOnClick = jest.fn();
        const mockSidebarView = 'activity';

        renderWithoutRouter({
            onClick: mockOnClick,
            sidebarView: mockSidebarView,
        });
        const button = screen.getByRole('tab');

        fireEvent.click(button);
        expect(mockOnClick).toBeCalledWith(mockSidebarView);
    });

    describe('navigation on click', () => {
        const mockInternalSidebarNavigationHandler = jest.fn();

        test('calls onClick handler and internalSidebarNavigationHandler with replace=false when not exact match', () => {
            const mockOnClick = jest.fn();

            renderWithoutRouter({
                onClick: mockOnClick,
                internalSidebarNavigation: { sidebar: 'activity', versionId: '123' },
                internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
            });

            const button = screen.getByRole('tab');
            fireEvent.click(button);

            expect(mockOnClick).toBeCalledWith('activity');
            expect(mockInternalSidebarNavigationHandler).toBeCalledWith({
                sidebar: 'activity',
                open: true,
            }, false);
        });

        test('calls internalSidebarNavigationHandler with replace=true when exact match', () => {
            const mockOnClick = jest.fn();

            renderWithoutRouter({
                onClick: mockOnClick,
                internalSidebarNavigation: { sidebar: 'activity' },
                internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
            });

            const button = screen.getByRole('tab');
            fireEvent.click(button);

            expect(mockOnClick).toBeCalledWith('activity');
            expect(mockInternalSidebarNavigationHandler).toBeCalledWith({
                sidebar: 'activity',
                open: true,
            }, true);
        });

        test('does not call internalSidebarNavigationHandler on right click', () => {
            const mockOnClick = jest.fn();

            renderWithoutRouter({
                onClick: mockOnClick,
                internalSidebarNavigation: { sidebar: 'activity' },
                internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
            });

            const button = screen.getByRole('tab');
            fireEvent.click(button, { button: 1 });

            expect(mockOnClick).toBeCalledWith('activity');
            expect(mockInternalSidebarNavigationHandler).not.toBeCalled();
        });

        test('does not call internalSidebarNavigationHandler on prevented event', () => {
            const mockOnClick = jest.fn();

            renderWithoutRouter({
                onClick: mockOnClick,
                internalSidebarNavigation: { sidebar: 'activity' },
                internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
            });

            const button = screen.getByRole('tab');

            button.addEventListener('click', e => e.preventDefault());
            fireEvent.click(button, { button: 0 });

            expect(mockOnClick).toBeCalledWith('activity');
            expect(mockInternalSidebarNavigationHandler).not.toBeCalled();
        });
    });
});
