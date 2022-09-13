// @flow

import React from 'react';
import { render } from '@testing-library/react';
import ActivityThreadReplies from '../ActivityThreadReplies.js';
import replies from '../../../../../__mocks__/replies';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThreadReplies', () => {
    const defaultProps = {
        replies,
        total_reply_count: 2,
        isExpanded: false,
    };

    const getWrapper = (props = {}) => render(<ActivityThreadReplies {...defaultProps} {...props} />);

    test('should render last reply by dafault', () => {
        const { queryByText } = getWrapper();

        expect(queryByText('Last reply')).toBeVisible();
        expect(queryByText('Firsy reply')).not.toBeInTheDocument();
    });

    test('should render all replies if isExpanded is true', () => {
        const { queryByText } = getWrapper({ isExpanded: true });

        expect(queryByText('Last reply')).toBeVisible();
        expect(queryByText('First reply')).toBeVisible();
    });
});
