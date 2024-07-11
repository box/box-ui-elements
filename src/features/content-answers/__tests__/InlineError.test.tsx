import * as React from 'react';
import { render, screen } from '@testing-library/react';

import InlineError from '../InlineError';

import messages from '../messages';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

describe('features/content-answers/InlineError', () => {
    const renderComponent = () => render(<InlineError />);

    test('should show inline error message', () => {
        renderComponent();
        expect(screen.getByText(messages.inlineErrorText.defaultMessage)).toBeInTheDocument();
    });
});
