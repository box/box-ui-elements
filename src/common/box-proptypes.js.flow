import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const UserPropType = PropTypes.shape({
    avatarUrl: PropTypes.string,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
});

const SelectorItemPropType = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string.isRequired,
});

const ActionItemErrorPropType = PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    action: PropTypes.shape({
        text: PropTypes.string.isRequired,
        onAction: PropTypes.func.isRequired,
    }),
});

const SelectorItemsPropType = PropTypes.arrayOf(SelectorItemPropType);

const OptionPropType = {
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const OptionsPropType = PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape(OptionPropType)),
    ImmutablePropTypes.listOf(ImmutablePropTypes.recordOf(OptionPropType)),
]).isRequired;

export { ActionItemErrorPropType, SelectorItemsPropType, SelectorItemPropType, UserPropType, OptionsPropType };
