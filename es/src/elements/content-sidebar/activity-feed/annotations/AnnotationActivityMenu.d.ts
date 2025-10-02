import * as React from 'react';
import type { FeedItemStatus } from '../../../../common/types/feed';
import './AnnotationActivityMenu.scss';
export interface AnnotationActivityMenuProps {
    canDelete?: boolean;
    canEdit?: boolean;
    canResolve?: boolean;
    className?: string;
    id: string;
    isDisabled?: boolean;
    onDelete: () => void;
    onEdit: () => void;
    onMenuClose: () => void;
    onMenuOpen: () => void;
    onStatusChange: (newStatus: FeedItemStatus) => void;
    status?: FeedItemStatus;
}
declare const AnnotationActivityMenu: ({ canDelete, canEdit, canResolve, className, id, isDisabled, onDelete, onEdit, onMenuClose, onMenuOpen, onStatusChange, status, }: AnnotationActivityMenuProps) => React.JSX.Element;
export default AnnotationActivityMenu;
