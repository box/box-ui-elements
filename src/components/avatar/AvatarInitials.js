// @flow
import React from 'react';

const AVATAR_COLORS = [
    '#2486FC',
    '#0061D5',
    '#003C84',
    '#767676',
    '#F5B31B',
    '#26C281',
    '#4826C2',
    '#9F3FED',
    '#ED3757',
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
