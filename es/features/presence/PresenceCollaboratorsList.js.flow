import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { FormattedMessage, injectIntl } from 'react-intl';

import Button from '../../components/button';
import PresenceCollaborator from './PresenceCollaborator';
import messages from './messages';

import './PresenceCollaboratorsList.scss';

class PresenceCollaboratorsList extends React.Component<Props> {
    static propTypes = {
        collaborators: PropTypes.arrayOf(
            PropTypes.shape({
                /** Url to avatar image. If passed in, component will render the avatar image instead of the initials */
                avatarUrl: PropTypes.string,
                /** Users id */
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                isActive: PropTypes.bool,
                /** Unix timestamp of when the user last interacted with the document */
                interactedAt: PropTypes.number,
                /** The type of interaction by the user */
                interactionType: PropTypes.string,
                /** User's full name */
                name: PropTypes.string.isRequired,
                /** Custom Profile URL */
                profileUrl: PropTypes.string,
            }),
        ).isRequired,
        /* Get Link button callback. also controls visibility of button */
        getLinkCallback: PropTypes.func,
        /* Show Invite button callback. also controls visibility of button */
        inviteCallback: PropTypes.func,
        /* Callback for Dropdown onScroll event */
        onScroll: PropTypes.func,
        /* Intl object */
        intl: PropTypes.any,
    };

    state = {
        isScrollableAbove: false,
        isScrollableBelow: false,
    };

    componentDidMount() {
        const overflow = this.calculateOverflow(this.elDropdownList);
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState(overflow);
    }

    componentDidUpdate() {
        const overflow = this.calculateOverflow(this.elDropdownList);
        /**
         * recalculate overflow when dropdown is visible and new collabs are added
         * This will not go into an infinite loop because we check for changes in local component state
         */
        if (
            overflow.isScrollableAbove !== this.state.isScrollableAbove ||
            overflow.isScrollableBelow !== this.state.isScrollableBelow
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(overflow);
        }
    }

    calculateOverflow = elem => {
        const isScrollableAbove = elem.scrollTop > 0;
        const isScrollableBelow = elem.scrollTop < elem.scrollHeight - elem.clientHeight;
        return {
            isScrollableAbove,
            isScrollableBelow,
        };
    };

    handleScroll = event => {
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
                            <Button onClick={getLinkCallback}>
                                <FormattedMessage {...messages.getLinkButtonText} />
                            </Button>
                        )}
                        {inviteCallback && (
                            <Button onClick={inviteCallback}>
                                <FormattedMessage {...messages.inviteButtonText} />
                            </Button>
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
export default injectIntl(PresenceCollaboratorsList);
