import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ContentAnswersOpenButton from '../ContentAnswersOpenButton';

import messages from '../messages';

describe('features/content-answers/ContentAnswersOpenButton', () => {
    const renderComponent = (props?: {}) => render(<ContentAnswersOpenButton onClick={jest.fn()} {...props} />);

    test('should call the onClick callback', () => {
        const onClick = jest.fn();
        renderComponent({ onClick });
        expect(onClick).toBeCalledTimes(0);

        fireEvent.click(screen.getByTestId('content-answers-open-button'));
        expect(onClick).toBeCalledTimes(1);
    });

    test('should display correct tooltip', () => {
        renderComponent();
        fireEvent.mouseOver(screen.getByTestId('content-answers-open-button'));
        expect(screen.getByText(messages.defaultTooltip.defaultMessage)).toBeInTheDocument();
    });
});
