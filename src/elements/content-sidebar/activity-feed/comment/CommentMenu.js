// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';

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
    isPending: boolean,
    onDelete: Function,
    onEdit: Function,
    permissions?: BoxItemPermission,
    toEdit: Function,
    type: typeof COMMENT_TYPE_DEFAULT | typeof COMMENT_TYPE_TASK,
} & InjectIntlProvidedProps;

class CommentMenu extends React.Component<Props> {
    onEdit = (): void => {
        const { id, toEdit } = this.props;
        toEdit({ id });
    };

    render() {
        const { intl, isDisabled, isPending, onDelete, onEdit, permissions, type } = this.props;
        const canDelete = getProp(permissions, 'can_delete', false);
        const canEdit = getProp(permissions, 'can_edit', false);
        const isTaskComment = type === COMMENT_TYPE_TASK;
        const editLabel = isTaskComment ? messages.taskEditMenuItem : messages.editLabel;
        const deleteLabel = isTaskComment ? messages.taskDeleteMenuItem : deleteMessages.deleteLabel;

        return (
            <DropdownMenu className="bcs-comment-menu-container" constrainToScrollParent isRightAligned>
                <PlainButton className="bcs-comment-menu-btn" isDisabled={isDisabled}>
                    <IconEllipsis color={nines} />
                </PlainButton>
                <Menu>
                    {!!onEdit && !!canEdit && !isPending && (
                        <MenuItem
                            aria-label={intl.formatMessage(editLabel)}
                            className="bcs-comment-menu-edit"
                            data-resin-target={ACTIVITY_TARGETS.INLINE_EDIT}
                            onClick={this.onEdit}
                        >
                            <IconPencil color={fours} />
                            <FormattedMessage {...editLabel} />
                        </MenuItem>
                    )}
                    {!!onDelete && !!canDelete && !isPending && (
                        <MenuItem
                            aria-label={intl.formatMessage(deleteMessages.deleteLabel)}
                            className="bcs-comment-menu-delete"
                            data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE}
                            onClick={onDelete}
                        >
                            <IconTrash color={fours} />
                            <FormattedMessage {...deleteLabel} />
                        </MenuItem>
                    )}
                </Menu>
            </DropdownMenu>
        );
    }
}

export { CommentMenu as CommentMenuBase };
export default injectIntl(CommentMenu);
