// @flow
import React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import type EventEmitter from 'events';

import API from '../../../../api/APIFactory';
import CommentForm from '../comment-form';
import { getBadUserError } from '../../../../utils/error';
import useAnnotatorEvents from '../../../common/annotator-context/useAnnotatorEvents';

import type { Annotation, Target } from '../../../../common/types/annotations';
import type { BoxItem, SelectorItems, User } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';

import './AnnotationThreadCreate.scss';

type Props = {
    api: API,
    currentUser: User,
    eventEmitter: EventEmitter,
    file: BoxItem,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery: (searchStr: string) => void,
    handleCancel: () => void,
    mentionSelectorContacts: SelectorItems<>,
    onAnnotationCreate: (annotation: Annotation) => void,
    target: Target,
} & ErrorContextProps;

const AnnotationThreadCreate = ({
    api,
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    eventEmitter,
    file,
    handleCancel,
    mentionSelectorContacts,
    onAnnotationCreate,
    onError,
    target,
}: Props) => {
    const [isPending, setIsPending] = React.useState(false);
    const events = useAnnotatorEvents({ eventEmitter });

    const handleCreate = (text: string): void => {
        const { id, permissions = {}, file_version = {} } = file;
        const requestId = uniqueId('annotation_');
        setIsPending(true);
        events.emitAddAnnotationStartEvent({ text }, requestId);

        if (!currentUser) {
            throw getBadUserError();
        }

        const successCallback = (annotation: Annotation) => {
            onAnnotationCreate(annotation);
            events.emitAddAnnotationEndEvent(annotation, requestId);
        };

        const payload = {
            description: { message: text },
            target,
        };

        api.getAnnotationsAPI(false).createAnnotation(
            id,
            file_version.id,
            payload,
            permissions,
            successCallback,
            onError,
        );
    };

    return (
        <div
            data-testid="annotation-create"
            className={classNames('AnnotationThreadCreate', { 'is-pending': isPending })}
        >
            <CommentForm
                className="AnnotationThreadCreate-editor"
                user={currentUser}
                entityId={file.id}
                onSubmit={handleCreate}
                getMentionWithQuery={getMentionWithQuery}
                mentionSelectorContacts={mentionSelectorContacts}
                getAvatarUrl={getAvatarUrl}
                isOpen
                onCancel={handleCancel}
            />
        </div>
    );
};

export default AnnotationThreadCreate;
