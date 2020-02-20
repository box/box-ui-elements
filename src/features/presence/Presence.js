import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import classnames from 'classnames';

import { Flyout, Overlay } from '../../components/flyout';
import Tooltip from '../../components/tooltip';

// GROWTH-382
import Button from '../../components/button';

import { ARROW_DOWN, ENTER, SPACE } from '../../common/keyboard-events';

import PresenceDropdown from './PresenceDropdown';
import PresenceAvatar from './PresenceAvatar';
import { determineInteractionMessage } from './utils/presenceUtils';
import { collaboratorsPropType, flyoutPositionPropType } from './propTypes';

// GROWTH-382
import {
    GROWTH_382_EXPERIMENT_BUCKET,
    GROWTH_382_AUTOFLY_CLASS,
    GROWTH_382_AUTOFLY_CLASS_FIRST_LOAD,
} from './constants';
import messages from './messages';

import './Presence.scss';

class Presence extends Component {
    /* eslint-disable no-underscore-dangle */
    static propTypes = {
        /** Addtional attributes for avatar container */
        avatarAttributes: PropTypes.object,
        className: PropTypes.string,
        collaborators: PropTypes.arrayOf(collaboratorsPropType).isRequired,
        /** Addtional attributes for presence container */
        containerAttributes: PropTypes.object,
        /** Get Link callback */
        getLinkCallback: PropTypes.func,
        /** Invite button callback */
        inviteCallback: PropTypes.func,
        /** Maximum number of avatars to display before showing a +{n} avatar */
        maxDisplayedAvatars: PropTypes.number,
        /** Maximum number of collaborators before displaying a {maxAdditionalCollaboratorsNum}+ avatar */
        maxAdditionalCollaboratorsNum: PropTypes.number,
        /** Callback funtion for avatar mouseEnter, argument: id of user */
        onAvatarMouseEnter: PropTypes.func,
        /** Callback function for avatar mouseLeave */
        onAvatarMouseLeave: PropTypes.func,
        /** Callback funtion for Flyout events, argument: SyntheticEvent */
        onFlyoutClose: PropTypes.func,
        onFlyoutOpen: PropTypes.func,
        onFlyoutScroll: PropTypes.func,
        /** GROWTH-382 bucketing */
        experimentBucket: PropTypes.string,
        /** GROWTH-382 broadcast that the user wants to view stats from the flyout */
        onAccessStatsRequested: PropTypes.func,
        /** GROWTH-382 log that the user wants to view collaborators from the flyout */
        onClickViewCollaborators: PropTypes.func,
        /** Option to change the orientation of the dropdown. MUST be: bottom-right, bottom-left, bottom-center etc. or in this specific format */
        flyoutPosition: flyoutPositionPropType,
        /** Sets the tether constraint to scrollParent for the flyout */
        constrainToScrollParent: PropTypes.bool,
        /** Sets the tether constraint to window for the flyout */
        constrainToWindow: PropTypes.bool,
        /** Closes the flyout when window loses focus */
        closeOnWindowBlur: PropTypes.bool,
        intl: PropTypes.any,
    };

    static defaultProps = {
        className: '',
        maxDisplayedAvatars: 3,
        maxAdditionalCollaboratorsNum: 99,
        experimentBucket: null,
        flyoutPosition: 'bottom-left',
        constrainToScrollParent: true,
        constrainToWindow: false,
        closeOnWindowBlur: false,
    };

    state = {
        activeTooltip: null,
        isDropdownActive: false,
        showActivityPrompt: Boolean(
            this.props.collaborators.length &&
                this.props.onClickViewCollaborators &&
                this.props.experimentBucket === GROWTH_382_EXPERIMENT_BUCKET,
        ),
    };

    saveRefToContainer = el => {
        this.presenceContainerEl = el;
    };

    _showTooltip = id => {
        const { onAvatarMouseEnter } = this.props;
        this.setState({
            activeTooltip: id,
        });
        if (onAvatarMouseEnter) {
            onAvatarMouseEnter(id);
        }
    };

    _hideTooltip = () => {
        const { onAvatarMouseLeave } = this.props;
        this.setState({
            activeTooltip: null,
        });
        if (onAvatarMouseLeave) {
            onAvatarMouseLeave();
        }
    };

    _handleOverlayOpen = event => {
        const { onFlyoutOpen } = this.props;
        this.setState({
            isDropdownActive: true,
        });
        if (onFlyoutOpen) {
            onFlyoutOpen(event);
        }
    };

    _handleOverlayClose = event => {
        const { onFlyoutClose } = this.props;
        this.setState({
            isDropdownActive: false,
        });
        if (onFlyoutClose) {
            onFlyoutClose(event);
        }
    };

    stopPropagationAndPreventDefault = event => {
        event.stopPropagation();
        event.preventDefault();
    };

    openDropDown = () => {
        if (this.presenceContainerEl) {
            this.presenceContainerEl.click();
        }
    };

    handleKeyDown = event => {
        switch (event.key) {
            case ARROW_DOWN:
            case ENTER:
            case SPACE:
                this.openDropDown();
                this.stopPropagationAndPreventDefault(event);
                break;

            default:
                break;
        }
    };

    _renderTimestampMessage = (interactedAt, interactionType, isActive) => {
        const lastActionMessage = determineInteractionMessage(interactionType);
        const { intl } = this.props;
        const timeAgo = intl.formatRelativeTime
            ? intl.formatRelativeTime(interactedAt - Date.now())
            : intl.formatRelative(interactedAt);

        if (lastActionMessage) {
            return (
                <div>
                    <span className="presence-avatar-tooltip-event">
                        {isActive ? (
                            <FormattedMessage {...messages.activeNowText} />
                        ) : (
                            <FormattedMessage
                                {...lastActionMessage}
                                values={{
                                    timeAgo,
                                }}
                            />
                        )}
                    </span>
                </div>
            );
        }
        return null;
    };

    _renderAvatarTooltip = (name, interactedAt, interactionType, isActive) => (
        <div className="presence-avatar-tooltip-container">
            <div>
                <span className="presence-avatar-tooltip-name">{name}</span>
            </div>
            {this._renderTimestampMessage(interactedAt, interactionType, isActive)}
        </div>
    );

    // GROWTH-382 click through the first CTA, spawn the normal Presence dropdown
    _showRecentsFlyout = event => {
        const { onClickViewCollaborators } = this.props;
        onClickViewCollaborators();
        this.stopPropagationAndPreventDefault(event);
        this.setState({ showActivityPrompt: false });
    };

    render() {
        const {
            className,
            collaborators,
            maxDisplayedAvatars,
            maxAdditionalCollaboratorsNum,
            getLinkCallback,
            inviteCallback,
            onFlyoutScroll,
            avatarAttributes,
            containerAttributes,
            flyoutPosition,
            constrainToScrollParent,
            constrainToWindow,
            closeOnWindowBlur,
        } = this.props;

        const { activeTooltip, isDropdownActive } = this.state;
        const presenceCountClassName = classnames('presence-avatar', 'avatar', 'presence-count', {
            'dropdown-active': isDropdownActive,
        });

        // GROWTH-382
        const { experimentBucket, onAccessStatsRequested } = this.props;
        const { showActivityPrompt } = this.state;
        let requestAccessStats = null;

        if (!showActivityPrompt && experimentBucket === GROWTH_382_EXPERIMENT_BUCKET) {
            requestAccessStats = (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a className="presence-dropdown-request-stats" href="#" onClick={onAccessStatsRequested}>
                    <FormattedMessage {...messages.previewPresenceFlyoutAccessStatsLink} />
                </a>
            );
        }

        const overlayClassNames = classnames('presence-dropdown-container', {
            [GROWTH_382_AUTOFLY_CLASS]: experimentBucket && !showActivityPrompt,
            [GROWTH_382_AUTOFLY_CLASS_FIRST_LOAD]: experimentBucket && showActivityPrompt,
        });

        const overlayContent = showActivityPrompt ? (
            <>
                <FormattedMessage {...messages.previewPresenceFlyoutCopy} />
                <Button className="btn-primary" onClick={this._showRecentsFlyout}>
                    <FormattedMessage {...messages.previewPresenceFlyoutActivityCTA} />
                </Button>
            </>
        ) : (
            <PresenceDropdown
                className="presence-dropdown"
                collaborators={collaborators}
                experimentBucket={experimentBucket}
                getLinkCallback={getLinkCallback}
                inviteCallback={inviteCallback}
                onScroll={onFlyoutScroll}
            />
        );
        return (
            <Flyout
                className={`presence ${className}`}
                closeOnWindowBlur={closeOnWindowBlur}
                constrainToScrollParent={constrainToScrollParent}
                constrainToWindow={constrainToWindow}
                isVisibleByDefault={showActivityPrompt}
                onClose={this._handleOverlayClose}
                onOpen={this._handleOverlayOpen}
                position={flyoutPosition}
            >
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                    ref={this.saveRefToContainer}
                    className="presence-avatar-container"
                    onKeyDown={this.handleKeyDown}
                    {...containerAttributes}
                >
                    {collaborators.slice(0, maxDisplayedAvatars).map(collaborator => {
                        const { id, avatarUrl, name, isActive, interactedAt, interactionType } = collaborator;
                        return (
                            <Tooltip
                                key={id}
                                isShown={!isDropdownActive && activeTooltip === id}
                                position="bottom-center"
                                text={this._renderAvatarTooltip(name, interactedAt, interactionType, isActive)}
                            >
                                <PresenceAvatar
                                    avatarUrl={avatarUrl}
                                    id={id}
                                    isActive={isActive}
                                    name={name}
                                    onBlur={this._hideTooltip}
                                    onFocus={this._showTooltip.bind(this, id)}
                                    onMouseEnter={this._showTooltip.bind(this, id)}
                                    onMouseLeave={this._hideTooltip}
                                    {...avatarAttributes}
                                />
                            </Tooltip>
                        );
                    })}

                    {collaborators.length > maxDisplayedAvatars && (
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        <div className={presenceCountClassName} tabIndex="0" {...avatarAttributes}>
                            {collaborators.length - maxDisplayedAvatars > maxAdditionalCollaboratorsNum
                                ? `${maxAdditionalCollaboratorsNum}+`
                                : `+${collaborators.length - maxDisplayedAvatars}`}
                        </div>
                    )}
                </div>
                <Overlay className={overlayClassNames} shouldDefaultFocus={false}>
                    {overlayContent}
                    {requestAccessStats}
                </Overlay>
            </Flyout>
        );
    }
}

export { Presence as PresenceComponent };
export default injectIntl(Presence);
