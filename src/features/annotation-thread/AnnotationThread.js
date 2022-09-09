/**
 * @flow
 * @file Annotation Thread Container
 * @author Box
 */

import React from 'react';
import AnnotationThreadContent from './AnnotationThreadContent';
import API from '../../api/APIFactory';
import APIContext from '../../elements/common/api-context';
import Internationalize from '../../elements/common/Internationalize';
import { DEFAULT_HOSTNAME_API, ORIGIN_ANNOTATION_THREAD } from '../../constants';
import { withErrorBoundary } from '../../elements/common/error-boundary';

import type APICache from '../../utils/Cache';
import type { BoxItemPermission, StringMap, Token } from '../../common/types/core';
import type { ErrorContextProps } from '../../common/types/api';

import './AnnotationThread.scss';

type Props = {
    annotationId?: string,
    apiHost?: string,
    cache?: APICache,
    className: string,
    clientName: string,
    fileId: string,
    filePermissions: BoxItemPermission,
    isDefaultOpen?: boolean,
    language?: string,
    messages?: StringMap,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    token: Token,
} & ErrorContextProps;

const AnnotationThread = ({
    annotationId,
    apiHost = DEFAULT_HOSTNAME_API,
    cache,
    className = '',
    clientName,
    fileId,
    filePermissions,
    language,
    messages,
    requestInterceptor,
    responseInterceptor,
    token,
}: Props) => {
    const api = new API({
        apiHost,
        cache,
        clientName,
        language,
        requestInterceptor,
        responseInterceptor,
        token,
    });

    if (!annotationId) {
        return null;
    }

    return (
        <Internationalize language={language} messages={messages}>
            <APIContext.Provider value={(api: any)}>
                <div className={`be bat ${className}`}>
                    <AnnotationThreadContent
                        annotationId={annotationId}
                        fileId={fileId}
                        filePermissions={filePermissions}
                    />
                </div>
            </APIContext.Provider>
        </Internationalize>
    );
};

export default withErrorBoundary(ORIGIN_ANNOTATION_THREAD)(AnnotationThread);
