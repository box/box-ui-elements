// @flow
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import noop from 'lodash/noop';
import { IntlProvider } from 'react-intl';
import messages from '../messages';
import ActivityThreadReplyForm from '../ActivityThreadReplyForm.js';

jest.mock('react-intl', () => jest.requireActual('react-intl'));

describe('src/elements/content-sidebar/activity-feed/activity-feed/ActivityThreadReplyForm', () => {
    const Wrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };

    const renderComponent = props =>
        render(<ActivityThreadReplyForm onReplyCreate={noop} onHide={jest.fn()} onShow={jest.fn()} {...props} />, {
            wrapper: Wrapper,
        });

    test('should disable Reply button if isDisabled property is true', () => {
        const onShow = jest.fn();
        renderComponent({ isDisabled: true, onShow });
        const replyButton = screen.getByRole('button', { name: messages.reply.defaultMessage });

        expect(replyButton).toHaveAttribute('aria-disabled', 'true');

        fireEvent.click(replyButton);
        expect(onShow).not.toBeCalled();
    });

    test('should show reply form and should call onShow prop when clicked on Reply button', () => {
        const onShow = jest.fn();
        renderComponent({ onShow });

        const replyButton = screen.getByRole('button', { name: messages.reply.defaultMessage });
        expect(screen.queryByTestId('bcs-CommentForm-body')).not.toBeInTheDocument();

        fireEvent.click(replyButton);

        expect(screen.getByTestId('bcs-CommentForm-body')).toBeInTheDocument();
        expect(screen.getByText(messages.replyInThread.defaultMessage)).toBeInTheDocument();
        expect(onShow).toBeCalled();
    });

    test('should hide opened reply form and should call onHide prop when clicked on Cancel button', () => {
        const onHide = jest.fn();
        renderComponent({ onHide });

        const replyButton = screen.getByRole('button', { name: messages.reply.defaultMessage });
        fireEvent.click(replyButton);

        expect(screen.getByTestId('bcs-CommentForm-body')).toBeInTheDocument();

        const cancel = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancel);

        expect(screen.queryByTestId('bcs-CommentForm-body')).not.toBeInTheDocument();
        expect(onHide).toBeCalled();
    });
});
