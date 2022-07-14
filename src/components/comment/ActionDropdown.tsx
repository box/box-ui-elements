import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Media from '../media/Media';
import { MenuItem } from '../menu';
import Checkmark16 from '../../icon/fill/Checkmark16';
import Pencil16 from '../../icon/fill/Pencil16';
import Trash16 from '../../icon/fill/Trash16';
import messages from './messages';

import './ActionDropdown.scss';

export interface ActionDropdownProps {
    commentId: string;
    onDelete?: (commentId: string) => void;
    onEdit?: (commentId: string) => void;
    onResolve?: (commentId: string) => void;
}

function ActionDropdown({ commentId, onDelete, onEdit, onResolve }: ActionDropdownProps) {
    if (!onDelete && !onEdit && !onResolve) {
        return null;
    }

    return (
        <Media.Menu data-testid="Comment-actionDropdown" className="bdl-Comment-actionDropdown">
            {onResolve && (
                <MenuItem data-testid="ActionDropdownItem-resolve" onClick={() => onResolve(commentId)}>
                    <Checkmark16 />
                    <FormattedMessage {...messages.commentResolveMenuItem} />
                </MenuItem>
            )}
            {onEdit && (
                <MenuItem data-testid="ActionDropdownItem-edit" onClick={() => onEdit(commentId)}>
                    <Pencil16 />
                    <FormattedMessage {...messages.commentEditMenuItem} />
                </MenuItem>
            )}
            {onDelete && (
                <MenuItem data-testid="ActionDropdownItem-delete" onClick={() => onDelete(commentId)}>
                    <Trash16 />
                    <FormattedMessage {...messages.commentDeleteMenuItem} />
                </MenuItem>
            )}
        </Media.Menu>
    );
}

export default ActionDropdown;
