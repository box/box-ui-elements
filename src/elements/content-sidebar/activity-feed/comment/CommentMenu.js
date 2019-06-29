// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import IconTrash from '../../../../icons/general/IconTrash';
import IconEllipsis from '../../../../icons/general/IconEllipsis';
import IconPencil from '../../../../icons/general/IconPencil';

import PlainButton from '../../../../components/plain-button';
import DropdownMenu from '../../../../components/dropdown-menu';
import { Menu, MenuItem } from '../../../../components/menu';

import messages from '../../../common/messages';
import deleteMessages from '../inline-delete/messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { fours, nines } from '../../../../styles/variables';
import { COMMENT_TYPE_DEFAULT, COMMENT_TYPE_TASK } from '../../../../constants';

type Props = {
    id: string,
    isDisabled: boolean,
    onDeleteClick?: Function,
    onEditClick?: Function,
    permissions?: BoxItemPermission,
    type: typeof COMMENT_TYPE_DEFAULT | typeof COMMENT_TYPE_TASK,
};

const CommentMenu = (props: Props) => {
    const { isDisabled, onDeleteClick, onEditClick, permissions = {}, type } = props;
    const isTaskComment = type === COMMENT_TYPE_TASK;
    const editLabel = isTaskComment ? messages.taskEditMenuItem : messages.editLabel;
    const deleteLabel = isTaskComment ? messages.taskDeleteMenuItem : deleteMessages.deleteLabel;

    return (
        <DropdownMenu className="bcs-comment-menu-container" constrainToScrollParent isRightAligned>
            <PlainButton className="bcs-comment-menu-btn" isDisabled={isDisabled}>
                <IconEllipsis color={nines} height={16} width={16} />
            </PlainButton>
            <Menu>
                {!!onEditClick && !!permissions.can_edit && isTaskComment && (
                    <MenuItem
                        className="bcs-comment-menu-edit"
                        data-resin-target={ACTIVITY_TARGETS.INLINE_EDIT}
                        onClick={onEditClick}
                    >
                        <IconPencil color={fours} />
                        <FormattedMessage {...editLabel} />
                    </MenuItem>
                )}
                {!!onDeleteClick && !!permissions.can_delete && (
                    <MenuItem
                        className="bcs-comment-menu-delete"
                        data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE}
                        onClick={onDeleteClick}
                    >
                        <IconTrash color={fours} />
                        <FormattedMessage {...deleteLabel} />
                    </MenuItem>
                )}
            </Menu>
        </DropdownMenu>
    );
};

export default CommentMenu;
