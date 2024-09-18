import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils/testing-library';

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

    test('should display correct tooltip', async () => {
        renderComponent();
        const button = screen.getByRole('button', { name: 'Box AI' });
        await userEvent.hover(button);
        const tooltip = await screen.findByRole('tooltip', { name: messages.defaultTooltip.defaultMessage });
        expect(tooltip).toBeInTheDocument();
    });

    test('should display not allowed tooltip', async () => {
        renderComponent({ fileExtension: 'invalid' });
        const button = screen.getByRole('button', { name: 'Box AI' });
        await userEvent.hover(button, { pointerEventsCheck: 0 });
        const tooltip = await screen.findByRole('tooltip', {
            name: messages.disabledTooltipFileNotCompatible.defaultMessage,
        });
        expect(tooltip).toBeInTheDocument();
    });

    test('should display return to box ai when highlighted', async () => {
        renderComponent({ isHighlighted: true });
        const button = screen.getByRole('button', { name: 'Box AI' });
        await userEvent.hover(button);
        const tooltip = await screen.findByRole('tooltip', {
            name: messages.hasQuestionsTooltip.defaultMessage,
        });
        expect(tooltip).toBeInTheDocument();
    });

    test('should not call onclick callback when filetype is not allowed', async () => {
        const onClick = jest.fn();
        renderComponent({ fileExtension: 'invalid', onClick });
        expect(onClick).toBeCalledTimes(0);
        const button = screen.getByRole('button');
        await userEvent.click(button, { pointerEventsCheck: 0 });
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
