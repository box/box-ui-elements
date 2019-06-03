// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';

import EditMenuItem from './EditMenuItem';
import IconTrash from '../../../../icons/general/IconTrash';
import PlainButton from '../../../../components/plain-button';
import DropdownMenu from '../../../../components/dropdown-menu';
import { Menu, MenuItem } from '../../../../components/menu';
import { Overlay } from '../../../../components/flyout';

import messages from '../../../common/messages';
import deleteMessages from '../inline-delete/messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';

type Props = {
    id: string,
    inlineDeleteMessage: string,
    isPending: boolean,
    onDelete: Function,
    onEdit: Function,
    permissions?: BoxItemPermission,
    toEdit: Function,
} & InjectIntlProvidedProps;

type State = {
    isConfirming?: boolean,
};

class CommentMenu extends React.Component<Props, State> {
    state = {
        isConfirming: false,
    };

    onDeleteConfirmedHandler = (): void => {
        const { id, onDelete, permissions } = this.props;
        onDelete({ id, permissions });
    };

    onDeleteCancel = (): void => {
        this.setState({ isConfirming: false });
    };

    onDeleteClick = () => {
        this.setState({ isConfirming: true });
    };

    render() {
        const { id, intl, inlineDeleteMessage, isPending, onDelete, onEdit, permissions, toEdit } = this.props;
        const canDelete = getProp(permissions, 'can_delete', false);
        const canEdit = getProp(permissions, 'can_edit', false);
        const { isConfirming } = this.state;

        return !isConfirming ? (
            <DropdownMenu classname="bsc-comment-menu-container" constrainToScrollParent isRightAligned>
                <PlainButton classname="bsc-comment-menu-btn">...</PlainButton>
                <Menu>
                    {!!onEdit && !!canEdit && !isPending && <EditMenuItem id={id} toEdit={toEdit} />}
                    {!!onDelete && !!canDelete && !isPending && (
                        <MenuItem
                            aria-label={intl.formatMessage(messages.delete)}
                            className="bcs-inline-delete"
                            data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE}
                            onClick={this.onDeleteClick}
                        >
                            <IconTrash />
                            <FormattedMessage {...deleteMessages.deleteLabel} />
                        </MenuItem>
                    )}
                </Menu>
            </DropdownMenu>
        ) : (
            <Overlay className="bcs-comment-delete-container">
                <b>{inlineDeleteMessage}</b>
                <div>
                    <PlainButton
                        className="lnk bcs-comment-delete-yes"
                        onClick={this.onDeleteConfirmedHandler}
                        type="button"
                    >
                        <FormattedMessage {...deleteMessages.inlineDeleteConfirm} />
                    </PlainButton>
                    {' / '}
                    <PlainButton className="lnk bcs-comment-delete-no" onClick={this.onDeleteCancel} type="button">
                        <FormattedMessage {...deleteMessages.inlineDeleteCancel} />
                    </PlainButton>
                </div>
            </Overlay>
        );
    }
}

export { CommentMenu as CommentMenuBase };
export default injectIntl(CommentMenu);
