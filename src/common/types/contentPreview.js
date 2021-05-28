// @flow
import * as React from 'react';

import ContentPreview from '../../elements/content-preview';

export type ContentPreviewProps = $Diff<
    React.ElementConfig<typeof ContentPreview>,
    {
        apiHost: any,
        cache: any,
        className: any,
        componentRef: any,
        fileId: any,
        onError: any,
        onLoad: any,
        sharedLink: any,
        token: any,
    },
>;
