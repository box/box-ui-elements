import React from 'react';
import { render, screen } from '@testing-library/react';

import ContentAnswersGridCard from '../ContentAnswersGridCard';

describe('features/content-answers/body/ContentAnswersGridCard', () => {
    const renderComponent = (props?: {}) => {
        render(<ContentAnswersGridCard {...props}>{}</ContentAnswersGridCard>);
    };

    test('should not render grid card if there is no children', () => {
        renderComponent();
        expect(screen.queryByTestId('content-answers-grid-card')).not.toBeInTheDocument();
    });

    test('should render the grid card ig there is children', () => {
        renderComponent({ children: <div /> });
        expect(screen.queryByTestId('content-answers-grid-card')).toBeInTheDocument();
    });
});
