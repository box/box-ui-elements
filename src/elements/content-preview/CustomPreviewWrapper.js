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

/**
 * Props that are automatically injected into ContentPreview children.
 * Import this type to ensure your custom preview component accepts the required props.
 *
 * @example
 * import type { ContentPreviewChildProps } from 'box-ui-elements';
 *
 * const MyCustomPreview = ({ fileId, token, apiHost, file, onError, onLoad }: ContentPreviewChildProps) => {
 *     // Your implementation
 * };
 */
export type ContentPreviewChildProps = {
    fileId: string,
    token: Token,
    apiHost: string,
    file: BoxItem,
    onError: CustomPreviewOnError,
    onLoad: CustomPreviewOnLoad,
};

type Props = {
    children: React.Node,
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
 * Clones the child element and injects props (fileId, token, apiHost, file, onError, onLoad).
 * Wraps children in ErrorBoundary and transforms errors to ContentPreview error format.
 */
function CustomPreviewWrapper({
    children,
    apiHost,
    file,
    fileId,
    logger,
    onPreviewError,
    onPreviewLoad,
    token,
}: Props): React.Node {
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

    // Clone child element and inject props
    const childWithProps = React.cloneElement((children: any), {
        fileId,
        token,
        apiHost,
        file,
        onError: handleCustomError,
        onLoad: onPreviewLoad,
    });

    return (
        <ErrorBoundary errorOrigin={ORIGIN_CONTENT_PREVIEW} onError={handleRenderError}>
            {childWithProps}
        </ErrorBoundary>
    );
}

export default CustomPreviewWrapper;
