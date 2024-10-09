import React from 'react';
import { render } from '../../../test-utils/testing-library';
import Providers from '../Providers';

describe('elements/common/Providers', () => {
    test('renders children within Notification and TooltipProvider when hasProviders is true', () => {
        const screen = render(
            <Providers hasProviders={true}>
                <div>Child Content</div>
            </Providers>,
        );

        expect(screen.getByText('Child Content')).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Notifications (F8)' })).toBeInTheDocument();
    });

    test('renders only children when hasProviders is false', () => {
        const screen = render(
            <Providers hasProviders={false}>
                <div>Child Content</div>
            </Providers>,
        );
        expect(screen.getByText('Child Content')).toBeInTheDocument();
        expect(screen.queryByRole('region', { name: 'Notifications (F8)' })).not.toBeInTheDocument();
    });

    test('throws an error if more than one child is provided when hasProviders is false', () => {
        expect(() =>
            render(
                <Providers hasProviders={false}>
                    <div>Child 1</div>
                    <div>Child 2</div>
                </Providers>,
            ),
        ).toThrow();
    });

    test('renders children within Notification and TooltipProvider by default when hasProviders is not provided', () => {
        const screen = render(
            <Providers>
                <div>Child Content</div>
            </Providers>,
        );
        expect(screen.getByText('Child Content')).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Notifications (F8)' })).toBeInTheDocument();
    });
});
