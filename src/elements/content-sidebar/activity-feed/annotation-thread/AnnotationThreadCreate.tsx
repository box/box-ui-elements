import * as React from 'react';
import classNames from 'classnames';
import CommentForm from '../comment-form';
import { SelectorItems, User } from '../../../../common/types/core';

import './AnnotationThreadCreate.scss';

interface AnnotationThreadCreateProps {
    currentUser: User;
    getAvatarUrl: (userId: string) => Promise<string | null>;
    getMentionWithQuery: (searchStr: string) => void;
    isPending: boolean;
    mentionSelectorContacts: SelectorItems[];
    onFormCancel: () => void;
    onFormSubmit: (text: string) => void;
}

const AnnotationThreadCreate = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    isPending,
    mentionSelectorContacts,
    onFormCancel,
    onFormSubmit,
}: AnnotationThreadCreateProps) => {
    const handleSubmit = ({ text }: { text: string }) => {
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
