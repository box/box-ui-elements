// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import type { collaboratorType } from '../unified-share-modal/flowTypes';

import CollaboratorAvatarItem from './CollaboratorAvatarItem';
import PlainButton from '../../components/plain-button';
import messages from './messages';

import './CollaboratorAvatars.scss';

const MAX_ADDITIONAL_COLLABORATOR_NUM_CAP = 99;

type Props = {
    collaborators: Array<collaboratorType>,
    containerAttributes: Object,
    maxAdditionalCollaboratorsNum: number,
    maxDisplayedUserAvatars: number,
    onClick: Function,
};

class CollaboratorAvatars extends Component<Props> {
    static defaultProps = {
        /** Maximum number of avatars to display before showing a +{n} avatar */
        maxDisplayedUserAvatars: 3,
        /** Maximum number of collaborators before displaying a {maxAdditionalCollaboratorsNum}+ avatar */
        maxAdditionalCollaboratorsNum: MAX_ADDITIONAL_COLLABORATOR_NUM_CAP,
        containerAttributes: {},
    };

    isVisible() {
        return this.props.collaborators.length > 0;
    }

    hasAdditionalCollaborators() {
        const { collaborators, maxDisplayedUserAvatars } = this.props;

        return collaborators.length > maxDisplayedUserAvatars;
    }

    collaboratorsOverMaxCount() {
        const { collaborators, maxDisplayedUserAvatars, maxAdditionalCollaboratorsNum } = this.props;

        const remainingCollabCount = collaborators.length - maxDisplayedUserAvatars;

        return remainingCollabCount > maxAdditionalCollaboratorsNum;
    }

    formatAdditionalCollaboratorCount() {
        const { maxAdditionalCollaboratorsNum, maxDisplayedUserAvatars, collaborators } = this.props;

        return this.collaboratorsOverMaxCount()
            ? `${maxAdditionalCollaboratorsNum}+`
            : `+${collaborators.length - maxDisplayedUserAvatars}`;
    }

    render() {
        const { collaborators, maxDisplayedUserAvatars, containerAttributes, onClick } = this.props;

        return (
            <PlainButton
                className={classNames('collaborator-avatar-container', {
                    'are-avatars-hidden': !this.isVisible(),
                })}
                onClick={onClick}
                {...containerAttributes}
                aria-hidden={this.isVisible() ? 'false' : 'true'}
                type="button"
            >
                <div className="avatars-label">
                    <FormattedMessage {...messages.collaboratorAvatarsLabel} />
                </div>
                <div className="avatars">
                    {this.isVisible() &&
                        collaborators.slice(0, maxDisplayedUserAvatars).map((collaborator, index) => {
                            const { collabID, imageURL, hasCustomAvatar, name } = collaborator;

                            return (
                                <CollaboratorAvatarItem
                                    key={`collab-avatar-${collabID}`}
                                    avatarUrl={imageURL}
                                    hasCustomAvatar={hasCustomAvatar}
                                    id={index}
                                    name={name}
                                />
                            );
                        })}
                </div>
                {this.isVisible() && this.hasAdditionalCollaborators() && (
                    <div className="avatars-count">{this.formatAdditionalCollaboratorCount()}</div>
                )}
            </PlainButton>
        );
    }
}

export default CollaboratorAvatars;
