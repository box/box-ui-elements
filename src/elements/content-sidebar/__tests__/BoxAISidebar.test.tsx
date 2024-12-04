import React from 'react';
import {userEvent} from '@testing-library/user-event';
import {render, screen} from '../../../test-utils/testing-library';
import BoxAISidebarComponent, {BoxAISidebarProps} from '../BoxAISidebar';

const mockOnClearClick = jest.fn();

describe('elements/content-sidebar/BoxAISidebar', () => {
    const renderComponent = (props = {}, features = {}) => {
        const defaultProps = {
            onClearClick: mockOnClearClick,
            agents: [],
            selectedAgent: null,
        } as unknown as BoxAISidebarProps;

        render(<BoxAISidebarComponent {...defaultProps} {...props} />, { wrapperProps: { features } });
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Box AI' })).toBeInTheDocument();
    });

    test('should have accessible Agent selector if boxai.agentSelector.enabled is true', () => {
        renderComponent({}, { 'boxai.agentSelector.enabled': true });

        expect(screen.getByRole('button', { name: 'Agent Select an Agent'})).toBeInTheDocument();
    });

    test('should not have accessible Agent selector if boxai.agentSelector.enabled is false', () => {
        renderComponent({}, { 'boxai.agentSelector.enabled': false });

        expect(screen.queryByTestId('sidebar-agent-selector')).not.toBeInTheDocument();
    });

    test('should have accessible "Clear" button', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    test('should call onClearClick when click "Clear" button', async () => {
        renderComponent();

        const expandButton = screen.getByRole('button', { name: 'Clear' });
        await userEvent.click(expandButton);

        expect(mockOnClearClick).toHaveBeenCalled();
    });
});
