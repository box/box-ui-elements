import * as React from 'react';
import classNames from 'classnames';
import Avatar from '../avatar';
import Media from '../media/Media';
import Checkmark16 from '../../icon/fill/Checkmark16';
import Pencil16 from '../../icon/fill/Pencil16';
import Trash16 from '../../icon/fill/Trash16';
import ActionDropdown, { ActionDropdownItem } from './ActionDropdown';

import './Comment.scss';

export enum CommentType {
    COMMENT = 'comment',
    ANNOTATION = 'annotation',
}

export interface CommentMention {
    userName: string;
    name: string;
    profileUrl: string;
}

export interface CommentProps {
    className?: string;
    content: string;
    date: Date;
    edited?: boolean;
    id: string;
    mentions?: CommentMention[];
    resolved?: boolean;
    type: CommentType;
    userCanDelete?: boolean;
    userCanEdit?: boolean;
    userCanResolve?: boolean;
    userId: string;
    userName: string;
}

function Comment({ className }: CommentProps) {
    const actions: ActionDropdownItem[] = [
        {
            icon: <Checkmark16 />,
            text: 'Resolve',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('resolve');
            },
        },
        {
            icon: <Pencil16 />,
            text: 'Modify',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('modify');
            },
        },
        {
            icon: <Trash16 />,
            text: 'Delete',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('delete');
            },
        },
    ];

    return (
        <Media className={classNames('bdl-ThreadedComment', className)}>
            <Media.Figure>
                <Avatar size="large" />
            </Media.Figure>
            <Media.Body>
                <ActionDropdown items={actions} />
                <div className="bdl-ThreadedComment-author">John Doe</div>
                <div>Today at 9:42 AM</div>
            </Media.Body>
        </Media>
    );
}

export default Comment;
