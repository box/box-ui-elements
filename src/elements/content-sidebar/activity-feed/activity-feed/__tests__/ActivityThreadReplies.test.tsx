import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityThreadReplies from '../ActivityThreadReplies';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Comment } from '../../../../../common/types/feed';
import { replies } from '../fixtures';

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThreadReplies', () => {
    const getWrapper = async (props?: Partial<React.ComponentProps<typeof ActivityThreadReplies>>) => {
        const result = render(
            <ActivityThreadReplies
                replies={replies}
                getAvatarUrl={() => Promise.resolve('')}
                onSelect={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
                {...props}
            />,
        );
        // Wait for all promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));
        return result;
    };

    test('should render all replies', async () => {
        const { queryByText } = await getWrapper();

        expect(queryByText(replies[1].message)).toBeVisible();
        expect(queryByText(replies[0].message)).toBeVisible();
    });

    test('should render loading indicator if isRepliesLoading is true', async () => {
        const { queryByTestId } = await getWrapper({ isRepliesLoading: true });

        expect(queryByTestId('activity-thread-replies-loading')).toBeInTheDocument();
    });

    test('should not render loading indicator if isRepliesLoading is false', async () => {
        const { queryByTestId } = await getWrapper({ isRepliesLoading: false });

        expect(queryByTestId('activity-thread-replies-loading')).not.toBeInTheDocument();
    });
});
