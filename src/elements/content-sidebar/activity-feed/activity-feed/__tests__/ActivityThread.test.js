// @flow

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityThread from '../ActivityThread.js';
import replies from '../../../../../__mocks__/replies';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThread', () => {
    const defaultProps = {
        replies,
        total_reply_count: 2,
        hasReplies: true,
    };

    const renderActivityThread = props =>
        render(
            <ActivityThread {...defaultProps} {...props}>
                Test
            </ActivityThread>,
        );

    test('should render children component wrapped in ActivityThread if hasReplies is true', () => {
        const { container } = renderActivityThread();

        expect(container.querySelector('.bcs-ActivityThread')).toBeInTheDocument();
        expect(container).toHaveTextContent('Test');
    });

    test('should render children component if hasReplies is false', () => {
        const { container } = renderActivityThread({ hasReplies: false });
        expect(container.querySelector('.bcs-ActivityThread')).not.toBeInTheDocument();
        expect(container).toHaveTextContent('Test');
    });

    test('should call onGetReplies on button click', () => {
        const onGetReplies = jest.fn();
        const { container } = renderActivityThread({ onGetReplies });

        const button = container.querySelector('.bcs-ActivityThread-button');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);

        expect(onGetReplies).toBeCalled();
    });

    test('should not render button if total_reply_count is 1 or less', () => {
        renderActivityThread({ total_reply_count: 1 });
        expect(screen.queryByTestId('bcs-ActivityThread-link')).not.toBeInTheDocument();
    });

    test('should not render replies if there is no replies', () => {
        const { container } = renderActivityThread({ replies: [] });

        expect(container.querySelector('.bcs-ActivityThreadReplies')).not.toBeInTheDocument();
    });
});
