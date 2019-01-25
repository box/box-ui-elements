import PropTypes from 'prop-types';

const BOTTOM_LEFT = 'bottom-left';
const BOTTOM_RIGHT = 'bottom-right';
const BOTTOM_CENTER = 'bottom-center';

const collaboratorsPropType = PropTypes.shape({
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
});

const flyoutPositionPropType = PropTypes.oneOf([BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM_CENTER]);
export { collaboratorsPropType, flyoutPositionPropType };
