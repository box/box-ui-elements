import * as React from 'react';
import '../../modal.scss';
export declare const basic: {
    play: ({ canvasElement }: {
        canvasElement: any;
    }) => Promise<void>;
    render: (args: any) => React.JSX.Element;
};
declare const _default: {
    title: string;
    component: ({ apiHost, appElement, appHost, cache, canDownload, contentPreviewProps, currentCollection, isOpen, item, onCancel, onDownload, onPreview, parentElement, previewLibraryVersion, requestInterceptor, responseInterceptor, sharedLink, sharedLinkPassword, staticHost, staticPath, token, }: import("../../preview-dialog/PreviewDialog").PreviewDialogProps) => React.JSX.Element;
    args: {
        token: string;
    };
};
export default _default;
