import React from 'react';
import { render, screen } from '@testing-library/react';

import ContentAnswersModalContent from '../ContentAnswersModalContent';

describe('features/content-answers/ContentAnswersModalContent', () => {
    const renderComponent = (props?: {}) => {
        render(<ContentAnswersModalContent fileName="" {...props} />);
    };

    test('should render welcome message', () => {
        renderComponent();
        expect(screen.queryByTestId('content-answers-welcome-message')).toBeInTheDocument();
    });
});
