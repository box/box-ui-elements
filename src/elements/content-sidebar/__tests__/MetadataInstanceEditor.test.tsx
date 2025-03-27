import React from 'react';
import {
    AutofillContextProvider,
    type MetadataTemplateField,
    type MetadataTemplateInstance,
} from '@box/metadata-editor';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '@box/blueprint-web';
import { IntlProvider } from 'react-intl';
import { screen, render } from '../../../test-utils/testing-library';
import MetadataInstanceEditor, { MetadataInstanceEditorProps } from '../MetadataInstanceEditor';
import { FeatureProvider } from '../../common/feature-checking';

const mockOnCancel = jest.fn();
const mockOnDiscardUnsavedChanges = jest.fn();
const mockSetIsUnsavedChangesModalOpen = jest.fn();

jest.unmock('react-intl');

const wrapper = ({ children }) => (
    <AutofillContextProvider fetchSuggestions={() => Promise.resolve([])} isAiSuggestionsFeatureEnabled>
        <FeatureProvider features={{}}>
            <TooltipProvider>
                <IntlProvider locale="en">{children}</IntlProvider>
            </TooltipProvider>
        </FeatureProvider>
    </AutofillContextProvider>
);

const renderWithAutofill = element => render(element, { wrapper });

describe('MetadataInstanceEditor', () => {
    const mockCustomMetadataTemplate: MetadataTemplateInstance = {
        id: 'template-id',
        fields: [],
        scope: 'global',
        templateKey: 'properties',
        type: 'template-id',
        hidden: false,
        canEdit: true,
    };

    const mockMetadataTemplate: MetadataTemplateInstance = {
        ...mockCustomMetadataTemplate,
        displayName: 'Template Name',
        canEdit: true,
    };

    const mockCustomMetadataTemplateWithField: MetadataTemplateInstance = {
        id: 'template-id',
        fields: [
            {
                id: '1',
                type: 'string',
                key: 'signature',
                hidden: false,
                displayName: 'Signature',
            },
        ],
        scope: 'global',
        templateKey: 'customTemplate',
        type: 'template-id',
        hidden: false,
        canEdit: true,
    };

    const mockMetadataTemplateInstance: MetadataTemplateInstance = {
        ...mockCustomMetadataTemplate,
        displayName: 'Template Name',
    };

    const defaultProps: MetadataInstanceEditorProps = {
        areAiSuggestionsAvailable: true,
        isBetaLanguageEnabled: false,
        isBoxAiSuggestionsEnabled: true,
        isDeleteButtonDisabled: false,
        isLargeFile: false,
        isMetadataMultiLevelTaxonomyFieldEnabled: false,
        isUnsavedChangesModalOpen: false,
        onCancel: mockOnCancel,
        onDelete: jest.fn(),
        onDiscardUnsavedChanges: mockOnDiscardUnsavedChanges,
        onSubmit: jest.fn(),
        setIsUnsavedChangesModalOpen: mockSetIsUnsavedChangesModalOpen,
        taxonomyOptionsFetcher: jest.fn(),
        template: mockMetadataTemplate,
    };

    test('should render MetadataInstanceForm with correct props', () => {
        renderWithAutofill(<MetadataInstanceEditor {...defaultProps} />);

        const templateHeader = screen.getByText(mockMetadataTemplateInstance.displayName);
        expect(templateHeader).toBeInTheDocument();
    });

    test('should render MetadataInstanceForm with Custom Template', () => {
        const props = { ...defaultProps, template: mockCustomMetadataTemplate };
        renderWithAutofill(<MetadataInstanceEditor {...props} />);

        const templateHeader = screen.getByText('Custom Metadata');
        expect(templateHeader).toBeInTheDocument();
    });

    test('should render UnsavedChangesModal if isUnsavedChangesModalOpen is true', async () => {
        const props = { ...defaultProps, isUnsavedChangesModalOpen: true };
        const { findByText } = renderWithAutofill(<MetadataInstanceEditor {...props} />);

        const unsavedChangesModal = await findByText('Unsaved Changes');
        expect(unsavedChangesModal).toBeInTheDocument();
    });

    test('should render MetadataInstanceForm with Delete button disabled', () => {
        const props = { ...defaultProps, isDeleteButtonDisabled: true };
        renderWithAutofill(<MetadataInstanceEditor {...props} />);

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        expect(deleteButton).toBeDisabled();
    });

    test('should render MetadataInstanceForm with Delete button enabled', () => {
        renderWithAutofill(<MetadataInstanceEditor {...defaultProps} />);

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        expect(deleteButton).toBeEnabled();
    });

    test('Should call onCancel when canceling editing', async () => {
        const props: MetadataInstanceEditorProps = { ...defaultProps, template: mockCustomMetadataTemplate };
        renderWithAutofill(<MetadataInstanceEditor {...props} />);

        const cancelButton = await screen.findByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });

    test('Should call onDiscardUnsavedChanges instead onCancel when canceling through UnsavedChangesModal', async () => {
        const props: MetadataInstanceEditorProps = {
            ...defaultProps,
            template: mockCustomMetadataTemplateWithField,
        };
        const { rerender } = renderWithAutofill(<MetadataInstanceEditor {...props} />);

        const input = await screen.findByRole('textbox');
        const cancelButton = await screen.findByRole('button', { name: 'Cancel' });

        await userEvent.type(input, 'Lorem ipsum dolor.');
        await userEvent.click(cancelButton);

        expect(mockOnCancel).not.toHaveBeenCalled();
        expect(mockSetIsUnsavedChangesModalOpen).toHaveBeenCalledWith(true);

        rerender(<MetadataInstanceEditor {...props} isUnsavedChangesModalOpen={true} />);

        const unsavedChangesModal = await screen.findByText('Unsaved Changes');

        expect(unsavedChangesModal).toBeInTheDocument();
        const unsavedChangesModalDiscardButton = await screen.findByRole('button', { name: 'Discard Changes' });

        await userEvent.click(unsavedChangesModalDiscardButton);

        expect(mockOnDiscardUnsavedChanges).toHaveBeenCalled();
    });

    test('should call taxonomyOptionsFetcher on metadata taxonomy field search', async () => {
        const taxonomyField: MetadataTemplateField = {
            type: 'taxonomy',
            key: 'States',
            displayName: 'States',
            description: 'State locations',
            hidden: false,
            id: '2',
            taxonomyKey: 'geography',
            taxonomyId: '1',
            optionsRules: {
                multiSelect: true,
                selectableLevels: [1],
            },
        };

        const template: MetadataTemplateInstance = {
            ...mockCustomMetadataTemplateWithField,
            fields: [...mockCustomMetadataTemplateWithField.fields, taxonomyField],
        };

        const props: MetadataInstanceEditorProps = {
            ...defaultProps,
            template,
        };

        const { getByRole } = renderWithAutofill(<MetadataInstanceEditor {...props} />);
        const combobox = getByRole('combobox', { name: 'States' });

        await userEvent.type(combobox, 'A');

        expect(props.taxonomyOptionsFetcher).toHaveBeenCalledWith(
            template.scope,
            template.templateKey,
            taxonomyField.key,
            taxonomyField.optionsRules.selectableLevels[0],
            { marker: null, searchInput: 'A', signal: expect.anything() },
        );
    });
});
