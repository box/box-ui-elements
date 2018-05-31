/**
 * @flow
 * @file withErrorHandling higher order component
 * @author Box
 */

import * as React from 'react';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import { FormattedMessage } from 'react-intl';

type Props = {
    errorCode?: string
} & Errors;

const withErrorHandling = (WrappedComponent: React.ComponentType<any>) => ({
    maskError,
    inlineError,
    errorCode,
    ...rest
}: Props) => {
    if (maskError) {
        return (
            <ErrorMask
                errorHeader={<FormattedMessage {...maskError.errorHeader} />}
                errorSubHeader={
                    maskError.errorSubHeader ? <FormattedMessage {...maskError.errorSubHeader} /> : undefined
                }
            />
        );
    } else if (inlineError) {
        return (
            <React.Fragment>
                <InlineError title={<FormattedMessage {...inlineError.title} />}>
                    {<FormattedMessage {...inlineError.content} />}
                </InlineError>
                <WrappedComponent {...rest} />
            </React.Fragment>
        );
    }
    return <WrappedComponent {...rest} />;
};

export default withErrorHandling;
