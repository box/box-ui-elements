import * as React from 'react';

import { FormattedMessage } from 'react-intl';
import TetherComponent from 'react-tether';

import { ACTIVITY_TARGETS } from '../../../../common/interactionTargets';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED } from '../../../../../constants';
import { MenuItem } from '../../../../../components/menu';

import Checkmark16 from '../../../../../icon/line/Checkmark16';
import DeleteConfirmation from '../../common/delete-confirmation';
import Media from '../../../../../components/media';
import messages from '../messages';
import Pencil16 from '../../../../../icon/line/Pencil16';
import Trash16 from '../../../../../icon/line/Trash16';
import X16 from '../../../../../icon/fill/X16';

import { FeedItemStatus } from '../../../../../common/types/feed';
import './BaseCommentMenu.scss';

interface MenuProps {
    'data-resin-component'?: string;
}

interface DropdownProps {
    onMenuOpen: () => void;
    onMenuClose: () => void;
}

interface MenuItemProps {
    className?: string;
    'data-resin-target'?: string;
    'data-testid'?: string;
    'aria-label'?: string;
    onClick: () => void;
    children: React.ReactNode;
}

interface DeleteConfirmationProps {
    'data-resin-component'?: string;
    isOpen: boolean;
    message: { id: string; defaultMessage: string };
    onDeleteCancel: () => void;
    onDeleteConfirm: () => void;
}

// DEVIN_TODO: Need proper types from @types/react-tether
// Removed unused TetherProps interface as it's handled by @ts-expect-error

export interface BaseCommentMenuProps {
    canDelete: boolean;
    canEdit: boolean;
    canResolve: boolean;
    handleDeleteCancel: () => void;
    handleDeleteClick: () => void;
    handleDeleteConfirm: () => void;
    handleEditClick: () => void;
    handleMenuClose: () => void;
    handleStatusUpdate: (selectedStatus: FeedItemStatus) => void;
    isConfirmingDelete: boolean;
    isResolved: boolean;
    onSelect: (isSelected: boolean) => void;
}
export const BaseCommentMenu = ({
    canDelete,
    canEdit,
    canResolve,
    handleDeleteCancel,
    handleDeleteClick,
    handleDeleteConfirm,
    handleEditClick,
    handleMenuClose,
    handleStatusUpdate,
    isConfirmingDelete,
    isResolved,
    onSelect,
}: BaseCommentMenuProps) => {
    return (
        <TetherComponent
            // @ts-expect-error Awaiting proper types from @types/react-tether
            attachment="top right"
            className="bcs-Comment-deleteConfirmationModal"
            constraints={[{ to: 'scrollParent', attachment: 'together' }]}
            targetAttachment="bottom right"
        >
            <Media.Menu
                data-testid="comment-actions-menu"
                dropdownProps={
                    {
                        onMenuOpen: () => onSelect(true),
                        onMenuClose: handleMenuClose,
                    } as DropdownProps
                }
                className="BaseCommentMenu"
                isDisabled={isConfirmingDelete}
                menuProps={
                    {
                        'data-resin-component': ACTIVITY_TARGETS.COMMENT_OPTIONS,
                    } as MenuProps
                }
            >
                {canResolve && isResolved && (
                    <MenuItem
                        className="bcs-Comment-unresolveComment"
                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                        data-testid="unresolve-comment"
                        onClick={() => handleStatusUpdate(COMMENT_STATUS_OPEN)}
                        {...({} as MenuItemProps)}
                    >
                        <X16 />
                        <FormattedMessage {...messages.commentUnresolveMenuItem} />
                    </MenuItem>
                )}
                {canResolve && !isResolved && (
                    <MenuItem
                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                        data-testid="resolve-comment"
                        onClick={() => handleStatusUpdate(COMMENT_STATUS_RESOLVED)}
                    >
                        <Checkmark16 />
                        <FormattedMessage {...messages.commentResolveMenuItem} />
                    </MenuItem>
                )}
                {canEdit && (
                    <MenuItem
                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                        data-testid="edit-comment"
                        onClick={handleEditClick}
                    >
                        <Pencil16 />
                        <FormattedMessage {...messages.commentEditMenuItem} />
                    </MenuItem>
                )}
                {canDelete && (
                    <MenuItem
                        aria-label={messages.commentDeleteMenuItem.defaultMessage}
                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_DELETE}
                        data-testid="delete-comment"
                        onClick={handleDeleteClick}
                    >
                        <Trash16 />
                        <FormattedMessage {...messages.commentDeleteMenuItem} />
                    </MenuItem>
                )}
            </Media.Menu>

            {isConfirmingDelete && (
                <DeleteConfirmation
                    data-resin-component={ACTIVITY_TARGETS.COMMENT_OPTIONS}
                    isOpen={isConfirmingDelete}
                    message={messages.commentDeletePrompt}
                    onDeleteCancel={handleDeleteCancel}
                    onDeleteConfirm={handleDeleteConfirm}
                    {...({} as DeleteConfirmationProps)}
                />
            )}
        </TetherComponent>
    );
};
