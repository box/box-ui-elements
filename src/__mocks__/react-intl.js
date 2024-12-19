/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import PropTypes from 'prop-types';
import IntlMessageFormat from 'intl-messageformat';
import IntlRelativeTimeFormat from '@formatjs/intl-relativetimeformat';

export const FormattedDate = () => <div />;
FormattedDate.displayName = 'FormattedDate';

export const FormattedTime = () => <div />;
FormattedTime.displayName = 'FormattedTime';

export const FormattedRelativeTime = () => <div />;
FormattedRelativeTime.displayName = 'FormattedRelativeTime';

export const FormattedMessage = () => <div />;
FormattedMessage.displayName = 'FormattedMessage';

export const FormattedNumber = () => <div />;
FormattedNumber.displayName = 'FormattedNumber';

export const IntlProvider = () => <div />;
IntlProvider.displayName = 'IntlProvider';

export const defineMessages = messages => messages;
export const intlShape = PropTypes.any;

export const createIntl = ({ locale = 'en' }) => ({
    formatMessage: (message, values) => {
        const imf = new IntlMessageFormat(message.defaultMessage || message.message, locale);
        return imf.format(values);
    },
    formatDate: date => date,
    formatRelativeTime: (value, unit = 'second', options = {}) => {
        // eslint-disable-next-line
        IntlRelativeTimeFormat.__addLocaleData(
            // eslint-disable-next-line
            require(`@formatjs/intl-relativetimeformat/dist/locale-data/${locale}.json`),
        );
        const rtf = new IntlRelativeTimeFormat(locale, options);
        return rtf.format(value, unit);
    },
    formatNumber: (number, options = {}) => {
        const inf = new Intl.NumberFormat(locale, options);
        return inf.format(number);
    },
});

export const injectIntl = Component => {
    const WrapperComponent = props => {
        const injectedProps = {
            ...props,
            intl: createIntl({ locale: props.locale }), // eslint-disable-line react/prop-types
        };
        return <Component {...{ ...injectedProps }} />;
    };
    WrapperComponent.displayName = Component.displayName || Component.name || 'Component';
    return WrapperComponent;
};

export const useIntl = () => ({
    formatMessage: (message, values) => {
        const imf = new IntlMessageFormat(message.defaultMessage || message.message, 'en');
        return imf.format(values);
    },
});
