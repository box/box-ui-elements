import { useCallback, useEffect, useRef, useState } from 'react';
import type { History, Location } from 'history';
import type { MetadataTemplateInstance } from '@box/metadata-editor';
import { SIDEBAR_VIEW_METADATA } from '../../../constants';

interface Params {
    editingTemplate: MetadataTemplateInstance | null;
    fileId: string;
    history: History;
    isConfidenceScoreReviewEnabled: boolean;
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
    isConfidenceScoreReviewEnabled,
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
            if (isOpen || !isConfidenceScoreReviewEnabled) {
                return;
            }

            // re-sync the URL back to metadata if the URL was updated via host app
            if (pendingNavLocation) {
                history.replace(`/${SIDEBAR_VIEW_METADATA}`);
                setPendingNavLocation(null);
            }

            onWarningModalClose?.();
        },
        [
            setIsUnsavedChangesModalOpen,
            isConfidenceScoreReviewEnabled,
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
        if (!editingTemplate || !isConfidenceScoreReviewEnabled) {
            return undefined;
        }

        blockRouterHistory();

        return () => unblockRouterHistory();
    }, [editingTemplate, isConfidenceScoreReviewEnabled, blockRouterHistory, unblockRouterHistory]);

    return {
        handleUnsavedChangesModalOpen,
        pendingNavLocation,
        setPendingNavLocation,
        unblockRouterHistory,
    };
}
