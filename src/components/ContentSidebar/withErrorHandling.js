/**
 * @flow
 * @file withErrorHandling higher order component
 * @author Box
 */

import * as React from 'react';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';

import type { MaskError, InlineError as InlineErrorType } from '../../flowTypes';

type Props = {
    maskError?: MaskError,
    inlineError?: InlineErrorType
};

const withErrorHandling = (WrappedComponent: React.ComponentType<any>) => ({
    maskError,
    inlineError,
    ...rest
}: Props) => {
    const getWrappedComponent = () => <WrappedComponent {...rest} />;

    if (inlineError) {
        return (
            <React.Fragment>
                <InlineError title={inlineError.title}>{inlineError.content}</InlineError>
                {getWrappedComponent()}
            </React.Fragment>
        );
    } else if (maskError) {
        return <ErrorMask {...maskError} />;
    }

    return getWrappedComponent();
};

export default withErrorHandling;
