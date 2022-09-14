// @flow
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ActivityThread from '../ActivityThread.js';
import replies from '../../../../../__mocks__/replies';

jest.mock('react-intl', () => jest.requireActual('react-intl'));
describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThread', () => {
    const defaultProps = {
        replies,
        totalReplyCount: 2,
        hasReplies: true,
    };

    function customRender(ui, { locale = 'en', ...renderOptions } = {}) {
        function Wrapper({ children }: { children: React.Component }) {
            return <IntlProvider locale={locale}>{children}</IntlProvider>;
        }
        return render(ui, { wrapper: Wrapper, ...renderOptions });
    }

    const getWrapper = props =>
        customRender(
            <ActivityThread {...defaultProps} {...props}>
                Test
            </ActivityThread>,
        );

    test('should render children component wrapped in ActivityThread if hasReplies is true', () => {
        getWrapper();

        expect(screen.queryByTestId('activity-thread')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeVisible();
    });

    test('should render children component if hasReplies is false', () => {
        const { getByText } = getWrapper({ hasReplies: false });

        expect(screen.queryByTestId('activity-thread')).not.toBeInTheDocument();
        expect(getByText('Test')).toBeVisible();
    });

    test('should call onGetReplies on button click', () => {
        const onGetReplies = jest.fn();
        const { getByText } = getWrapper({ onGetReplies });

        const button = getByText('See 1 reply');
        expect(button).toBeVisible();
        fireEvent.click(button);

        expect(onGetReplies).toBeCalled();
        expect(screen.getByText('Hide replies')).toBeVisible();
    });

    test('should not render button if total_reply_count is 1 or less', () => {
        const { queryByTestId } = getWrapper({ totalReplyCount: 1 });
        expect(queryByTestId('activity-thread-button')).not.toBeInTheDocument();
    });

    test('should not render replies if there is no replies', () => {
        const { queryByTestId } = getWrapper({ replies: [] });

        expect(queryByTestId('activity-thread-replies')).not.toBeInTheDocument();
    });

    test('should render LoadingIndicator and do not render replies or button if repliesLoading is true', () => {
        const { queryByTestId } = getWrapper({ repliesLoading: true });

        expect(queryByTestId('activity-thread-replies')).not.toBeInTheDocument();
        expect(queryByTestId('activity-thread-button')).not.toBeInTheDocument();
        expect(queryByTestId('activity-thread-loading')).toBeInTheDocument();
    });
});
