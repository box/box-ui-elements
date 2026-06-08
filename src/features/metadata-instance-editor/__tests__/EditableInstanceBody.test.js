import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '../../../test-utils/testing-library';

import EditableInstanceBody from '../EditableInstanceBody';
import { makeRegularCascadePolicy, makeTemplate } from './__fixtures__/metadataInstances';

jest.mock('../CascadePolicy', () => ({
    __esModule: true,
    default: ({ canEdit, isExistingCascadePolicy }) => (
        <div
            data-testid="cascade-policy"
            data-can-edit={String(canEdit)}
            data-existing={String(isExistingCascadePolicy)}
        />
    ),
}));

jest.mock('../TemplatedInstance', () => ({
    __esModule: true,
    default: ({ canEdit, isDisabled }) => (
        <div data-testid="templated-instance" data-can-edit={String(canEdit)} data-is-disabled={String(isDisabled)} />
    ),
}));

jest.mock('../CustomInstance', () => ({
    __esModule: true,
    default: ({ canEdit }) => <div data-testid="custom-instance" data-can-edit={String(canEdit)} />,
}));

jest.mock('../Footer', () => ({
    __esModule: true,
    default: ({ onCancel, onRemove, showSave }) => (
        <div data-testid="footer" data-show-save={String(showSave)}>
            <button type="button" onClick={onCancel}>
                footer-cancel
            </button>
            <button type="button" onClick={onRemove}>
                footer-remove
            </button>
        </div>
    ),
}));

jest.mock('../MetadataInstanceConfirmDialog', () => ({
    __esModule: true,
    default: ({ confirmationMessage, onCancel, onConfirm }) => (
        <div data-testid="confirm-dialog">
            <span>{confirmationMessage}</span>
            <button type="button" onClick={onConfirm}>
                dialog-confirm
            </button>
            <button type="button" onClick={onCancel}>
                dialog-cancel
            </button>
        </div>
    ),
}));

const getProps = (props = {}) => ({
    canUseAIFolderExtraction: false,
    cascadePolicy: makeRegularCascadePolicy(),
    confirmationMessage: 'Remove this template?',
    data: { stringfield: 'some string' },
    errors: {},
    isAIFolderExtractionEnabled: false,
    isBusy: false,
    isCascadingEnabled: false,
    isCascadingOverwritten: false,
    isCascadingPolicyApplicable: true,
    isDirty: false,
    isEditing: true,
    isExistingCascadePolicy: false,
    isProperties: false,
    onAIAgentSelect: jest.fn(),
    onAIFolderExtractionToggle: jest.fn(),
    onCancel: jest.fn(),
    onCascadeModeChange: jest.fn(),
    onCascadeToggle: jest.fn(),
    onConfirmCancel: jest.fn(),
    onConfirmRemove: jest.fn(),
    onFieldChange: jest.fn(),
    onFieldRemove: jest.fn(),
    onRemove: jest.fn(),
    onSave: jest.fn(),
    shouldConfirmRemove: false,
    shouldShowCascadeOptions: false,
    template: makeTemplate(),
    ...props,
});

describe('features/metadata-instance-editor/EditableInstanceBody', () => {
    describe('confirm-remove dialog', () => {
        test('renders the confirm dialog instead of the form when shouldConfirmRemove is true', () => {
            render(<EditableInstanceBody {...getProps({ shouldConfirmRemove: true })} />);

            expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
            expect(screen.getByText('Remove this template?')).toBeInTheDocument();
            expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
            expect(screen.queryByTestId('cascade-policy')).not.toBeInTheDocument();
        });

        test('confirming the dialog calls onRemove', async () => {
            const onRemove = jest.fn();
            render(<EditableInstanceBody {...getProps({ shouldConfirmRemove: true, onRemove })} />);

            await userEvent.click(screen.getByRole('button', { name: 'dialog-confirm' }));

            expect(onRemove).toHaveBeenCalledTimes(1);
        });

        test('cancelling the dialog calls onConfirmCancel', async () => {
            const onConfirmCancel = jest.fn();
            render(<EditableInstanceBody {...getProps({ shouldConfirmRemove: true, onConfirmCancel })} />);

            await userEvent.click(screen.getByRole('button', { name: 'dialog-cancel' }));

            expect(onConfirmCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('cascade policy rendering', () => {
        test('renders CascadePolicy when isCascadingPolicyApplicable is true', () => {
            render(<EditableInstanceBody {...getProps({ isCascadingPolicyApplicable: true })} />);

            expect(screen.getByTestId('cascade-policy')).toBeInTheDocument();
        });

        test('does not render CascadePolicy when isCascadingPolicyApplicable is false', () => {
            render(<EditableInstanceBody {...getProps({ isCascadingPolicyApplicable: false })} />);

            expect(screen.queryByTestId('cascade-policy')).not.toBeInTheDocument();
        });
    });

    describe('custom vs templated fields', () => {
        test('renders CustomInstance for the properties template', () => {
            render(<EditableInstanceBody {...getProps({ isProperties: true })} />);

            expect(screen.getByTestId('custom-instance')).toBeInTheDocument();
            expect(screen.queryByTestId('templated-instance')).not.toBeInTheDocument();
        });

        test('renders TemplatedInstance for a user template', () => {
            render(<EditableInstanceBody {...getProps({ isProperties: false })} />);

            expect(screen.getByTestId('templated-instance')).toBeInTheDocument();
            expect(screen.queryByTestId('custom-instance')).not.toBeInTheDocument();
        });

        test('disables templated fields when AI folder extraction is enabled', () => {
            render(<EditableInstanceBody {...getProps({ isAIFolderExtractionEnabled: true })} />);

            expect(screen.getByTestId('templated-instance')).toHaveAttribute('data-is-disabled', 'true');
        });

        test('does not disable templated fields when AI folder extraction is disabled', () => {
            render(<EditableInstanceBody {...getProps({ isAIFolderExtractionEnabled: false })} />);

            expect(screen.getByTestId('templated-instance')).toHaveAttribute('data-is-disabled', 'false');
        });
    });

    describe('footer', () => {
        test('renders the footer when editing', () => {
            render(<EditableInstanceBody {...getProps({ isEditing: true })} />);

            expect(screen.getByTestId('footer')).toBeInTheDocument();
        });

        test('does not render the footer when not editing', () => {
            render(<EditableInstanceBody {...getProps({ isEditing: false })} />);

            expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
        });

        test('shows the save button only when the form is dirty', () => {
            const { rerender } = render(<EditableInstanceBody {...getProps({ isDirty: true })} />);
            expect(screen.getByTestId('footer')).toHaveAttribute('data-show-save', 'true');

            rerender(<EditableInstanceBody {...getProps({ isDirty: false })} />);
            expect(screen.getByTestId('footer')).toHaveAttribute('data-show-save', 'false');
        });

        test('footer remove triggers onConfirmRemove and cancel triggers onCancel', async () => {
            const onConfirmRemove = jest.fn();
            const onCancel = jest.fn();
            render(<EditableInstanceBody {...getProps({ onConfirmRemove, onCancel })} />);

            await userEvent.click(screen.getByRole('button', { name: 'footer-remove' }));
            expect(onConfirmRemove).toHaveBeenCalledTimes(1);

            await userEvent.click(screen.getByRole('button', { name: 'footer-cancel' }));
            expect(onCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('form submission', () => {
        test('calls onSave on submit when the form is dirty', () => {
            const onSave = jest.fn();
            const { container } = render(<EditableInstanceBody {...getProps({ isDirty: true, onSave })} />);

            fireEvent.submit(container.querySelector('form'));

            expect(onSave).toHaveBeenCalledTimes(1);
        });

        test('does not call onSave on submit when the form is not dirty', () => {
            const onSave = jest.fn();
            const { container } = render(<EditableInstanceBody {...getProps({ isDirty: false, onSave })} />);

            fireEvent.submit(container.querySelector('form'));

            expect(onSave).not.toHaveBeenCalled();
        });
    });
});
