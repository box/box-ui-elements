import * as React from 'react';
import classnames from 'classnames';
import { FormattedMessage, type IntlShape } from 'react-intl';
import throttle from 'lodash/throttle';

import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import PresenceCollaborator from './PresenceCollaborator';
import messages from './messages';

import './PresenceCollaboratorsList.scss';

interface Collaborator {
    /** Url to avatar image. If passed in, component will render the avatar image instead of the initials */
    avatarUrl?: string;
    /** Users id */
    id: string | number;
    isActive?: boolean;
    /** Unix timestamp of when the user last interacted with the document */
    interactedAt?: number;
    /** The type of interaction by the user */
    interactionType?: string;
    /** User's full name */
    name: string;
    /** Custom Profile URL */
    profileUrl?: string;
}

interface Props {
    collaborators: Array<Collaborator>;
    /* Get Link button callback. also controls visibility of button */
    getLinkCallback?: () => void;
    /* Show Invite button callback. also controls visibility of button */
    inviteCallback?: () => void;
    /* Callback for Dropdown onScroll event */
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
    /* Intl object */
    intl: IntlShape;
}

interface State {
    isScrollableAbove: boolean;
    isScrollableBelow: boolean;
}

class PresenceCollaboratorsList extends React.Component<Props, State> {
    elDropdownList: HTMLDivElement | null = null;

    state = {
        isScrollableAbove: false,
        isScrollableBelow: false,
    };

    componentDidMount() {
        if (this.elDropdownList) {
            const overflow = this.calculateOverflow(this.elDropdownList);
            this.setState(overflow);
        }
    }

    componentDidUpdate() {
        if (this.elDropdownList) {
            const overflow = this.calculateOverflow(this.elDropdownList);
            if (
                overflow.isScrollableAbove !== this.state.isScrollableAbove ||
                overflow.isScrollableBelow !== this.state.isScrollableBelow
            ) {
                this.setState(overflow);
            }
        }
    }

    calculateOverflow = (elem: HTMLDivElement) => {
        const isScrollableAbove = elem.scrollTop > 0;
        const isScrollableBelow = elem.scrollTop < elem.scrollHeight - elem.clientHeight;
        return {
            isScrollableAbove,
            isScrollableBelow,
        };
    };

    handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { onScroll } = this.props;
        if (this.elDropdownList) {
            this.setState(this.calculateOverflow(this.elDropdownList));
            if (onScroll) {
                onScroll(event);
            }
        }
    };

    throttledHandleScroll = throttle(this.handleScroll, 50, {
        leading: true,
        trailing: true,
    });

    renderTitle = () => (
        <div className="bdl-PresenceCollaboratorsList-title">
            <FormattedMessage {...messages.recentActivity} />
        </div>
    );

    renderActions = () => {
        const { getLinkCallback, inviteCallback } = this.props;

        return (
            (getLinkCallback || inviteCallback) && (
                <div className="bdl-PresenceCollaboratorsList-actions">
                    <div>
                        {getLinkCallback && (
                            <ButtonAdapter onClick={getLinkCallback} type={ButtonType.BUTTON}>
                                <FormattedMessage {...messages.getLinkButtonText} />
                            </ButtonAdapter>
                        )}
                        {inviteCallback && (
                            <ButtonAdapter onClick={inviteCallback} type={ButtonType.BUTTON}>
                                <FormattedMessage {...messages.inviteButtonText} />
                            </ButtonAdapter>
                        )}
                    </div>
                </div>
            )
        );
    };

    render() {
        const { isScrollableAbove, isScrollableBelow } = this.state;
        const { collaborators, getLinkCallback, inviteCallback } = this.props;
        const buttonsPresent = getLinkCallback || inviteCallback;

        const dropdownListClasses = classnames('bdl-PresenceCollaboratorsList-list', {
            'dropshadow-list': !buttonsPresent,
            'dropshadow-list-with-buttons': buttonsPresent,
            'is-scrollable-above': isScrollableAbove,
            'is-scrollable-below': isScrollableBelow,
        });

        const title = this.renderTitle();
        const actions = this.renderActions();

        return (
            <div className="bdl-PresenceCollaboratorsList">
                {title}
                <div
                    ref={list => {
                        this.elDropdownList = list;
                    }}
                    className={dropdownListClasses}
                    onScroll={this.throttledHandleScroll}
                    role="list"
                >
                    {collaborators.map(collaborator => (
                        <PresenceCollaborator collaborator={collaborator} key={collaborator.id} role="listitem" />
                    ))}
                </div>
                {actions}
            </div>
        );
    }
}

export { PresenceCollaboratorsList as PresenceCollaboratorsListComponent };
export default PresenceCollaboratorsList;
