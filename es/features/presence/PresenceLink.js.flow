import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlainButton from '../../components/plain-button';
import { Flyout, Overlay } from '../../components/flyout';

import PresenceCollaboratorsList from './PresenceCollaboratorsList';
import { collaboratorsPropType, flyoutPositionPropType } from './propTypes';

import './Presence.scss';

// eslint-disable-next-line react/prefer-stateless-function
class PresenceLink extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        collaborators: PropTypes.arrayOf(collaboratorsPropType).isRequired,
        /** Addtional attributes for presenceLink container */
        containerAttributes: PropTypes.object,
        onFlyoutScroll: PropTypes.func,
        /** Option to change the orientation of the dropdown. MUST be: bottom-right, bottom-left, bottom-center etc. or in this specific format */
        flyoutPosition: flyoutPositionPropType,
    };

    static defaultProps = {
        className: '',
        flyoutPosition: 'bottom-right',
    };

    render() {
        const { children, className, collaborators, onFlyoutScroll, containerAttributes, flyoutPosition } = this.props;

        if (collaborators.length === 0) {
            return null;
        }

        return (
            <Flyout className={`presence ${className}`} position={flyoutPosition}>
                <div className="presence-link-container" {...containerAttributes}>
                    <PlainButton>{children}</PlainButton>
                </div>
                <Overlay shouldDefaultFocus={false}>
                    <PresenceCollaboratorsList collaborators={collaborators} onScroll={onFlyoutScroll} />
                </Overlay>
            </Flyout>
        );
    }
}

export default PresenceLink;
