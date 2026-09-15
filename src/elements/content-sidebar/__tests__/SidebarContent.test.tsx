import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import SidebarContent from '../SidebarContent';
import type { SidebarContentProps } from '../SidebarContent';
import { SIDEBAR_VIEW_ACTIVITY } from '../../../constants';

jest.mock('@box/blueprint-web', () => {
    const actual = jest.requireActual('@box/blueprint-web');
    return {
        ...actual,
        Text: ({
            as: Component = 'p',
            children,
            variant,
            ...rest
        }: React.ComponentPropsWithoutRef<'span'> & { as?: React.ElementType; variant?: string }) => (
            <Component data-variant={variant} {...rest}>
                {children}
            </Component>
        ),
    };
});

describe('elements/content-sidebar/SidebarContent', () => {
    const renderComponent = ({ children = 'children', ...props }: Partial<SidebarContentProps> = {}) =>
        render(
            <SidebarContent elementId="bcs_5" sidebarView={SIDEBAR_VIEW_ACTIVITY} {...props}>
                {children}
            </SidebarContent>,
        );

    test('should render sidebar content with a titleLarge heading', () => {
        renderComponent({ title: 'title' });

        const tabpanel = screen.getByRole('tabpanel');
        expect(tabpanel).toHaveAttribute('id', 'bcs_5_activity-content');
        expect(tabpanel).toHaveAttribute('aria-labelledby', 'bcs_5_activity');
        expect(tabpanel).toHaveClass('bcs-content');

        const heading = screen.getByRole('heading', { level: 2, name: 'title' });
        expect(heading).toHaveClass('bcs-title');
        expect(heading).toHaveAttribute('data-variant', 'titleLarge');
        expect(screen.getByText('children')).toBeVisible();
    });

    test('should not render a title heading when title is not provided', () => {
        renderComponent();

        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        expect(document.querySelector('.bcs-title')).not.toBeInTheDocument();
        expect(screen.getByText('children')).toBeVisible();
    });
});
