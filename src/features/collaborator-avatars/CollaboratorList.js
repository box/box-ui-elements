// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { ModalActions } from '../../components/modal';
import Button from '../../components/button';
import PlainButton from '../../components/plain-button';
import { Link } from '../../components/link';
import CollaborationBadge from '../../icons/badges/CollaborationBadge';
import type {
    collaboratorListTrackingType,
    item as ItemType,
    collaboratorType,
} from '../unified-share-modal/flowTypes';

import commonMessages from '../../common/messages';

import CollaboratorListItem from './CollaboratorListItem';
import messages from './messages';
import './CollaboratorList.scss';

const MAX_COLLABORATOR_LIST_SIZE = 90;

type Props = {
    collaborators: Array<collaboratorType>,
    doneButtonProps?: Object,
    item: ItemType,
    maxCollaboratorListSize: number,
    onDoneClick: Function,
    trackingProps: collaboratorListTrackingType,
};

class CollaboratorList extends React.Component<Props> {
    static defaultProps = {
        maxCollaboratorListSize: MAX_COLLABORATOR_LIST_SIZE,
    };

    createCollaboratorPageLink(children: React.Node, trackingProp: ?Object) {
        const { item } = this.props;
        const { type, id } = item;
        const collaboratorsPageLink = `/${type}/${id}/collaborators/`;

        return (
            <Link href={collaboratorsPageLink} rel="noopener" target="_blank" {...trackingProp}>
                {children}
            </Link>
        );
    }

    render() {
        const { collaborators, onDoneClick, maxCollaboratorListSize, trackingProps } = this.props;
        const { usernameProps, emailProps, manageLinkProps, viewAdditionalProps, doneButtonProps } = trackingProps;
        const manageAllBtn = (
            <PlainButton className="manage-all-btn" type="button">
                <FormattedMessage {...messages.manageAllLinkText} />
            </PlainButton>
        );
        const maxListSizeToRender = Math.min(maxCollaboratorListSize, MAX_COLLABORATOR_LIST_SIZE);

        return (
            <div className="usm-collaborator-list">
                <div className="manage-all-btn-container">
                    {this.createCollaboratorPageLink(manageAllBtn, manageLinkProps)}
                </div>
                <ul className="be collaborator-list">
                    {collaborators.slice(0, maxListSizeToRender).map((collaborator, index) => {
                        const { collabID, type } = collaborator;
                        return (
                            <CollaboratorListItem
                                key={`${collabID}-${type}`}
                                collaborator={collaborator}
                                index={index}
                                trackingProps={{
                                    usernameProps,
                                    emailProps,
                                }}
                            />
                        );
                    })}
                    {collaborators.length > maxListSizeToRender && (
                        <li className="collaborator-list-item more">
                            <div>
                                <CollaborationBadge height={32} width={32} />
                            </div>
                            <div>
                                {this.createCollaboratorPageLink(
                                    <FormattedMessage {...messages.viewAdditionalPeopleText} />,
                                    viewAdditionalProps,
                                )}
                            </div>
                        </li>
                    )}
                </ul>
                <ModalActions>
                    <Button className="btn-done" onClick={onDoneClick} {...doneButtonProps}>
                        <FormattedMessage {...commonMessages.done} />
                    </Button>
                </ModalActions>
            </div>
        );
    }
}

export default CollaboratorList;
