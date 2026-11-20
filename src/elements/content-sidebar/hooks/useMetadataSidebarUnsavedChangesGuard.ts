import { useCallback, useEffect, useRef, useState } from 'react';
import type { History, Location } from 'history';
import type { MetadataTemplateInstance } from '@box/metadata-editor';
import { SIDEBAR_VIEW_METADATA } from '../../../constants';

interface Params {
    editingTemplate: MetadataTemplateInstance | null;
    fileId: string;
    history?: History;
    isBoundingBoxOrConfidenceScoreReviewEnabled: boolean;
    onEditingStateChange?: (isEditing: boolean) => void;
    setEditingTemplate: (t: MetadataTemplateInstance | null) => void;
    setIsUnsavedChangesModalOpen: (open: boolean) => void;
    setPendingTemplateToEdit: (t: MetadataTemplateInstance | null) => void;
    registerOpenWarningModalCallback?: (fn: (isOpen: boolean) => void) => void;
    onWarningModalClose?: () => void;
}

interface Result {
    handleUnsavedChangesModalOpen: (isOpen: boolean) => void;
    pendingNavLocation: Location | null;
    setPendingNavLocation: (loc: Location | null) => void;
    unblockRouterHistory: () => void;
}

export default function useMetadataSidebarUnsavedChangesGuard({
    editingTemplate,
    fileId,
    history,
    isBoundingBoxOrConfidenceScoreReviewEnabled,
    onEditingStateChange,
    setEditingTemplate,
    setIsUnsavedChangesModalOpen,
    setPendingTemplateToEdit,
    registerOpenWarningModalCallback,
    onWarningModalClose,
}: Params): Result {
    const [pendingNavLocation, setPendingNavLocation] = useState<Location | null>(null);
    const unblockRouterRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        setEditingTemplate(null);
        setPendingTemplateToEdit(null);
        setIsUnsavedChangesModalOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileId]);

    const blockRouterHistory = useCallback(() => {
        // Navigation can be blocked only with router history (not available when router is disabled).
        // No router-less replacement is added here on purpose: router-less sidebar navigation is owned by Sidebar,
        // which should check the editing state (onEditingStateChange) and open the warning modal
        // (registerOpenWarningModalCallback) the same way ContentPreview guards file navigation.
        if (!history) {
            return;
        }

        unblockRouterRef.current = history.block(location => {
            if (location.pathname === `/${SIDEBAR_VIEW_METADATA}`) {
                return undefined;
            }
            setPendingNavLocation(location);
            setIsUnsavedChangesModalOpen(true);
            return false;
        });
    }, [history, setIsUnsavedChangesModalOpen]);

    const unblockRouterHistory = useCallback(() => {
        unblockRouterRef.current?.();
        unblockRouterRef.current = null;
    }, []);

    const handleUnsavedChangesModalOpen = useCallback(
        (isOpen: boolean) => {
            setIsUnsavedChangesModalOpen(isOpen);
            if (isOpen || !isBoundingBoxOrConfidenceScoreReviewEnabled) {
                return;
            }

            // re-sync the URL back to metadata if the URL was updated via host app
            // (router only - without router the host app owns its navigation and can check the editing state itself)
            if (pendingNavLocation && history) {
                history.replace(`/${SIDEBAR_VIEW_METADATA}`);
                setPendingNavLocation(null);
            }

            onWarningModalClose?.();
        },
        [
            setIsUnsavedChangesModalOpen,
            isBoundingBoxOrConfidenceScoreReviewEnabled,
            pendingNavLocation,
            history,
            onWarningModalClose,
        ],
    );

    useEffect(() => {
        onEditingStateChange?.(!!editingTemplate);
    }, [editingTemplate, onEditingStateChange]);

    useEffect(() => {
        registerOpenWarningModalCallback?.(handleUnsavedChangesModalOpen);
    }, [registerOpenWarningModalCallback, handleUnsavedChangesModalOpen]);

    useEffect(() => {
        if (!editingTemplate || !isBoundingBoxOrConfidenceScoreReviewEnabled) {
            return undefined;
        }

        blockRouterHistory();

        return () => unblockRouterHistory();
    }, [editingTemplate, isBoundingBoxOrConfidenceScoreReviewEnabled, blockRouterHistory, unblockRouterHistory]);

    return {
        handleUnsavedChangesModalOpen,
        pendingNavLocation,
        setPendingNavLocation,
        unblockRouterHistory,
    };
}
