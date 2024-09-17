import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '../../../../test-utils/testing-library';

import ContentAnswersOpenButton from '../ContentAnswersOpenButton';

import messages from '../messages';

describe('common/content-answers/ContentAnswersOpenButton', () => {
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

    test('should call the onClick callback', async () => {
        const onClick = jest.fn();
        renderComponent({ onClick });
        expect(onClick).toBeCalledTimes(0);

        const button = screen.getByRole('button', { name: 'Box AI' });
        await userEvent.click(button);
        expect(onClick).toBeCalledTimes(1);
    });

    test('should display correct tooltip', () => {
        renderComponent();
        const button = screen.getByRole('button', { name: 'Box AI' });
        fireEvent.mouseOver(button);
        expect(screen.getByText(messages.defaultTooltip.defaultMessage)).toBeInTheDocument();
    });

    test('should display not allowed tooltip', () => {
        renderComponent({ fileExtension: 'invalid' });
        const button = screen.getByRole('button', { name: 'Box AI' });
        fireEvent.mouseOver(button);
        expect(screen.getByText(messages.disabledTooltipFileNotCompatible.defaultMessage)).toBeInTheDocument();
    });

    test('should display return to box ai when highlighted', () => {
        renderComponent({ isHighlighted: true });
        const button = screen.getByRole('button', { name: 'Box AI' });
        fireEvent.mouseOver(button);
        expect(screen.getByText(messages.hasQuestionsTooltip.defaultMessage)).toBeInTheDocument();
    });

    test('should not call onclick callback when filetype is not allowed', async () => {
        const onClick = jest.fn();
        renderComponent({ fileExtension: 'invalid', onClick });
        expect(onClick).toBeCalledTimes(0);
        const button = screen.getByRole('button', { name: 'Box AI' });
        await userEvent.click(button);
        expect(onClick).toBeCalledTimes(0);
    });

    test('should highlight button if isHighlight is true', () => {
        renderComponent({ isHighlighted: false });
        const button = screen.getByRole('button', { name: 'Box AI' });
        expect(button).not.toHaveClass('bdl-ContentAnswersOpenButton--hasQuestions');
        expect(button.matches(':focus')).toBe(false);
    });

    test('should focus button when button is already highlighted and modal is closed', () => {
        renderComponent({ isHighlighted: true });
        const button = screen.getByRole('button', { name: 'Box AI' });
        expect(button).toHaveClass('bdl-ContentAnswersOpenButton--hasQuestions');
        expect(button.matches(':focus')).toBe(true);
    });
});
