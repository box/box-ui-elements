// @flow
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import localize from '../../../../../../test/support/i18n';
import messages from '../messages';
import ActivityThreadReplyForm from '../ActivityThreadReplyForm.js';

const noop = () => {};

jest.mock('react-intl', () => jest.requireActual('react-intl'));

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThreadReplyForm', () => {
    const Wrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };

    const renderComponent = props =>
        render(<ActivityThreadReplyForm currentUser={{}} getAvatarUrl={noop} onReplyCreate={noop} {...props} />, {
            wrapper: Wrapper,
        });

    test('should show reply form when clicked on Reply button', () => {
        renderComponent();

        const replyButton = screen.getByRole('button', { name: localize(messages.reply.id) });
        expect(screen.queryByTestId('bcs-CommentForm-body')).not.toBeInTheDocument();

        fireEvent.click(replyButton);

        expect(screen.getByTestId('bcs-CommentForm-body')).toBeInTheDocument();
        expect(screen.getByText(localize(messages.replyInThread.id))).toBeInTheDocument();
    });

    test('should hide opened reply form when clicked on Cancel button', () => {
        renderComponent();

        const replyButton = screen.getByRole('button', { name: localize(messages.reply.id) });
        fireEvent.click(replyButton);

        expect(screen.getByTestId('bcs-CommentForm-body')).toBeInTheDocument();

        const cancel = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancel);

        expect(screen.queryByTestId('bcs-CommentForm-body')).not.toBeInTheDocument();
    });
});
