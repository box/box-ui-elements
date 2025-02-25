import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ErrorMask from '../../../components/error-mask/ErrorMask';
import messages from '../messages';
import './DefaultError.scss';

export interface DefaultErrorProps {
    error?: Error;
}

const DefaultError = (): JSX.Element => (
    <section className="be-default-error">
        <ErrorMask
            errorHeader={<FormattedMessage {...messages.defaultErrorMaskHeaderMessage} />}
            errorSubHeader={<FormattedMessage {...messages.defaultErrorMaskSubHeaderMessage} />}
        />
    </section>
);

export default DefaultError;
