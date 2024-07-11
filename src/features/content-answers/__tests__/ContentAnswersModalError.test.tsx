import * as React from 'react';
import { render, screen } from '@testing-library/react';

import ContentAnswersModalError from '../ContentAnswersModalError';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

describe('features/content-answers/ContentAnswersModalError', () => {
    const renderComponent = (props?: {}) => render(<ContentAnswersModalError {...props} />);

    test('should render', () => {
        renderComponent();

        const illustration = screen.getByTestId('content-answers-modal-error-illustration');
        expect(illustration).toBeInTheDocument();
        const heading = screen.getByTestId('content-answers-modal-error-heading');
        expect(heading).toBeInTheDocument();
        const description = screen.getByTestId('content-answers-modal-error-description');
        expect(description).toBeInTheDocument();
        const tryagain = screen.getByTestId('content-answers-modal-error-tryagain');
        expect(tryagain).toBeInTheDocument();
    });
});
