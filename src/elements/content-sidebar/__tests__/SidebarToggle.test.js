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

        expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith({
            ...complexNavigation,
            open: false,
        }, true);
    });

});
