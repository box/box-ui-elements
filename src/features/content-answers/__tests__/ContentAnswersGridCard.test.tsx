import React from 'react';
import { render, screen } from '@testing-library/react';

import ContentAnswersGridCard from '../ContentAnswersGridCard';

describe('features/content-answers/ContentAnswersGridCard', () => {
    const renderComponent = (props?: {}) => {
        render(<ContentAnswersGridCard {...props}>{}</ContentAnswersGridCard>);
    };

    test('should render the grid card if there are children', () => {
        renderComponent({ children: <div data-testid="testChildren" /> });
        expect(screen.queryByTestId('content-answers-grid-card')).toBeInTheDocument();
        expect(screen.queryByTestId('testChildren')).toBeInTheDocument();
    });
});
