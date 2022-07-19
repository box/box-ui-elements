import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Media from '../media/Media';
import { MenuItem } from '../menu';
import Checkmark16 from '../../icon/fill/Checkmark16';
import Pencil16 from '../../icon/fill/Pencil16';
import Trash16 from '../../icon/fill/Trash16';
import messages from './messages';

import './CommentActionDropdown.scss';

export interface CommentActionDropdownProps {
    commentId: string;
    onDelete?: (commentId: string) => void;
    onEdit?: (commentId: string) => void;
    onResolve?: (commentId: string) => void;
}

function CommentActionDropdown({ commentId, onDelete, onEdit, onResolve }: CommentActionDropdownProps) {
    if (!onDelete && !onEdit && !onResolve) {
        return null;
    }

    return (
        <Media.Menu data-testid="CommentActionDropdown" className="bdl-CommentActionDropdown">
            {onResolve && (
                <MenuItem onClick={() => onResolve(commentId)}>
                    <Checkmark16 />
                    <FormattedMessage {...messages.commentResolveMenuItem} />
                </MenuItem>
            )}
            {onEdit && (
                <MenuItem onClick={() => onEdit(commentId)}>
                    <Pencil16 />
                    <FormattedMessage {...messages.commentEditMenuItem} />
                </MenuItem>
            )}
            {onDelete && (
                <MenuItem onClick={() => onDelete(commentId)}>
                    <Trash16 />
                    <FormattedMessage {...messages.commentDeleteMenuItem} />
                </MenuItem>
            )}
        </Media.Menu>
    );
}

export default CommentActionDropdown;
