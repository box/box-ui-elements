// @flow
import * as React from 'react';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import './DefaultError.scss';

const DefaultError = () => (
    <section className="be-default-error">
        <ErrorMask
            errorHeader={<FormattedMessage {...messages.defaultErrorMaskHeaderMessage} />}
            errorSubHeader={<FormattedMessage {...messages.defaultErrorMaskSubHeaderMessage} />}
        />
    </section>
);

export default DefaultError;
