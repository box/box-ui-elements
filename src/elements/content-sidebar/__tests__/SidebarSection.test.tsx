import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import SidebarSection from '../SidebarSection';

describe('elements/content-sidebar/SidebarSection', () => {
    const renderComponent = ({
        children = 'children',
        ...props
    }: { children?: React.ReactNode; title?: React.ReactNode } = {}) =>
        render(<SidebarSection {...props}>{children}</SidebarSection>);

    test('should render the title', () => {
        renderComponent({ title: 'File Properties' });

        expect(screen.getByText('File Properties').closest('button')).toHaveClass('bcs-section-title');
        expect(screen.getByText('children')).toBeVisible();
    });

    test('should not render a title when none is provided', () => {
        renderComponent();

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(document.querySelector('.bcs-section-title')).not.toBeInTheDocument();
        expect(screen.getByText('children')).toBeVisible();
    });
});
