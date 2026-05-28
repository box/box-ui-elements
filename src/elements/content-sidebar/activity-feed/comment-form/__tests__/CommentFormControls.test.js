import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import CommentFormControls from '../CommentFormControls';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
}));

const renderControls = (props = {}) =>
    render(
        <IntlProvider locale="en">
            <CommentFormControls onCancel={() => {}} {...props} />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment-form/CommentFormControls', () => {
    test('should render Post button enabled by default', () => {
        renderControls();
        const post = screen.getByRole('button', { name: 'Post' });
        expect(post).not.toHaveAttribute('aria-disabled');
        expect(post).not.toHaveClass('is-disabled');
    });

    test('should disable Post button when isDisabled is true', () => {
        renderControls({ isDisabled: true });
        const post = screen.getByRole('button', { name: 'Post' });
        expect(post).toHaveAttribute('aria-disabled', 'true');
        expect(post).toHaveClass('is-disabled');
    });

    test('should leave Cancel button enabled even when Post is disabled', () => {
        renderControls({ isDisabled: true });
        const cancel = screen.getByRole('button', { name: 'Cancel' });
        expect(cancel).not.toHaveAttribute('aria-disabled');
    });
});
