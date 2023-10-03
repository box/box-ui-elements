import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ContentAnswersModalError from '../ContentAnswersModalError';

import messages from '../messages';

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
