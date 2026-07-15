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
import React, { useCallback } from 'react';
import { AddMetadataTemplateDropdown, AddMetadataTemplateDropdownWithBrowser } from '@box/metadata-editor';
import type { MetadataTemplate as EditorMetadataTemplate } from '@box/metadata-editor';
import type { ItemsService } from '@box/metadata-template-browser';

import useMetadataTemplateEventService from './hooks/useMetadataTemplateEventService';

export interface MetadataTemplateDropdownProps {
    templates: EditorMetadataTemplate[];
    selectedTemplates: EditorMetadataTemplate[];
    enterpriseId: string | undefined;
    itemsService: ItemsService | undefined;
    onSelect: (template: EditorMetadataTemplate) => void;
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
    isMetadataTemplateManagementEnabled,
    itemsService,
    onCreateTemplate,
    onEditTemplate,
    onOpenChange,
    onSelect,
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const namespaceFqn = template.scope ?? (template as any).namespace;
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
        onCreateTemplate: isMetadataTemplateManagementEnabled ? onCreateTemplate : undefined,
        onEditTemplate: isMetadataTemplateManagementEnabled && onEditTemplate ? handleEditTemplateById : undefined,
    });

    if (isMetadataTemplateManagementEnabled && enterpriseId && itemsService) {
        return (
            <AddMetadataTemplateDropdownWithBrowser
                canCreateAtRoot={canCreateAtRoot}
                enterpriseId={enterpriseId}
                eventService={eventService}
                itemsService={itemsService}
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
