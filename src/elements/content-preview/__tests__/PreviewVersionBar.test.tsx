import * as React from 'react';

import { render, screen } from '../../../test-utils/testing-library';
import PreviewVersionBar from '../PreviewVersionBar';

describe('elements/content-preview/PreviewVersionBar', () => {
    test('renders version metadata', () => {
        render(
            <PreviewVersionBar
                version={{
                    modified_at: '2026-08-22T18:33:00Z',
                    modified_by: { name: 'Emily Huang' },
                    version_number: '12',
                }}
            />,
        );

        expect(screen.getByRole('group', { name: 'Version 12 details' })).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
        expect(screen.getByText(/Aug 22/)).toBeInTheDocument();
        expect(screen.getByText('Emily Huang')).toBeInTheDocument();
    });

    test('styles the current version badge', () => {
        render(<PreviewVersionBar isCurrent version={{ version_number: '4' }} />);

        expect(screen.getByText('4')).toHaveClass('bcpr-PreviewVersionBar-badge--current');
    });

    test('handles incomplete version metadata', () => {
        render(<PreviewVersionBar version={{}} />);

        expect(screen.getByRole('group', { name: 'Version details' })).toBeInTheDocument();
        expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    test('uses restored version metadata when available', () => {
        render(
            <PreviewVersionBar
                version={{
                    created_at: '2026-08-20T18:33:00Z',
                    modified_by: { id: '1', name: 'Original User' },
                    restored_at: '2026-08-22T18:33:00Z',
                    restored_by: { id: '2', name: 'Restoring User' },
                    version_number: '7',
                }}
            />,
        );

        expect(screen.getByText(/Aug 22/)).toBeInTheDocument();
        expect(screen.getByText('Restoring User')).toBeInTheDocument();
    });
});
