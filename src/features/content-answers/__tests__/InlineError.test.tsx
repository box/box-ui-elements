import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';

import InlineError from '../InlineError';

import messages from '../messages';

jest.mock('react-intl', () => jest.requireActual('react-intl'));

describe('features/content-answers/InlineError', () => {
    const IntlWrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };

    const renderComponent = () => render(<InlineError />, { wrapper: IntlWrapper });

    test('should show inline error message', () => {
        renderComponent();
        expect(screen.getByText(messages.inlineErrorText.defaultMessage)).toBeInTheDocument();
    });
});
