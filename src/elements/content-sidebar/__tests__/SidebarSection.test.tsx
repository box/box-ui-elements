import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import SidebarSection from '../SidebarSection';

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

describe('elements/content-sidebar/SidebarSection', () => {
    const renderComponent = ({
        children = 'children',
        ...props
    }: { children?: React.ReactNode; title?: React.ReactNode } = {}) =>
        render(<SidebarSection {...props}>{children}</SidebarSection>);

    test('should render the title as bodyDefaultBold Text', () => {
        renderComponent({ title: 'File Properties' });

        const title = screen.getByText('File Properties');
        expect(title).toHaveAttribute('data-variant', 'bodyDefaultBold');
        expect(title.closest('button')).toHaveClass('bcs-section-title');
        expect(screen.getByText('children')).toBeVisible();
    });

    test('should not render a title when none is provided', () => {
        renderComponent();

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(document.querySelector('.bcs-section-title')).not.toBeInTheDocument();
        expect(screen.getByText('children')).toBeVisible();
    });
});
