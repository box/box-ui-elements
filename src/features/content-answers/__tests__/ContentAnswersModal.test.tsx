import React from 'react';
import { render, screen } from '@testing-library/react';

import ContentAnswersModal from '../ContentAnswersModal';

describe('features/content-answers/ContentAnswersModal', () => {
    const renderComponent = (props?: {}) =>
        render(<ContentAnswersModal isModalOpen onRequestClose={jest.fn()} {...props} />);

    test('should render the header icon', () => {
        renderComponent();

        const headerIcon = screen.queryByTestId('content-answers-icon-color');
        expect(headerIcon).toBeInTheDocument();
    });
});
