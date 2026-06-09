import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';

import CustomExtractAgentInstanceBody from '../CustomExtractAgentInstanceBody';
import messages from '../messages';
import { makeTemplate, makePropertiesTemplate } from './__fixtures__/metadataInstances';

jest.mock('../TemplatedInstance', () => ({
    __esModule: true,
    default: ({ canEdit }) => <div data-testid="templated-instance" data-can-edit={String(canEdit)} />,
}));

jest.mock('../CustomInstance', () => ({
    __esModule: true,
    default: ({ canEdit }) => <div data-testid="custom-instance" data-can-edit={String(canEdit)} />,
}));

const NOTICE_DESCRIPTION = messages.customExtractAgentNoticeDescription.defaultMessage;
const CASCADE_NOTICE = messages.metadataCascadePolicyEnabledInfo.defaultMessage;
const MANAGE_AGENT_BUTTON = messages.customExtractAgentManageButton.defaultMessage;

const getProps = (props = {}) => ({
    agentConfiguration: 'extract_agent_1234567890',
    data: { stringfield: 'some string' },
    isEditing: false,
    onManageExtractAgent: jest.fn(),
    template: makeTemplate(),
    ...props,
});

const renderComponent = (props = {}) => render(<CustomExtractAgentInstanceBody {...getProps(props)} />);

describe('features/metadata-instance-editor/CustomExtractAgentInstanceBody', () => {
    describe('edit mode', () => {
        test('renders the custom extract agent notice with title and description', () => {
            renderComponent({ isEditing: true });

            expect(screen.getByText(NOTICE_DESCRIPTION)).toBeInTheDocument();
            expect(screen.queryByText(CASCADE_NOTICE)).not.toBeInTheDocument();
        });

        test('does not render the editable fields in edit mode', () => {
            renderComponent({ isEditing: true });

            expect(screen.queryByTestId('templated-instance')).not.toBeInTheDocument();
            expect(screen.queryByTestId('custom-instance')).not.toBeInTheDocument();
        });

        test('fires onManageExtractAgent with the resolved numeric agent id', async () => {
            const onManageExtractAgent = jest.fn();
            renderComponent({
                isEditing: true,
                agentConfiguration: 'extract_agent_1234567890',
                onManageExtractAgent,
            });

            await userEvent.click(screen.getByRole('button', { name: MANAGE_AGENT_BUTTON }));

            expect(onManageExtractAgent).toHaveBeenCalledWith('1234567890');
        });

        test('strips non-numeric characters when resolving the agent id for navigation', async () => {
            const onManageExtractAgent = jest.fn();
            renderComponent({ isEditing: true, agentConfiguration: 'extract_agent_123abc', onManageExtractAgent });

            await userEvent.click(screen.getByRole('button', { name: MANAGE_AGENT_BUTTON }));

            expect(onManageExtractAgent).toHaveBeenCalledWith('123');
        });

        test('does not render the manage-agent button when agentConfiguration is missing', () => {
            renderComponent({ isEditing: true, agentConfiguration: undefined });

            expect(screen.queryByRole('button', { name: MANAGE_AGENT_BUTTON })).not.toBeInTheDocument();
        });

        test('does not render the manage-agent button when the configuration has no numeric id', () => {
            renderComponent({ isEditing: true, agentConfiguration: 'extract_agent_abc' });

            expect(screen.queryByRole('button', { name: MANAGE_AGENT_BUTTON })).not.toBeInTheDocument();
        });

        test('does not render the manage-agent button when onManageExtractAgent is missing', () => {
            renderComponent({ isEditing: true, onManageExtractAgent: undefined });

            expect(screen.queryByRole('button', { name: MANAGE_AGENT_BUTTON })).not.toBeInTheDocument();
        });
    });

    describe('read-only (view) mode', () => {
        test('renders the cascade notice and read-only templated fields for a user template', () => {
            renderComponent({ isEditing: false, template: makeTemplate() });

            expect(screen.getByText(CASCADE_NOTICE)).toBeInTheDocument();

            const templated = screen.getByTestId('templated-instance');
            expect(templated).toBeInTheDocument();
            expect(templated).toHaveAttribute('data-can-edit', 'false');
        });

        test('renders read-only custom fields for the properties template', () => {
            renderComponent({ isEditing: false, template: makePropertiesTemplate() });

            expect(screen.getByText(CASCADE_NOTICE)).toBeInTheDocument();

            const custom = screen.getByTestId('custom-instance');
            expect(custom).toBeInTheDocument();
            expect(custom).toHaveAttribute('data-can-edit', 'false');
            expect(screen.queryByTestId('templated-instance')).not.toBeInTheDocument();
        });
    });
});
