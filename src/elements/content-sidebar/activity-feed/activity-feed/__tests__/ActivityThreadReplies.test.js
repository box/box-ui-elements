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
});
