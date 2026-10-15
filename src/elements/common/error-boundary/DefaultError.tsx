import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ErrorMask from '../../../components/error-mask/ErrorMask';
import messages from '../messages';
import './DefaultError.scss';

export interface ErrorComponentProps {
    error?: Error;
}

const DefaultError = () => (
    <section className="be-default-error">
        <ErrorMask
            errorHeader={<FormattedMessage {...messages.defaultErrorMaskHeaderMessage} />}
            errorSubHeader={<FormattedMessage {...messages.defaultErrorMaskSubHeaderMessage} />}
        />
    </section>
);

export default DefaultError;
