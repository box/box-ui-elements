/**
 * @file Variant-picking wrapper for the metadata template dropdown.
 *
 * Composes the BUE-owned `itemsService` (data) and `eventService`
 * (side-effects) for the template-management variant, and selects between
 * that and the legacy static-list variant based on
 * `isMetadataTemplateManagementEnabled`.
 *
 * The metadata-editor package owns only UI; this file owns the wiring.
 */
import React, { useCallback, useMemo } from 'react';
import { AddMetadataTemplateDropdown, AddMetadataTemplateDropdownWithBrowser } from '@box/metadata-editor';
import type { MetadataTemplate as EditorMetadataTemplate } from '@box/metadata-editor';
import type { ItemsService } from '@box/metadata-template-browser';

import useMetadataTemplateEventService, { type MetadataTemplateLocator } from './hooks/useMetadataTemplateEventService';
import { getMetadataTemplateNamespaceFqn } from './utils/metadataTemplateIdentity';

export interface MetadataTemplateDropdownProps {
    templates: EditorMetadataTemplate[];
    selectedTemplates: EditorMetadataTemplate[];
    enterpriseId: string | undefined;
    itemsService: ItemsService | undefined;
    onSelect: (template: EditorMetadataTemplate) => void;
    /**
     * Fetches a template that is not in `templates` — child-namespace templates are
     * listed by the browser but never loaded by the sidebar's root-only fetch.
     */
    fetchTemplate?: (locator: MetadataTemplateLocator) => Promise<EditorMetadataTemplate | null>;
    /** Reports a selection that could not be resolved. */
    onSelectError?: (error: Error) => void;
    isMetadataTemplateManagementEnabled: boolean;
    /** Opens the template editor modal in create mode for the given namespace FQN. */
    onCreateTemplate?: (namespaceFqn: string) => void;
    /**
     * Opens the template editor modal in edit mode for the given template.
     * The `templateId` is the native API id; the consumer looks it up in
     * `templates` to recover `namespaceFqn` and `templateKey`.
     */
    onEditTemplate?: (args: { namespaceFqn: string; templateKey: string }) => void;
    /** Whether template creation is allowed at the enterprise root namespace. */
    canCreateAtRoot?: boolean;
    /**
     * Controlled open state for the dropdown popover. When provided together
     * with `onOpenChange`, the host owns visibility — used to dismiss the
     * popover when escalating to the template editor modal.
     */
    open?: boolean;
    /** Called whenever the popover proposes a new open state. */
    onOpenChange?: (open: boolean) => void;
}

export default function MetadataTemplateDropdown({
    canCreateAtRoot,
    enterpriseId,
    fetchTemplate,
    isMetadataTemplateManagementEnabled,
    itemsService,
    onCreateTemplate,
    onEditTemplate,
    onOpenChange,
    onSelect,
    onSelectError,
    open,
    selectedTemplates,
    templates,
}: Readonly<MetadataTemplateDropdownProps>) {
    // Bridge: native template id → { namespaceFqn, templateKey } for the edit callback.
    const handleEditTemplateById = useCallback(
        (templateId: string) => {
            if (!onEditTemplate) return;
            // Primary: exact id match against already-loaded editor templates.
            const template = templates.find(t => t.id === templateId);
            if (template?.templateKey) {
                const namespaceFqn = getMetadataTemplateNamespaceFqn(template);
                if (namespaceFqn) {
                    onEditTemplate({ namespaceFqn, templateKey: template.templateKey });
                    return;
                }
            }
            // Fallback: mock template ids are encoded as "fqn||templateKey".
            // This handles child-namespace templates and newly created mock templates
            // that aren't yet in the editor templates list.
            if (templateId.includes('||')) {
                const separatorIndex = templateId.indexOf('||');
                const namespaceFqn = templateId.slice(0, separatorIndex);
                const templateKey = templateId.slice(separatorIndex + 2);
                if (namespaceFqn && templateKey) {
                    onEditTemplate({ namespaceFqn, templateKey });
                }
            }
        },
        [templates, onEditTemplate],
    );

    const eventService = useMetadataTemplateEventService({
        templates,
        onSelect,
        fetchTemplate: isMetadataTemplateManagementEnabled ? fetchTemplate : undefined,
        onSelectError,
        onCreateTemplate: isMetadataTemplateManagementEnabled ? onCreateTemplate : undefined,
        onEditTemplate: isMetadataTemplateManagementEnabled && onEditTemplate ? handleEditTemplateById : undefined,
    });

    // The template browser opens create/edit via ItemsService, not EventService.
    const browserItemsService = useMemo<ItemsService | undefined>(() => {
        if (!itemsService) {
            return undefined;
        }
        return {
            ...itemsService,
            ...(onCreateTemplate
                ? {
                      createTemplate: async (namespaceFqn: string) => {
                          onCreateTemplate(namespaceFqn);
                          return undefined;
                      },
                  }
                : {}),
            ...(onEditTemplate
                ? {
                      updateTemplate: async (templateId: string) => {
                          handleEditTemplateById(templateId);
                          return undefined;
                      },
                  }
                : {}),
        };
    }, [handleEditTemplateById, itemsService, onCreateTemplate, onEditTemplate]);

    if (isMetadataTemplateManagementEnabled && enterpriseId && browserItemsService) {
        return (
            <AddMetadataTemplateDropdownWithBrowser
                canCreateAtRoot={canCreateAtRoot}
                enterpriseId={enterpriseId}
                eventService={eventService}
                isNamespacesEnabled
                itemsService={browserItemsService}
                onOpenChange={onOpenChange}
                open={open}
            />
        );
    }

    return (
        <AddMetadataTemplateDropdown
            availableTemplates={templates}
            selectedTemplates={selectedTemplates}
            onSelect={onSelect}
        />
    );
}
