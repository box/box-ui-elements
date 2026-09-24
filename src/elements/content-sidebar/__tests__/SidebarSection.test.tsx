import * as React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils/testing-library';
import SidebarSection from '../SidebarSection';

describe('elements/content-sidebar/SidebarSection', () => {
    const renderComponent = (props: Partial<React.ComponentProps<typeof SidebarSection>> = {}) =>
        render(<SidebarSection {...props}>children</SidebarSection>);

    test('renders the title and content', () => {
        renderComponent({ title: 'File Properties' });

        const titleButton = screen.getByRole('button', { name: 'File Properties' });

        expect(titleButton).toHaveClass('bcs-section-title');
        expect(titleButton).toHaveAttribute('aria-expanded', 'true');
        expect(titleButton.parentElement).toHaveClass('bcs-section-open');
        expect(screen.getByText('children')).toBeVisible();
    });

    test('renders content without a title button when no title is provided', () => {
        renderComponent();

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByText('children')).toBeVisible();
    });

    test('hides and shows content when the title is clicked', async () => {
        const user = userEvent.setup();

        renderComponent({ title: 'File Properties' });

        const titleButton = screen.getByRole('button', { name: 'File Properties' });

        await user.click(titleButton);

        expect(titleButton).toHaveAttribute('aria-expanded', 'false');
        expect(titleButton.parentElement).not.toHaveClass('bcs-section-open');
        expect(screen.queryByText('children')).not.toBeInTheDocument();

        await user.click(titleButton);

        expect(titleButton).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('children')).toBeVisible();
    });

    test('starts closed when isOpen is false', () => {
        renderComponent({ isOpen: false, title: 'File Properties' });

        expect(screen.getByRole('button', { name: 'File Properties' })).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('children')).not.toBeInTheDocument();
    });
});
