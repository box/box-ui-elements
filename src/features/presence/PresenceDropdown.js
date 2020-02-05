import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import throttle from 'lodash/throttle';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import Button from '../../components/button';
import Link from '../../components/link/LinkBase';

import PresenceAvatar from './PresenceAvatar';
import { determineInteractionMessage } from './utils/presenceUtils';
import messages from './messages';

class PresenceDropdown extends React.Component<Props> {
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
        <div className="presence-dropdown-title">
            <FormattedMessage {...messages.recentActivity} />
        </div>
    );

    renderTimestampMessage = (interactedAt, interactionType) => {
        const lastActionMessage = determineInteractionMessage(interactionType, interactedAt);
        const { intl } = this.props;
        const timeAgo = intl.formatRelativeTime
            ? intl.formatRelativeTime(interactedAt - Date.now())
            : intl.formatRelative(interactedAt);

        if (lastActionMessage) {
            return (
                <FormattedMessage
                    {...lastActionMessage}
                    values={{
                        timeAgo,
                    }}
                />
            );
        }
        return null;
    };

    renderCollabList = () => {
        const { collaborators } = this.props;
        return collaborators.map(collaborator => {
            const { avatarUrl, id, isActive, interactedAt, interactionType, name, profileUrl } = collaborator;

            return (
                <div key={id} className="presence-dropdown-item">
                    <PresenceAvatar avatarUrl={avatarUrl} id={id} isActive={isActive} isDropDownAvatar name={name} />
                    <div className="presence-dropdown-item-info-container">
                        <div className="presence-dropdown-item-info-name">
                            {isEmpty(profileUrl) ? (
                                <span>{name}</span>
                            ) : (
                                <Link href={profileUrl} target="_blank">
                                    {name}
                                </Link>
                            )}
                        </div>
                        <div className="presence-dropdown-item-info-time">
                            {isActive ? (
                                <FormattedMessage {...messages.activeNowText} />
                            ) : (
                                this.renderTimestampMessage(interactedAt, interactionType)
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };

    renderActions = () => {
        const { getLinkCallback, inviteCallback } = this.props;

        return (
            (getLinkCallback || inviteCallback) && (
                <div className="presence-dropdown-actions">
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
        const { getLinkCallback, inviteCallback } = this.props;
        const buttonsPresent = getLinkCallback || inviteCallback;

        const dropdownListClasses = classnames('presence-dropdown-list', {
            'dropshadow-list': !buttonsPresent,
            'dropshadow-list-with-buttons': buttonsPresent,
            'is-scrollable-above': isScrollableAbove,
            'is-scrollable-below': isScrollableBelow,
        });

        const title = this.renderTitle();
        const collabList = this.renderCollabList();
        const actions = this.renderActions();

        return (
            <div className="presence-dropdown">
                {title}
                <div
                    ref={list => {
                        this.elDropdownList = list;
                    }}
                    className={dropdownListClasses}
                    onScroll={this.throttledHandleScroll}
                >
                    {collabList}
                </div>
                {actions}
            </div>
        );
    }
}

export { PresenceDropdown as PresenceDropdownComponent };
export default injectIntl(PresenceDropdown);
