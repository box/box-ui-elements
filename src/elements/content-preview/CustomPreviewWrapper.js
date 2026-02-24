// @flow
import * as React from 'react';
import ErrorBoundary from '../common/error-boundary';
import { ORIGIN_CONTENT_PREVIEW } from '../../constants';
import type { Token, BoxItem } from '../../common/types/core';
import type { ErrorType } from '../common/flowTypes';
import type { ElementsXhrError } from '../../common/types/api';
import type { LoggerProps } from '../../common/types/logging';

type CustomPreviewOnError = (error: Error | ErrorType | ElementsXhrError) => void;
type CustomPreviewOnLoad = (data: Object) => void;

type Props = {
    CustomPreview: React.ComponentType<any>,
    apiHost: string,
    file: BoxItem,
    fileId: string,
    logger?: LoggerProps,
    onPreviewError: (errorData: { error: ErrorType }) => void,
    onPreviewLoad: CustomPreviewOnLoad,
    token: Token,
};

/**
 * Wrapper component for custom preview content.
 * Handles prop validation, error transformation, and error boundary wrapping.
 */
function CustomPreviewWrapper({
    CustomPreview,
    apiHost,
    file,
    fileId,
    logger,
    onPreviewError,
    onPreviewLoad,
    token,
}: Props): React.Node {
    // Validate required props
    if (!fileId || !token || !apiHost) {
        const missingProps = [];
        if (!fileId) missingProps.push('fileId');
        if (!token) missingProps.push('token');
        if (!apiHost) missingProps.push('apiHost');

        const validationError = new Error(`CustomPreview: Missing required props: ${missingProps.join(', ')}`);
        const logError = logger?.logError;
        if (logError) {
            logError(validationError, 'CUSTOM_PREVIEW_INVALID_PROPS', {
                missingProps,
                fileId,
            });
        }
        onPreviewError({
            error: ({
                code: 'CUSTOM_PREVIEW_INVALID_PROPS',
                message: validationError.message,
            }: any),
        });
        return null;
    }

    // Create wrapper for onError to transform to PreviewLibraryError signature
    const handleCustomError: CustomPreviewOnError = (customError: ErrorType | ElementsXhrError) => {
        // Extract error code
        const errorCodeValue =
            customError && typeof customError === 'object' && 'code' in customError
                ? customError.code
                : 'error_custom_preview';

        // Extract error message
        let errorMessageValue: string;
        if (customError instanceof Error) {
            errorMessageValue = customError.message;
        } else if (customError && typeof customError === 'object' && 'message' in customError) {
            errorMessageValue = customError.message || 'Unknown error';
        } else {
            errorMessageValue = String(customError);
        }

        const errorObj: ErrorType = {
            code: errorCodeValue,
            message: errorMessageValue,
        };
        onPreviewError({ error: errorObj });
    };

    // Error boundary handler for render errors
    const handleRenderError = (elementsError: { code: string, message: string }) => {
        const logError = logger?.logError;
        if (logError) {
            logError(new Error(elementsError.message), 'CUSTOM_PREVIEW_RENDER_ERROR', {
                fileId,
                fileName: file.name,
                errorCode: elementsError.code,
            });
        }
    };

    return (
        <ErrorBoundary errorOrigin={ORIGIN_CONTENT_PREVIEW} onError={handleRenderError}>
            <CustomPreview
                fileId={fileId}
                token={token}
                apiHost={apiHost}
                file={file}
                onError={handleCustomError}
                onLoad={onPreviewLoad}
            />
        </ErrorBoundary>
    );
}

export default CustomPreviewWrapper;
