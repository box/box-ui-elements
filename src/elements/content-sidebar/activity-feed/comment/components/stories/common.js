// @flow
import { TIME_STRING_SEPT_27_2017, user1 } from '../../stories/common';

import { type BaseCommentMenuProps } from '../BaseCommentMenu';
import { type BaseCommentInfoProps } from '../BaseCommentInfo';

export const baseCommmentMenuDefaultProps: BaseCommentMenuProps = {
    canDelete: true,
    canEdit: true,
    canResolve: true,
    handleDeleteCancel: () => undefined,
    handleDeleteClick: () => undefined,
    handleDeleteConfirm: () => undefined,
    handleEditClick: () => undefined,
    handleMenuClose: () => undefined,
    // eslint-disable-next-line no-unused-vars
    handleStatusUpdate: args => undefined,
    isConfirmingDelete: false,
    isResolved: false,
    // eslint-disable-next-line no-unused-vars
    onSelect: args => undefined,
};

export const baseCommmentInfoDefaultProps: BaseCommentInfoProps = {
    created_at: TIME_STRING_SEPT_27_2017,
    created_by: user1,
    getAvatarUrl: (str: string) => new Promise(() => str),
};
