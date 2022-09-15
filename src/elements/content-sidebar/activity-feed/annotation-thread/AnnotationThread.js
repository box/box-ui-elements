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
    cache,
    className = '',
    clientName,
    fileId,
    filePermissions,
    language,
    messages,
    token,
}: Props) => {
    const api = new API({
        DEFAULT_HOSTNAME_API,
        cache,
        clientName,
        language,
        token,
    });

    if (!annotationId) {
        return null;
    }

    return (
        <div className={classNames('AnnotationThread', className)} data-testid="annotation-thread">
            <IntlProvider locale={language} messages={messages}>
                <AnnotationThreadContent
                    api={api}
                    annotationId={annotationId}
                    fileId={fileId}
                    filePermissions={filePermissions}
                />
            </IntlProvider>
        </div>
    );
};

export default AnnotationThread;
