// @flow
import React from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { Link } from '../../components/link';

import { COLLAB_GROUP_TYPE, COLLAB_PENDING_TYPE } from './constants';
import messages from './messages';
import CollaboratorAvatarItem from './CollaboratorAvatarItem';
import './CollaboratorListItem.scss';

type Props = {
    collaborator: Object,
    index: number,
    trackingProps: { emailProps: ?Object, usernameProps: ?Object },
};

const CollaboratorListItem = (props: Props) => {
    const { index, trackingProps } = props;
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
    } = props.collaborator;

    const userOrGroupNameContent =
        type !== COLLAB_GROUP_TYPE ? (
            <div className={classnames('name', type)}>
                <span>{name}</span>
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
                <div className="role">
                    {type === COLLAB_PENDING_TYPE ? (
                        <FormattedMessage {...messages.pendingCollabText} />
                    ) : (
                        translatedRole
                    )}
                </div>
            </div>
        </li>
    );
};

export default CollaboratorListItem;
