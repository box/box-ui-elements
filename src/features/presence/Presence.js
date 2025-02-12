import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import messages from './messages';
import PresenceAvatarList from './PresenceAvatarList';
import PresenceCollaboratorsList from './PresenceCollaboratorsList';
import { ARROW_DOWN, ENTER, SPACE } from '../../common/keyboard-events';
import { collaboratorsPropType, flyoutPositionPropType } from './propTypes';
import { Flyout, Overlay } from '../../components/flyout';
import {
    GROWTH_382_EXPERIMENT_BUCKET,
    GROWTH_382_AUTOFLY_CLASS,
    GROWTH_382_AUTOFLY_CLASS_FIRST_LOAD,
} from './constants';
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

    // GROWTH-382 click through the first CTA, spawn the normal Presence dropdown
    _showRecentsFlyout = event => {
        const { onClickViewCollaborators } = this.props;
        onClickViewCollaborators();
        this.stopPropagationAndPreventDefault(event);
        this.setState({ showActivityPrompt: false });
    };

    render() {
        const {
            avatarAttributes,
            className,
            closeOnWindowBlur,
            collaborators,
            constrainToScrollParent,
            constrainToWindow,
            containerAttributes,
            flyoutPosition,
            getLinkCallback,
            intl,
            inviteCallback,
            maxAdditionalCollaboratorsNum,
            maxDisplayedAvatars,
            onAvatarMouseEnter,
            onAvatarMouseLeave,
            onFlyoutScroll,
        } = this.props;

        const { isDropdownActive } = this.state;

        // GROWTH-382
        const { experimentBucket, onAccessStatsRequested } = this.props;
        const { showActivityPrompt } = this.state;
        let requestAccessStats = null;

        if (!showActivityPrompt && experimentBucket === GROWTH_382_EXPERIMENT_BUCKET) {
            requestAccessStats = (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a className="presence-overlay-request-stats" href="#" onClick={onAccessStatsRequested}>
                    <FormattedMessage {...messages.previewPresenceFlyoutAccessStatsLink} />
                </a>
            );
        }

        const overlayClassNames = classNames('presence-overlay', {
            [GROWTH_382_AUTOFLY_CLASS]: experimentBucket && !showActivityPrompt,
            [GROWTH_382_AUTOFLY_CLASS_FIRST_LOAD]: experimentBucket && showActivityPrompt,
        });

        const overlayContent = showActivityPrompt ? (
            <>
                <FormattedMessage {...messages.previewPresenceFlyoutCopy} />
                <ButtonAdapter isSelected onClick={this._showRecentsFlyout} type={ButtonType.BUTTON}>
                    <FormattedMessage {...messages.previewPresenceFlyoutActivityCTA} />
                </ButtonAdapter>
            </>
        ) : (
            <PresenceCollaboratorsList
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
                <PresenceAvatarList
                    ref={this.saveRefToContainer}
                    aria-label={intl.formatMessage(messages.toggleButtonLabel)}
                    avatarAttributes={avatarAttributes}
                    className={classNames('presence-avatar-container', { 'dropdown-active': isDropdownActive })}
                    collaborators={collaborators}
                    hideTooltips={isDropdownActive}
                    maxAdditionalCollaborators={maxAdditionalCollaboratorsNum}
                    maxDisplayedAvatars={maxDisplayedAvatars}
                    onAvatarMouseEnter={onAvatarMouseEnter}
                    onAvatarMouseLeave={onAvatarMouseLeave}
                    onKeyDown={this.handleKeyDown}
                    {...containerAttributes}
                />
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
