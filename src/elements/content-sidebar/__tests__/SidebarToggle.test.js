import * as React from 'react';
import { render, screen, userEvent } from '../../../test-utils/testing-library';
import { SidebarToggleComponent as SidebarToggle } from '../SidebarToggle';

describe('elements/content-sidebar/SidebarToggle', () => {
    const historyMock = { replace: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderSidebarToggle = (props = {}) => {
        return render(<SidebarToggle history={historyMock} {...props} />);
    };

    test.each`
        isOpen   | expectedState
        ${true}  | ${{ state: { open: false } }}
        ${false} | ${{ state: { open: true } }}
    `('should render and handle clicks correctly when isOpen is $isOpen', async ({ isOpen, expectedState }) => {
        const user = userEvent();
        renderSidebarToggle({ isOpen });

        const toggleButton = screen.getByTestId('sidebartoggle');
        expect(toggleButton).toBeInTheDocument();

        await user.click(toggleButton);

        expect(historyMock.replace).toHaveBeenCalledWith(expectedState);
    });
});

describe('elements/content-sidebar/SidebarToggle - Router Disabled', () => {
    const mockInternalSidebarNavigationHandler = jest.fn();
    const defaultProps = {
        routerDisabled: true,
        internalSidebarNavigation: { sidebar: 'activity' },
        internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderSidebarToggle = (props = {}) => {
        return render(<SidebarToggle {...defaultProps} {...props} />);
    };

    test.each`
        isOpen   | expectedNavigation
        ${true}  | ${{ sidebar: 'activity', open: false }}
        ${false} | ${{ sidebar: 'activity', open: true }}
    `('should handle toggle clicks correctly when isOpen is $isOpen', async ({ isOpen, expectedNavigation }) => {
        const user = userEvent();
        renderSidebarToggle({ isOpen });

        const toggleButton = screen.getByTestId('sidebartoggle');
        expect(toggleButton).toBeInTheDocument();
        await user.click(toggleButton);

        expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith(expectedNavigation, true);
    });

    test('should handle complex navigation state correctly', async () => {
        const user = userEvent();
        const complexNavigation = {
            sidebar: 'activity',
            versionId: '123',
            activeFeedEntryType: 'comments',
            activeFeedEntryId: '456',
        };

        renderSidebarToggle({
            isOpen: true,
            internalSidebarNavigation: complexNavigation,
        });

        const toggleButton = screen.getByTestId('sidebartoggle');
        await user.click(toggleButton);

        expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith(
            {
                ...complexNavigation,
                open: false,
            },
            true,
        );
    });
});

describe('elements/content-sidebar/SidebarToggle - Custom Render', () => {
    const historyMock = { replace: jest.fn() };
    const renderToggleButton = jest.fn(props => (
        <button {...props} type="button">
            Custom Toggle
        </button>
    ));
    const user = userEvent();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render a custom component if renderToggleButton is provided', () => {
        render(<SidebarToggle history={historyMock} isOpen={false} renderToggleButton={renderToggleButton} />);

        expect(renderToggleButton).toHaveBeenCalled();
        expect(screen.getByText('Custom Toggle')).toBeInTheDocument();
        expect(screen.getByTestId('sidebartoggle')).toBeInTheDocument();
    });

    test('should properly pass button props to the custom component', () => {
        render(<SidebarToggle history={historyMock} isOpen={true} renderToggleButton={renderToggleButton} />);

        expect(renderToggleButton).toHaveBeenCalledWith(
            expect.objectContaining({
                isOpen: true,
                onClick: expect.any(Function),
                'data-resin-target': 'sidebartoggle',
                'data-testid': 'sidebartoggle',
            }),
        );
    });

    test('should handle clicks on custom toggle button', async () => {
        render(<SidebarToggle history={historyMock} isOpen={true} renderToggleButton={renderToggleButton} />);

        const toggleButton = screen.getByTestId('sidebartoggle');
        await user.click(toggleButton);

        expect(historyMock.replace).toHaveBeenCalledWith({ state: { open: false } });
    });
});
