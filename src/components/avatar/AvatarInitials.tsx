import * as React from 'react';
import { avatarColors } from '../../styles/variables';

const getInitials = (name: string) => {
    const firstInitial = name.slice(0, 1);
    const lastInitial = name.slice(name.lastIndexOf(' ') + 1, name.lastIndexOf(' ') + 2);
    return (firstInitial + lastInitial).toUpperCase();
};

export interface AvatarInitialsProps {
    className?: string;
    id?: string | number | null;
    name: string;
}

const AvatarInitials = ({ className = '', id = 0, name }: AvatarInitialsProps) => {
    const avatarColorSelector = parseInt(id as string, 10) || 0;
    const backgroundColorIndex = avatarColorSelector % avatarColors.length;

    return (
        <span className={`avatar-initials ${className}`} data-bg-idx={backgroundColorIndex}>
            {getInitials(name)}
        </span>
    );
};

export default AvatarInitials;
