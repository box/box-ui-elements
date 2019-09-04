// @flow
import React from 'react';
import {
    bdlLightBlue,
    bdlBoxBlue,
    bdlDarkBlue,
    bdlGray62,
    bdlGreenLight,
    bdlYellorange,
    bdlGrimace,
    bdlPurpleRain,
    bdlWatermelonRed,
} from '../../styles/variables';

// NOTE: The same list exists in Avatar.scss
const AVATAR_COLORS = [
    bdlLightBlue,
    bdlBoxBlue,
    bdlDarkBlue,
    bdlGray62,
    bdlGreenLight,
    bdlYellorange,
    bdlGrimace,
    bdlPurpleRain,
    bdlWatermelonRed,
];

const getInitials = name => {
    const firstInitial = name.slice(0, 1);
    const lastInitial = name.slice(name.lastIndexOf(' ') + 1, name.lastIndexOf(' ') + 2);
    return (firstInitial + lastInitial).toUpperCase();
};

type Props = {
    className?: string,
    id?: ?string | number,
    name: string,
};

const AvatarInitials = ({ className = '', id, name }: Props) => {
    const avatarColorSelector = parseInt(id, 10) || 0;
    const backgroundColorIndex = avatarColorSelector % AVATAR_COLORS.length;

    return <span className={`avatar-initials-${backgroundColorIndex} ${className}`}>{getInitials(name)}</span>;
};

export default AvatarInitials;
