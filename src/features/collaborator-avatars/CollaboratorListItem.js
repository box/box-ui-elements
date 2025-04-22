// @flow
import * as React from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { Link } from '../../components/link';
import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import IconClose from '../../icon/fill/X16';
import { COLLAB_GROUP_TYPE, COLLAB_PENDING_TYPE } from './constants';
import messages from './messages';
import commonMessages from '../../elements/common/messages';
import CollaboratorAvatarItem from './CollaboratorAvatarItem';
import type { collaboratorType } from '../unified-share-modal/flowTypes';
import './CollaboratorListItem.scss';

type Props = {
    collaborator: Object,
    index: number,
    canRemoveCollaborators?: boolean,
    onRemoveCollaborator?: (collaborator: collaboratorType) => void,
    trackingProps: { emailProps: ?Object, usernameProps: ?Object },
};

const CollaboratorListItem = (props: Props) => {
    const { index, trackingProps, canRemoveCollaborators = false, onRemoveCollaborator } = props;
    const { usernameProps, emailProps } = trackingProps;
    const {
        email,
        expiration,
        hasCustomAvatar,
        name,
        type,
        imageURL,
        isExternalCollab,
        profileURL,
        translatedRole,
        userID,
        isRemovable = false,
    } = props.collaborator;

    const userOrGroupNameContent =
        type !== COLLAB_GROUP_TYPE ? (
            <div className={classnames('name', type)}>
                <Link href={profileURL || `/profile/${userID}`} rel="noopener" target="_blank" {...usernameProps}>
                    {name}
                </Link>
            </div>
        ) : (
            <div className={classnames('name', type)}>{name}</div>
        );

    const emailContent =
        type !== COLLAB_GROUP_TYPE && email ? (
            <div className="email">
                <Link href={`mailto:${email}`} {...emailProps}>
                    {email}
                </Link>
            </div>
        ) : null;

    const roleNodeContent = (
        <div className="role">
            {type === COLLAB_PENDING_TYPE ? <FormattedMessage {...messages.pendingCollabText} /> : translatedRole}
        </div>
    );

    return (
        <li>
            <div className="collaborator-list-item">
                <div className="bdl-CollaboratorListItem-user user">
                    <div className="info">
                        {userOrGroupNameContent}
                        {emailContent}
                    </div>
                    <CollaboratorAvatarItem
                        allowBadging
                        avatarUrl={imageURL}
                        email={email}
                        expiration={expiration}
                        hasCustomAvatar={hasCustomAvatar}
                        id={index}
                        isExternalCollab={isExternalCollab}
                        name={name}
                    />
                </div>
                {canRemoveCollaborators ? (
                    <div className="user-actions">
                        {roleNodeContent}
                        {isRemovable && (
                            <Tooltip isTabbable={false} text={<FormattedMessage {...commonMessages.remove} />}>
                                <PlainButton
                                    className="remove-button"
                                    onClick={() => onRemoveCollaborator?.(props.collaborator)}
                                    type="button"
                                >
                                    <IconClose color="##6f6f6f" height={16} width={16} />
                                </PlainButton>
                            </Tooltip>
                        )}
                    </div>
                ) : (
                    roleNodeContent
                )}
            </div>
        </li>
    );
};

export default CollaboratorListItem;
