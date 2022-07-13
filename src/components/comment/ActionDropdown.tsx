import * as React from 'react';
import Media from '../media/Media';
import { MenuItem } from '../menu';

import './ActionDropdown.scss';

export interface ActionDropdownItem {
    icon?: React.ReactNode;
    onClick: () => void;
    text: string;
}

export interface ActionDropdownProps {
    items: ActionDropdownItem[];
}

function ActionDropdown({ items }: ActionDropdownProps) {
    if (!items.length) {
        return null;
    }

    return (
        <Media.Menu data-testid="ThreadedComment-actionDropdown" className="bdl-ThreadedComment-actionDropdown">
            {items.map(({ text, onClick, icon }) => (
                <MenuItem key={text} onClick={onClick}>
                    <>
                        {icon || null}
                        {text}
                    </>
                </MenuItem>
            ))}
        </Media.Menu>
    );
}

export default ActionDropdown;
