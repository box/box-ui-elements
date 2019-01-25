// @flow
import React from 'react';

const AVATAR_COLORS = [
    '#18BBF7',
    '#0D67C7',
    '#052E5C',
    '#747679',
    '#FDA308',
    '#98C332',
    '#159F45',
    '#B800B2',
    '#F22C44',
];

const getInitials = name => {
    const firstInitial = name.slice(0, 1);
    const lastInitial = name.slice(name.lastIndexOf(' ') + 1, name.lastIndexOf(' ') + 2);
    return firstInitial + lastInitial;
};

type Props = {
    className?: string,
    id?: string | number,
    name: string,
};

const AvatarInitials = ({ className = '', id, name }: Props) => {
    const avatarColorSelector = parseInt(id, 10) || 0;
    const backgroundColor = AVATAR_COLORS[avatarColorSelector % AVATAR_COLORS.length];
    return (
        <span className={`avatar-initials ${className}`} style={{ backgroundColor }}>
            {getInitials(name)}
        </span>
    );
};

export default AvatarInitials;
