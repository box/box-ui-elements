import React from 'react';
import PropTypes from 'prop-types';
import intl from './lib-intl-mock';

export const FormattedDate = () => <div />;
FormattedDate.displayName = 'FormattedDate';

export const FormattedTime = () => <div />;
FormattedTime.displayName = 'FormattedTime';

export const FormattedMessage = () => <div />;
FormattedMessage.displayName = 'FormattedMessage';

export const IntlProvider = () => <div />;
IntlProvider.displayName = 'IntlProvider';

export const defineMessages = (messages) => messages;

export const intlShape = PropTypes.any;

export const addLocaleData = () => {};

export const injectIntl = (Component) => {
    const WrapperComponent = (props) => {
        const injectedProps = { ...props, intl };
        return (<Component {...{ ...injectedProps }} />);
    };
    WrapperComponent.displayName = Component.displayName || Component.name || 'Component';
    return WrapperComponent;
};
