// @flow

import React from 'react';
import { render } from '@testing-library/react';
import ActivityThreadReplies from '../ActivityThreadReplies.js';
import { replies } from '../fixtures';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThreadReplies', () => {
    const getWrapper = props => render(<ActivityThreadReplies replies={replies} isExpanded={false} {...props} />);

    test('should render all replies', () => {
        const { queryByText } = getWrapper();

        expect(queryByText(replies[1].message)).toBeVisible();
        expect(queryByText(replies[0].message)).toBeVisible();
    });

    test('should render loading indicator if isRepliesLoading is true', () => {
        const { queryByTestId } = getWrapper({ isRepliesLoading: true });

        expect(queryByTestId('activity-thread-replies-loading')).toBeInTheDocument();
    });

    test('should not render loading indicator if isRepliesLoading is false', () => {
        const { queryByTestId } = getWrapper({ isRepliesLoading: false });

        expect(queryByTestId('activity-thread-replies-loading')).not.toBeInTheDocument();
    });
});
