import { TIME_STRING_SEPT_27_2017, user1 } from '../../stories/common';

import { BaseCommentMenuProps } from '../BaseCommentMenu';
import { BaseCommentInfoProps } from '../BaseCommentInfo';

export const baseCommmentMenuDefaultProps: BaseCommentMenuProps = {
    canDelete: true,
    canEdit: true,
    canResolve: true,
    handleDeleteCancel: () => undefined,
    handleDeleteClick: () => undefined,
    handleDeleteConfirm: () => undefined,
    handleEditClick: () => undefined,
    handleMenuClose: () => undefined,
    handleStatusUpdate: () => undefined,
    isConfirmingDelete: false,
    isResolved: false,
    onSelect: () => undefined,
};

export const baseCommmentInfoDefaultProps: BaseCommentInfoProps = {
    created_at: TIME_STRING_SEPT_27_2017,
    created_by: user1,
    getAvatarUrl: (str: string) => new Promise<string>(() => str),
};
