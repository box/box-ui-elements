import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ContentAnswers from '../ContentAnswers';

jest.mock('../ContentAnswersModalFooter', () => () => <div />);

describe('features/content-answers', () => {
    const file = { extension: 'doc' };
    const renderComponent = (props?: {}) => render(<ContentAnswers file={file} {...props} />);

    test('should render the content answers', () => {
        renderComponent();

        const button = screen.getByTestId('content-answers-open-button');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        const modal = screen.getByTestId('content-answers-modal');
        expect(modal).toBeInTheDocument();
    });
});
