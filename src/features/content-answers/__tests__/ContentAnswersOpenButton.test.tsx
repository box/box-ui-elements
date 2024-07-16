import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ContentAnswersOpenButton from '../ContentAnswersOpenButton';

import messages from '../messages';

describe('features/content-answers/ContentAnswersOpenButton', () => {
    const renderComponent = (props?: {}) =>
        render(
            <ContentAnswersOpenButton
                fileExtension="doc"
                isHighlighted={false}
                isModalOpen={false}
                onClick={jest.fn()}
                {...props}
            />,
        );

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

    test('should display not allowed tooltip', () => {
        renderComponent({ fileExtension: 'invalid' });
        fireEvent.mouseOver(screen.getByTestId('content-answers-open-button'));
        expect(screen.getByText(messages.disabledTooltipFileNotCompatible.defaultMessage)).toBeInTheDocument();
    });

    test('should display return to box ai when highlighted', () => {
        renderComponent({ isHighlighted: true });
        fireEvent.mouseOver(screen.getByTestId('content-answers-open-button'));
        expect(screen.getByText(messages.hasQuestionsTooltip.defaultMessage)).toBeInTheDocument();
    });

    test('should not call onclick callback when filetype is not allowed', () => {
        const onClick = jest.fn();
        renderComponent({ fileExtension: 'invalid', onClick });
        expect(onClick).toBeCalledTimes(0);

        fireEvent.click(screen.getByTestId('content-answers-open-button'));
        expect(onClick).toBeCalledTimes(0);
    });

    test('should highlight button if isHighlight is true', () => {
        renderComponent({ isHighlighted: false });

        expect(screen.getByTestId('content-answers-open-button')).not.toHaveClass(
            'bdl-ContentAnswersOpenButton--hasQuestions',
        );
        expect(screen.getByTestId('content-answers-open-button').matches(':focus')).toBe(false);
    });

    test('should focus button when button is already highlighted and modal is closed', () => {
        renderComponent({ isHighlighted: true });

        expect(screen.getByTestId('content-answers-open-button')).toHaveClass(
            'bdl-ContentAnswersOpenButton--hasQuestions',
        );
        expect(screen.getByTestId('content-answers-open-button').matches(':focus')).toBe(true);
    });
});
