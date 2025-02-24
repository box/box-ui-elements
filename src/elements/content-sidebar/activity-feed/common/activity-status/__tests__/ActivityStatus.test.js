import * as React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../../../test-utils/testing-library';
import { COMMENT_STATUS_RESOLVED } from '../../../../../../constants';
import ActivityStatus from '../ActivityStatus';

describe('elements/content-sidebar/activity-feed/common/activity-status/ActivityStatus', () => {
    test.each`
        status
        ${undefined}
        ${'open'}
    `('should not render when status prop is: $status', ({ status }) => {
        render(<ActivityStatus status={status} />);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('should render when status prop is: resolved', () => {
        render(<ActivityStatus status={COMMENT_STATUS_RESOLVED} />, {
            wrapperProps: {
                messages: { 'be.contentSidebar.activityFeed.common.activityStatusResolved': 'RESOLVED' },
            },
        });
        const statusElement = screen.getByRole('status');
        expect(statusElement).toBeInTheDocument();
        expect(statusElement).toHaveTextContent('RESOLVED');
    });
});
