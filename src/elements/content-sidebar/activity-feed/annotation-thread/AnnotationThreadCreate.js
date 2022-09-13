// @flow
import React from 'react';
import classNames from 'classnames';
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
    handleCancel: Function,
    mentionSelectorContacts: SelectorItems<>,
    onAnnotationCreate: (annotation: Annotation) => void,
    target: Target,
} & ErrorContextProps;

const AnnotationThreadCreate = ({
    api,
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    file,
    handleCancel,
    mentionSelectorContacts,
    onAnnotationCreate,
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

        const successCallback = (annotation: Annotation) => {
            onAnnotationCreate(annotation);
            // will emit create event
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
            className={classNames('AnnotationThreadCreate', { 'AnnotationThreadCreate-is-pending': isPending })}
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
