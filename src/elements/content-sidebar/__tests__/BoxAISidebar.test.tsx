import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { BoxAiAgentSelector } from '@box/box-ai-agent-selector';
import { screen, render } from '../../../test-utils/testing-library';
import BoxAISidebarComponent, { BoxAISidebarProps } from '../BoxAISidebar';

const mockOnExpandClick = jest.fn();
const mockOnClearClick = jest.fn();

jest.mock('@box/box-ai-agent-selector');

describe('elements/content-sidebar/BoxAISidebar', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            onExpandClick: mockOnExpandClick,
            onClearCLick: mockOnClearClick,
        } satisfies BoxAISidebarProps;

        render(<BoxAISidebarComponent {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        (BoxAiAgentSelector as jest.MockedFunction<typeof BoxAiAgentSelector>).mockImplementation(() => (
            <div>BoxAiAgentSelector</div>
        ));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Box AI' })).toBeInTheDocument();
    });

    test('should have accessible "Clear" button', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    test('should call onExpandClick when click "Clear" button', async () => {
        renderComponent();

        const expandButton = screen.getByRole('button', { name: 'Clear' });
        await userEvent.click(expandButton);

        expect(mockOnClearClick).toHaveBeenCalled();
    });

    test('should have accessible "Expand" button', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
    });

    test('should call onExpandClick when click "Expand" button', async () => {
        renderComponent();

        const expandButton = screen.getByRole('button', { name: 'Expand' });
        await userEvent.click(expandButton);

        expect(mockOnExpandClick).toHaveBeenCalled();
    });
});
