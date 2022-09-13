/**
 * @flow
 * @file Annotation Thread Container
 * @author Box
 */

import React from 'react';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import { IntlProvider } from 'react-intl';
import AnnotationThreadContent from './AnnotationThreadContent';
import AnnotationThreadCreate from './AnnotationThreadCreate';
import API from '../../../../api/APIFactory';
import { DEFAULT_COLLAB_DEBOUNCE, DEFAULT_HOSTNAME_API } from '../../../../constants';

import type APICache from '../../../../utils/Cache';
import type { BoxItem, SelectorItems, StringMap, Token, User } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';
import type { Target } from '../../../../common/types/annotations';

import './AnnotationThread.scss';

type Props = {
    annotationId?: string,
    apiHost?: string,
    cache?: APICache,
    className: string,
    clientName: string,
    currentUser: User,
    file: BoxItem,
    handleCancel: Function,
    language?: string,
    messages?: StringMap,
    onAnnotationCreate: Function,
    target: Target,
    token: Token,
} & ErrorContextProps;

const AnnotationThread = ({
    annotationId,
    apiHost = DEFAULT_HOSTNAME_API,
    cache,
    className = '',
    clientName,
    currentUser,
    file,
    handleCancel,
    language,
    messages,
    onAnnotationCreate,
    onError,
    target,
    token,
}: Props) => {
    const api = new API({
        apiHost,
        cache,
        clientName,
        language,
        token,
    });

    const [mentionSelectorContacts, setMentionSelectorContacts] = React.useState([]);

    const getAvatarUrl = async (userId: string): Promise<?string> =>
        api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, file.id);

    const getMentionContactsSuccessCallback = (collaborators: { entries: SelectorItems<> }): void => {
        setMentionSelectorContacts(collaborators.entries);
    };

    const getMentionWithQuery = debounce(searchStr => {
        api.getFileCollaboratorsAPI(false).getCollaboratorsWithQuery(
            file.id,
            getMentionContactsSuccessCallback,
            onError,
            searchStr,
        );
    }, DEFAULT_COLLAB_DEBOUNCE);

    return (
        <div className={classNames('AnnotationThread', className)} data-testid="annotation-thread">
            <IntlProvider locale={language} messages={messages}>
                {!annotationId ? (
                    <AnnotationThreadCreate
                        api={api}
                        currentUser={currentUser}
                        file={file}
                        getAvatarUrl={getAvatarUrl}
                        getMentionWithQuery={getMentionWithQuery}
                        handleCancel={handleCancel}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onAnnotationCreate={onAnnotationCreate}
                        onError={onError}
                        target={target}
                    />
                ) : (
                    <AnnotationThreadContent
                        api={api}
                        annotationId={annotationId}
                        currentUser={currentUser}
                        file={file}
                        getAvatarUrl={getAvatarUrl}
                        getMentionWithQuery={getMentionWithQuery}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onError={onError}
                    />
                )}
            </IntlProvider>
        </div>
    );
};

export default AnnotationThread;
