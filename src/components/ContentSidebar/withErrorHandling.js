/**
 * @flow
 * @file withErrorHandling higher order component
 * @author Box
 */

import * as React from 'react';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import {
    SKILLS_UNAUTHORIZED_REQUEST_ERROR,
    SKILLS_FORBIDDEN_REQUEST_ERROR,
    SKILLS_INVALID_REQUEST_ERROR,
    SKILLS_NOT_FOUND_ERROR,
    SKILLS_INTERNAL_SERVER_ERROR,
    SKILLS_UNKNOWN_ERROR
} from '../../constants';
import type { MaskError, Errors } from '../../flowTypes';

type Props = {
    errorCode?: string
} & Errors;

/**
 * Parses an error code into a internationalized format
 * @param {string} error the API error code
 * @returns {Object} a MaskError-like type which contains FormattedMessages
 */
const getMaskErrorFromErrorCode = (errorCode?: string): MaskError => {
    switch (errorCode) {
        case SKILLS_UNAUTHORIZED_REQUEST_ERROR:
            return {
                errorHeader: <FormattedMessage {...messages.skillDefaultError} />,
                errorSubHeader: <FormattedMessage {...messages.skillUnuthorizedError} />
            };
        case SKILLS_FORBIDDEN_REQUEST_ERROR:
            return {
                errorHeader: <FormattedMessage {...messages.skillDefaultError} />,
                errorSubHeader: <FormattedMessage {...messages.skillForbiddenError} />
            };
        case SKILLS_INVALID_REQUEST_ERROR:
        case SKILLS_NOT_FOUND_ERROR:
        case SKILLS_INTERNAL_SERVER_ERROR:
        case SKILLS_UNKNOWN_ERROR:
        default:
            return {
                errorHeader: <FormattedMessage {...messages.skillDefaultError} />
            };
    }
};

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
    } else if (errorCode) {
        return <ErrorMask {...getMaskErrorFromErrorCode(errorCode)} />;
    }
    return <WrappedComponent {...rest} />;
};

export default withErrorHandling;
