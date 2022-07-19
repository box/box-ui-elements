import * as React from 'react';
import classNames from 'classnames';
import Avatar from '../avatar';
import Media from '../media/Media';
import CommentActionDropdown from './CommentActionDropdown';

import './Comment.scss';

export enum CommentType {
    COMMENT = 'comment',
    ANNOTATION = 'annotation',
}

export interface CommentMention {
    name: string;
    profileUrl: string;
    userName: string;
}

export interface CommentProps {
    className?: string;
    content: string;
    date: Date;
    edited?: boolean;
    highlighted?: boolean;
    id: string;
    isReply?: boolean;
    mentions?: CommentMention[];
    onDelete?: (commentId: string) => void;
    onEdit?: (commentId: string) => void;
    onResolve?: (commentId: string) => void;
    resolved?: boolean;
    type: CommentType;
    userId: string;
    userName: string;
}

function Comment({ className, content, id, onDelete, onEdit, onResolve, userName }: CommentProps) {
    return (
        <div className={classNames('bdl-Comment', className)}>
            <Media>
                <Media.Figure>
                    <Avatar className="bdl-Comment-avatar" />
                </Media.Figure>
                <Media.Body>
                    <CommentActionDropdown commentId={id} onDelete={onDelete} onEdit={onEdit} onResolve={onResolve} />
                    <div className="bdl-Comment-author">{userName}</div>
                    <div className="bdl-Comment-date">Today at 9:42 AM</div>
                </Media.Body>
            </Media>
            <div className="bdl-Comment-content">{content}</div>
        </div>
    );
}

export default Comment;
