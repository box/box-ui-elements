// @flow
import * as React from 'react';
import classNames from 'classnames';
import CommentForm from '../comment-form';
import type { SelectorItems, User } from '../../../../common/types/core';

import './AnnotationThreadCreate.scss';

type Props = {
    currentUser: User,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery: (searchStr: string) => void,
    isPending: boolean,
    mentionSelectorContacts: SelectorItems<>,
    onFormCancel: () => void,
    onFormSubmit: (text: string) => void,
};

const AnnotationThreadCreate = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    isPending,
    mentionSelectorContacts,
    onFormCancel,
    onFormSubmit,
}: Props) => {
    const handleSubmit = ({ text }) => {
        onFormSubmit(text);
    };

    return (
        <div
            className={classNames('AnnotationThreadCreate', { 'is-pending': isPending })}
            data-testid="annotation-create"
        >
            <CommentForm
                className="AnnotationThreadCreate-editor"
                createComment={handleSubmit}
                getAvatarUrl={getAvatarUrl}
                getMentionWithQuery={getMentionWithQuery}
                isOpen
                mentionSelectorContacts={mentionSelectorContacts}
                onCancel={onFormCancel}
                user={currentUser}
            />
        </div>
    );
};

export default AnnotationThreadCreate;
