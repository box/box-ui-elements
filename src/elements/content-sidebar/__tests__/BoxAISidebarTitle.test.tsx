import React from 'react';
import { REQUEST_STATE, useAgents as originalUseAgents } from '@box/box-ai-agent-selector';
import { render, screen } from '../../../test-utils/testing-library';
import BoxAISidebarTitle from '../BoxAISidebarTitle';

jest.mock('@box/box-ai-agent-selector', () => {
    const actualModule = jest.requireActual('@box/box-ai-agent-selector');
    return {
        ...actualModule,
        useAgents: jest.fn(),
    };
});

const useAgents = originalUseAgents as jest.MockedFunction<typeof originalUseAgents>;

const renderComponent = props => {
    return render(<BoxAISidebarTitle {...props} />);
};

describe('elements/content-sidebar/BoxAISidebarTitle', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('given isAIStudioAgentSelectorEnabled is false, should render title', () => {
        useAgents.mockReturnValue({ agents: [], requestState: REQUEST_STATE.NOT_STARTED, selectedAgent: null });
        renderComponent({ isAIStudioAgentSelectorEnabled: false });
        expect(screen.getByText('Box AI')).toBeInTheDocument();
    });

    describe('given isAIStudioAgentSelectorEnabled is true', () => {
        test.each`
            agentsData                                                                                                                          | condition
            ${{ agents: [], requestState: REQUEST_STATE.ERROR, selectedAgent: null }}                                                           | ${'agent selector request has failed'}
            ${{ agents: [], requestState: REQUEST_STATE.CANCELLED, selectedAgent: null }}                                                       | ${'agent selector request has been cancelled'}
            ${{ agents: [{ id: '123', name: 'Agent 1' }], requestState: REQUEST_STATE.SUCCESS, selectedAgent: { id: '123', name: 'Agent 1' } }} | ${'agent selector request is successful and there is 1 agent available'}
        `('and $condition, should render title', ({ agentsData }) => {
            useAgents.mockReturnValue(agentsData);
            renderComponent({ isAIStudioAgentSelectorEnabled: true });
            expect(screen.getByText('Box AI')).toBeInTheDocument();
        });

        test.each`
            agentsData                                                                                                                                                          | condition
            ${{ agents: [], requestState: REQUEST_STATE.NOT_STARTED, selectedAgent: null }}                                                                                     | ${'agent selector has not started loading'}
            ${{ agents: [], requestState: REQUEST_STATE.IN_PROGRESS, selectedAgent: null }}                                                                                     | ${'agent selector request is in progress'}
            ${{ agents: [{ id: '123', name: 'Agent 1' }, { id: '124', name: 'Agent 2' }], requestState: REQUEST_STATE.SUCCESS, selectedAgent: { id: '123', name: 'Agent 1' } }} | ${'agent selector request is successful and 2 agents are available'}
        `('and $condition, should not render title', ({ agentsData }) => {
            useAgents.mockReturnValue(agentsData);
            renderComponent({ isAIStudioAgentSelectorEnabled: true });
            expect(screen.queryByText('Box AI')).not.toBeInTheDocument();
        });
    });
});
