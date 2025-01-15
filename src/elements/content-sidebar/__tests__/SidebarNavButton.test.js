import * as React from 'react';
import { createMemoryHistory } from 'history';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';
import { NavRouter } from '../../common/nav-router';
import SidebarNavButton from '../SidebarNavButton.tsx';

describe('elements/content-sidebar/SidebarNavButton', () => {
    const renderComponent = ({ children, ...props }, path = '/') => {
        const history = createMemoryHistory({ initialEntries: [path] });
        return render(
            <NavRouter history={history}>
                <SidebarNavButton {...props}>{children}</SidebarNavButton>
            </NavRouter>,
        );
    };

    test('should render nav button properly', () => {
        renderComponent({ tooltip: 'foo' });
        const button = screen.getByRole('button');

        expect(screen.getByRole('tooltip')).toHaveTextContent('foo');
        expect(button).not.toHaveClass('bcs-is-selected');
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
        };
        renderComponent(props, '/activity');
        const button = screen.getByRole('button');

        if (expected) {
            expect(button).toHaveClass('bcs-is-selected');
        } else {
            expect(button).not.toHaveClass('bcs-is-selected');
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
        renderComponent({ isOpen: true, sidebarView: 'activity' }, path);
        const button = screen.getByRole('button');

        if (expected) {
            expect(button).toHaveClass('bcs-is-selected');
        } else {
            expect(button).not.toHaveClass('bcs-is-selected');
        }
    });

    test('should call onClick with sidebarView when clicked', () => {
        const mockOnClick = jest.fn();
        const mockSidebarView = 'activity';

        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
            <NavRouter history={history}>
                <SidebarNavButton onClick={mockOnClick} sidebarView={mockSidebarView}>
                    button
                </SidebarNavButton>
            </NavRouter>,
        );
        const button = screen.getByText('button');

        fireEvent.click(button);
        expect(mockOnClick).toBeCalledWith(mockSidebarView);
    });
});
