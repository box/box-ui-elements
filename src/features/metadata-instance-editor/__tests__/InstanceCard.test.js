import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';

import InstanceCard from '../InstanceCard';
import messages from '../messages';
import { makeAiExtractCascadePolicy, makeTemplate, makePropertiesTemplate } from './__fixtures__/metadataInstances';

jest.mock('../../../components/collapsible/Collapsible', () => ({
    __esModule: true,
    default: ({ title, headerActionItems, children, isOpen }) => (
        <div data-testid="collapsible" data-is-open={String(isOpen)}>
            <div data-testid="collapsible-title">{title}</div>
            <div data-testid="collapsible-actions">{headerActionItems}</div>
            <div data-testid="collapsible-children">{children}</div>
        </div>
    ),
}));

jest.mock('../../../icons/general/IconMetadataColored', () => ({
    __esModule: true,
    default: ({ type }) => <div data-testid="metadata-icon" data-type={type} />,
}));

jest.mock('../../../icons/general/IconAlertCircle', () => ({
    __esModule: true,
    default: () => <div data-testid="alert-icon" />,
}));

const getProps = (props = {}) => ({
    cascadePolicy: makeAiExtractCascadePolicy(),
    children: <div data-testid="card-child">body</div>,
    hasError: false,
    headerActionItems: <button type="button">edit-action</button>,
    isCascadingPolicyApplicable: true,
    isOpen: true,
    template: makeTemplate(),
    ...props,
});

const renderComponent = (props = {}) => render(<InstanceCard {...getProps(props)} />);

describe('features/metadata-instance-editor/InstanceCard', () => {
    describe('icon type', () => {
        test('uses the cascade icon when cascading is applicable and the policy has an id', () => {
            renderComponent({ isCascadingPolicyApplicable: true });

            expect(screen.getByTestId('metadata-icon')).toHaveAttribute('data-type', 'cascade');
        });

        test('uses the default icon when cascading is not applicable', () => {
            renderComponent({ isCascadingPolicyApplicable: false });

            expect(screen.getByTestId('metadata-icon')).toHaveAttribute('data-type', 'default');
        });

        test('uses the default icon when the policy has no id', () => {
            renderComponent({ cascadePolicy: {} });

            expect(screen.getByTestId('metadata-icon')).toHaveAttribute('data-type', 'default');
        });
    });

    describe('error state', () => {
        test('renders the alert icon and error class when hasError is true', () => {
            const { container } = renderComponent({ hasError: true });

            expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
            expect(container.querySelector('.metadata-instance-editor-instance-has-error')).toBeInTheDocument();
        });

        test('does not render the alert icon when hasError is false', () => {
            const { container } = renderComponent({ hasError: false });

            expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
            expect(container.querySelector('.metadata-instance-editor-instance-has-error')).not.toBeInTheDocument();
        });
    });

    describe('title', () => {
        test('shows the template display name for a user template', () => {
            renderComponent({ template: makeTemplate({ displayName: 'My Template' }) });

            expect(screen.getByText('My Template')).toBeInTheDocument();
        });

        test('shows the custom metadata title for the properties template', () => {
            renderComponent({ template: makePropertiesTemplate() });

            expect(screen.getByText(messages.customTitle.defaultMessage)).toBeInTheDocument();
        });
    });

    describe('content forwarding', () => {
        test('renders children and header action items', () => {
            renderComponent();

            expect(screen.getByTestId('card-child')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'edit-action' })).toBeInTheDocument();
        });
    });
});
