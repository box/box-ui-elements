// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import IconTrash from '../../../../icons/general/IconTrash';
import IconPencil from '../../../../icons/general/IconPencil';

import { MenuItem } from '../../../../components/menu';

import commonMessages from '../../../common/messages';
import messages from './messages';
import deleteMessages from '../inline-delete/messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { bdlGray80 } from '../../../../styles/variables';
import { COMMENT_TYPE_DEFAULT, COMMENT_TYPE_TASK } from '../../../../constants';

type Props = {
    id: string,
    onDeleteClick?: Function,
    onEditClick?: Function,
    permissions?: BoxItemPermission,
    type: typeof COMMENT_TYPE_DEFAULT | typeof COMMENT_TYPE_TASK,
};

const CommentMenuItems = (props: Props) => {
    const { onDeleteClick, onEditClick, permissions = {}, type } = props;
    const isTask = type === COMMENT_TYPE_TASK;
    const isEditSupported = isTask; // comment editing not supported
    const editLabel = isTask ? messages.taskEditMenuItem : commonMessages.editLabel;
    const deleteLabel = isTask ? messages.taskDeleteMenuItem : deleteMessages.deleteLabel;

    return (
        <>
            {!!onEditClick && !!permissions.can_edit && isEditSupported && (
                <MenuItem
                    className="bcs-comment-menu-edit"
                    data-resin-target={ACTIVITY_TARGETS.INLINE_EDIT}
                    onClick={onEditClick}
                >
                    <IconPencil color={bdlGray80} />
                    <FormattedMessage {...editLabel} />
                </MenuItem>
            )}
            {!!onDeleteClick && !!permissions.can_delete && (
                <MenuItem
                    className="bcs-comment-menu-delete"
                    data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE}
                    onClick={onDeleteClick}
                >
                    <IconTrash color={bdlGray80} />
                    <FormattedMessage {...deleteLabel} />
                </MenuItem>
            )}
        </>
    );
};

export default CommentMenuItems;
