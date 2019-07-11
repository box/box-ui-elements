// @flow
/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import PropTypes from 'prop-types';
import IntlMessageFormat from 'intl-messageformat';

export const FormattedDate = () => <div />;
FormattedDate.displayName = 'FormattedDate';

export const FormattedTime = () => <div />;
FormattedTime.displayName = 'FormattedTime';

export const FormattedRelative = () => <div />;
FormattedRelative.displayName = 'FormattedRelative';

export const FormattedMessage = () => <div />;
FormattedMessage.displayName = 'FormattedMessage';

export const FormattedNumber = () => <div />;
FormattedNumber.displayName = 'FormattedNumber';

export const IntlProvider = () => <div />;
IntlProvider.displayName = 'IntlProvider';

export const defineMessages = (messages: {
    [key: string]: { defaultMessage: string, description: string, id: string },
}) => messages;
export const intlShape = PropTypes.any;

export const addLocaleData = () => {};

type Props = {
    locale: string,
};

export const injectIntl = (Component: React.ComponentType<any>) => {
    const WrapperComponent = (props: Props) => {
        const injectedProps = {
            ...props,
            intl: {
                formatMessage: (message, values) => {
                    const imf = new IntlMessageFormat(
                        message.defaultMessage || message.message,
                        props.locale || 'en-US',
                    );
                    return imf.format(values);
                },
                formatDate: date => date,
            },
        };
        return <Component {...{ ...injectedProps }} />;
    };
    WrapperComponent.displayName = Component.displayName || Component.name || 'Component';
    return WrapperComponent;
};
