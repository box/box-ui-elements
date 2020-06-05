import * as React from 'react';
import { avatarColors } from '../../styles/variables';

const getInitials = (name: string) => {
    // Remove any bracketed text from the user name
    const cleanedName = name.replace(/[[({<]+.*[\])}>]+/g, '').trim();
    const firstInitial = cleanedName.slice(0, 1);
    const lastInitial = cleanedName.slice(cleanedName.lastIndexOf(' ') + 1, cleanedName.lastIndexOf(' ') + 2);
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
