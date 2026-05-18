/**
 * @file Variant-picking wrapper for the metadata template dropdown.
 *
 * Composes the BUE-owned `itemsService` (data) and `eventService`
 * (side effects) hooks for the template-management variant, and selects
 * between that and the legacy static-list variant via the
 * `isMetadataTemplateManagementEnabled` flag.
 *
 * The metadata-editor package owns only UI; this file owns the wiring.
 */
import React from 'react';
import {
    AddMetadataTemplateDropdown,
    AddMetadataTemplateDropdownWithBrowser,
    type BrowserMetadataTemplate,
    type MetadataTemplate,
} from '@box/metadata-editor';

import useMetadataTemplateEventService from './hooks/useMetadataTemplateEventService';
import useMetadataTemplateItemsService from './hooks/useMetadataTemplateItemsService';

export interface MetadataTemplateDropdownProps {
    templates: MetadataTemplate[];
    selectedTemplates: MetadataTemplate[];
    enterpriseId: string;
    onSelect: (template: MetadataTemplate) => void;
    isMetadataTemplateManagementEnabled: boolean;
    /**
     * Browser-shape view of session-created templates, grouped by namespace
     * FQN. Merged into the data layer so freshly-created templates appear at
     * the top of their namespace's list on every dropdown reopen.
     */
    browserTemplatesByNamespace: ReadonlyMap<string, BrowserMetadataTemplate[]>;
    /**
     * Editor-shape view of session-created templates, keyed by template id.
     * Forwarded to the selection bridge as a fallback pool so newly-created
     * templates can be selected even though they're not in the host's
     * primary `templates` array.
     */
    editorTemplatesById: ReadonlyMap<string, MetadataTemplate>;
    /** Opens the editor modal in create mode for the given namespace FQN. */
    onCreateTemplate?: (namespaceFqn: string) => void;
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
    browserTemplatesByNamespace,
    canCreateAtRoot,
    editorTemplatesById,
    enterpriseId,
    isMetadataTemplateManagementEnabled,
    onCreateTemplate,
    onOpenChange,
    onSelect,
    open,
    selectedTemplates,
    templates,
}: Readonly<MetadataTemplateDropdownProps>) {
    const itemsService = useMetadataTemplateItemsService(templates, browserTemplatesByNamespace);
    const eventService = useMetadataTemplateEventService({
        templates,
        onSelect,
        onCreateTemplate,
        additionalTemplatesById: editorTemplatesById,
    });

    if (isMetadataTemplateManagementEnabled) {
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
