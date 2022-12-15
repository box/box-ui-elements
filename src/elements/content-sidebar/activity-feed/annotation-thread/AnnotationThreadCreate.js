// @flow
import React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import API from '../../../../api/APIFactory';
import CommentForm from '../comment-form';
import { getBadUserError } from '../../../../utils/error';

import type { Annotation, Target } from '../../../../common/types/annotations';
import type { BoxItem, SelectorItems, User } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';

import './AnnotationThreadCreate.scss';

type Props = {
    api: API,
    currentUser: User,
    file: BoxItem,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery: (searchStr: string) => void,
    handleCancel: () => void,
    mentionSelectorContacts: SelectorItems<>,
    onAnnotationCreateEnd: (annotation: Object, requestId: string) => void,
    onAnnotationCreateStart: (annotation: Object, requestId: string) => void,
    target: Target,
} & ErrorContextProps;

const AnnotationThreadCreate = ({
    api,
    currentUser,
    file,
    getAvatarUrl,
    getMentionWithQuery,
    handleCancel,
    mentionSelectorContacts,
    onAnnotationCreateEnd,
    onAnnotationCreateStart,
    onError,
    target,
}: Props) => {
    const [isPending, setIsPending] = React.useState(false);

    const handleCreate = (text: string): void => {
        const { id, permissions = {}, file_version = {} } = file;
        setIsPending(true);
        if (!currentUser) {
            throw getBadUserError();
        }

        const requestId = uniqueId('annotation_');

        const successCallback = (annotation: Annotation) => {
            onAnnotationCreateEnd(annotation, requestId);
        };

        const payload = {
            description: { message: text },
            target,
        };

        onAnnotationCreateStart(payload, requestId);

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
