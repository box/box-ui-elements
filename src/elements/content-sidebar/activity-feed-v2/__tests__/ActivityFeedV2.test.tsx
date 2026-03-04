import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import ActivityFeedV2 from '..';

describe('elements/content-sidebar/activity-feed-v2/ActivityFeedV2', () => {
    test('should render with the correct data-testid', () => {
        render(<ActivityFeedV2 />);
        expect(screen.getByTestId('activity-feed-adapter-v2')).toBeInTheDocument();
    });
});
