import React from 'react';
import { render } from '../../../test-utils/testing-library';
import Provide from '../Provide';

describe('Provide component', () => {
    test('renders children within Notification and TooltipProvider when shouldProvide is true', () => {
        const screen = render(
            <Provide hasProviders={true}>
                <div>Child Content</div>
            </Provide>,
        );

        expect(screen.getByText('Child Content')).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Notifications (F8)' })).toBeInTheDocument();
    });

    test('renders only children when shouldProvide is false', () => {
        const screen = render(
            <Provide hasProviders={false}>
                <div>Child Content</div>
            </Provide>,
        );
        expect(screen.getByText('Child Content')).toBeInTheDocument();
        expect(screen.queryByRole('region', { name: 'Notifications (F8)' })).not.toBeInTheDocument();
    });

    test('throws an error if more than one child is provided when shouldProvide is false', () => {
        expect(() =>
            render(
                <Provide hasProviders={false}>
                    <div>Child 1</div>
                    <div>Child 2</div>
                </Provide>,
            ),
        ).toThrow();
    });

    test('renders children within Notification and TooltipProvider by default when shouldProvide is not provided', () => {
        const screen = render(
            <Provide>
                <div>Child Content</div>
            </Provide>,
        );
        expect(screen.getByText('Child Content')).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Notifications (F8)' })).toBeInTheDocument();
    });
});
