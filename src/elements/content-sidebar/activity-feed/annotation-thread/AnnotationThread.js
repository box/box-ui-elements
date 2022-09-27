/**
 * @flow
 * @file Annotation Thread Container
 * @author Box
 */

import React from 'react';
import classNames from 'classnames';
import { IntlProvider } from 'react-intl';
import AnnotationThreadContent from './AnnotationThreadContent';
import API from '../../../../api/APIFactory';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';

import type APICache from '../../../../utils/Cache';
import type { BoxItemPermission, StringMap, Token } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';

import './AnnotationThread.scss';

type Props = {
    annotationId?: string,
    apiHost?: string,
    cache?: APICache,
    className: string,
    clientName: string,
    fileId: string,
    filePermissions: BoxItemPermission,
    language?: string,
    messages?: StringMap,
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
    onError,
    token,
}: Props) => {
    if (!annotationId) {
        return null;
    }

    const api = new API({
        apiHost,
        cache,
        clientName,
        language,
        token,
    });

    return (
        <div className={classNames('AnnotationThread', className)} data-testid="annotation-thread">
            <IntlProvider locale={language} messages={messages}>
                <AnnotationThreadContent
                    api={api}
                    annotationId={annotationId}
                    fileId={fileId}
                    filePermissions={filePermissions}
                    onError={onError}
                />
            </IntlProvider>
        </div>
    );
};

export default AnnotationThread;
