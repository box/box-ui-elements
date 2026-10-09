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
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AddMetadataTemplateDropdown, AddMetadataTemplateDropdownWithBrowser } from '@box/metadata-editor';
import type { MetadataTemplate as EditorMetadataTemplate } from '@box/metadata-editor';
import type { ItemsService, MetadataTemplate as BrowserMetadataTemplate } from '@box/metadata-template-browser';

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
    /** Opens the template editor modal in edit mode for the given template. */
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
    const templateLocatorsRef = useRef(new Map<string, { namespaceFqn: string; templateKey: string }>());

    const rememberTemplateLocator = useCallback((template: BrowserMetadataTemplate | EditorMetadataTemplate) => {
        const namespaceFqn = getMetadataTemplateNamespaceFqn(template);
        if (template.id && namespaceFqn && template.templateKey) {
            templateLocatorsRef.current.set(template.id, { namespaceFqn, templateKey: template.templateKey });
        }
    }, []);

    useEffect(() => {
        templates.forEach(rememberTemplateLocator);
    }, [rememberTemplateLocator, templates]);

    const rememberTemplates = useCallback(
        (entries: BrowserMetadataTemplate[]) => {
            entries.forEach(rememberTemplateLocator);
        },
        [rememberTemplateLocator],
    );

    // Bridge: template id → { namespaceFqn, templateKey } for the edit callback.
    const handleEditTemplateById = useCallback(
        (templateId: string) => {
            if (!onEditTemplate) return;
            const loaded = templates.find(template => template.id === templateId);
            const namespaceFqn = loaded ? getMetadataTemplateNamespaceFqn(loaded) : undefined;
            if (loaded?.templateKey && namespaceFqn) {
                onEditTemplate({ namespaceFqn, templateKey: loaded.templateKey });
                return;
            }
            const located = templateLocatorsRef.current.get(templateId);
            if (located) {
                onEditTemplate(located);
            }
        },
        [templates, onEditTemplate],
    );

    const appliedTemplateIds = useMemo(
        () => new Set(selectedTemplates.map(template => template.id).filter((id): id is string => Boolean(id))),
        [selectedTemplates],
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
            ...(itemsService.getTemplates
                ? {
                      getTemplates: async (namespaceFqn, params) => {
                          const page = await itemsService.getTemplates!(namespaceFqn, params);
                          rememberTemplates(page.entries);
                          return page;
                      },
                  }
                : {}),
            ...(itemsService.getSearchResults
                ? {
                      getSearchResults: async (query, params) => {
                          const page = await itemsService.getSearchResults!(query, params);
                          rememberTemplates(page.entries);
                          return page;
                      },
                  }
                : {}),
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
    }, [handleEditTemplateById, itemsService, onCreateTemplate, onEditTemplate, rememberTemplates]);

    if (isMetadataTemplateManagementEnabled && enterpriseId && browserItemsService) {
        return (
            <AddMetadataTemplateDropdownWithBrowser
                appliedTemplateIds={appliedTemplateIds}
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
