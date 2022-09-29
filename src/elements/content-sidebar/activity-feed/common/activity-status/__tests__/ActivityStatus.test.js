import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivityStatus from '../ActivityStatus';

describe('elements/content-sidebar/activity-feed/common/activity-status/ActivityStatus', () => {
    test.each`
        status
        ${undefined}
        ${'open'}
    `('should not render when status prop is: $status', ({ status }) => {
        render(<ActivityStatus status={status} />);
        expect(screen.queryByTestId('bcs-ActivityStatus')).not.toBeInTheDocument();
    });

    test('should render when status prop is: resolved', () => {
        render(<ActivityStatus status="resolved" />);
        expect(screen.queryByTestId('bcs-ActivityStatus')).toBeInTheDocument();
    });
});
