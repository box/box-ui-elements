// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import TetherComponent from 'react-tether';
import { FormattedMessage } from 'react-intl';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import Checkmark16 from '../../../../icon/line/Checkmark16';
import Media from '../../../../components/media';
import { MenuItem } from '../../../../components/menu';
import messages from './messages';
import Pencil16 from '../../../../icon/line/Pencil16';
import Trash16 from '../../../../icon/line/Trash16';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED } from '../../../../constants';
import X16 from '../../../../icon/fill/X16';

export type MenuProps = {
    canDelete: boolean,
    canEdit: boolean,
    canResolve: boolean,
    handleDeleteClick: Function,
    handleEditClick: Function,
    handleMenuClose: Function,
    handleStatusUpdate: Function,
    isConfirmingDelete: boolean,
    isResolved: boolean,
    onSelect: Function,
};
const CommentMenu = ({
    canDelete = false,
    canEdit = false,
    canResolve = false,
    handleMenuClose = noop,
    isConfirmingDelete = false,
    isResolved = false,
    onSelect = noop,
    handleStatusUpdate = noop,
    handleEditClick = noop,
    handleDeleteClick = noop,
}: MenuProps) => {
    return (
        <TetherComponent
            attachment="top right"
            className="bcs-Comment-deleteConfirmationModal"
            constraints={[{ to: 'scrollParent', attachment: 'together' }]}
            targetAttachment="bottom right"
        >
            <Media.Menu
                isDisabled={isConfirmingDelete}
                data-testid="comment-actions-menu"
                dropdownProps={{
                    onMenuOpen: () => onSelect(true),
                    onMenuClose: handleMenuClose,
                }}
                menuProps={{
                    'data-resin-component': ACTIVITY_TARGETS.COMMENT_OPTIONS,
                }}
            >
                {canResolve && isResolved && (
                    <MenuItem
                        className="bcs-Comment-unresolveComment"
                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_EDIT}
                        data-testid="unresolve-comment"
                        onClick={() => handleStatusUpdate(COMMENT_STATUS_OPEN)}
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
                        data-resin-target={ACTIVITY_TARGETS.COMMENT_OPTIONS_DELETE}
                        data-testid="delete-comment"
                        onClick={handleDeleteClick}
                    >
                        <Trash16 />
                        <FormattedMessage {...messages.commentDeleteMenuItem} />
                    </MenuItem>
                )}
            </Media.Menu>
        </TetherComponent>
    );
};

export default CommentMenu;
