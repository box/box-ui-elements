// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import TetherComponent from 'react-tether';
import Avatar from '../Avatar';
import Media from '../../../../components/media';
import { MenuItem } from '../../../../components/menu';
import IconTrash from '../../../../icons/general/IconTrash';
import { bdlGray80 } from '../../../../styles/variables';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityTimestamp from '../common/activity-timestamp';
import DeleteConfirmation from '../common/delete-confirmation';
import UserLink from '../common/user-link';
import { PLACEHOLDER_USER } from '../../../../constants';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import messages from './messages';
import './Comment.scss';

type Props = {
    created_at: string | number,
    created_by: User,
    error?: ActionItemError,
    getAvatarUrl: GetAvatarUrlCallback,
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    isPending?: boolean,
    modified_at?: string | number,
    onDelete?: Function,
    permissions?: BoxItemPermission,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translations?: Translations,
};

type State = {
    isConfirmingDelete: boolean,
};

class Comment extends React.Component<Props, State> {
    state = {
        isConfirmingDelete: false,
    };

    handleDeleteConfirm = (): void => {
        const { id, onDelete, permissions } = this.props;

        if (onDelete) {
            onDelete({ id, permissions });
        }
    };

    handleDeleteCancel = (): void => {
        this.setState({ isConfirmingDelete: false });
    };

    handleDeleteClick = () => {
        this.setState({ isConfirmingDelete: true });
    };

    render(): React.Node {
        const {
            created_by,
            created_at,
            permissions = {},
            id,
            isPending,
            error,
            tagged_message = '',
            translatedTaggedMessage,
            translations,
            getAvatarUrl,
            getUserProfileUrl,
        } = this.props;
        const { isConfirmingDelete } = this.state;
        const createdAtTimestamp = new Date(created_at).getTime();
        const createdByUser = created_by || PLACEHOLDER_USER;
        const { can_delete: canDelete = false } = permissions;
        const isMenuVisible = canDelete && !isPending;

        return (
            <div className="bcs-Comment">
                {error ? <ActivityError {...error} /> : null}
                <Media
                    className={classNames('bcs-Comment-media', {
                        'bcs-is-pending': isPending || error,
                    })}
                >
                    <Media.Figure>
                        <Avatar getAvatarUrl={getAvatarUrl} user={createdByUser} />
                    </Media.Figure>
                    <Media.Body>
                        {isMenuVisible && (
                            <TetherComponent
                                attachment="top right"
                                className="bcs-Comment-deleteConfirmationModal"
                                constraints={[{ to: 'scrollParent', attachment: 'together' }]}
                                targetAttachment="bottom right"
                            >
                                <Media.Menu isDisabled={isConfirmingDelete} data-testid="comment-actions-menu">
                                    {canDelete && (
                                        <MenuItem
                                            data-resin-target={ACTIVITY_TARGETS.INLINE_DELETE}
                                            data-testid="delete-comment"
                                            onClick={this.handleDeleteClick}
                                        >
                                            <IconTrash color={bdlGray80} />
                                            <FormattedMessage {...messages.commentDeleteMenuItem} />
                                        </MenuItem>
                                    )}
                                </Media.Menu>
                                {isConfirmingDelete && (
                                    <DeleteConfirmation
                                        isOpen={isConfirmingDelete}
                                        message={messages.commentDeletePrompt}
                                        onDeleteCancel={this.handleDeleteCancel}
                                        onDeleteConfirm={this.handleDeleteConfirm}
                                    />
                                )}
                            </TetherComponent>
                        )}
                        <div>
                            <UserLink
                                data-resin-target={ACTIVITY_TARGETS.PROFILE}
                                id={createdByUser.id}
                                name={createdByUser.name}
                                getUserProfileUrl={getUserProfileUrl}
                            />
                        </div>
                        <div>
                            <ActivityTimestamp date={createdAtTimestamp} />
                        </div>
                        <ActivityMessage
                            id={id}
                            tagged_message={tagged_message}
                            translatedTaggedMessage={translatedTaggedMessage}
                            {...translations}
                            translationFailed={error ? true : null}
                            getUserProfileUrl={getUserProfileUrl}
                        />
                    </Media.Body>
                </Media>
            </div>
        );
    }
}

export default Comment;
