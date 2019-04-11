// @flow strict
import {
    bdlBlueDark,
    bdlBoxBlue,
    bdlBlueLight,
    bdlNeutral02,
    bdlYellorange,
    bdlGreenLight,
    bdlGrimace,
    bdlPurpleRain,
    bdlWatermelonRed,
} from '../../styles/variables';

const AVATAR_COLORS = [
    bdlBlueDark,
    bdlBoxBlue,
    bdlBlueLight,
    bdlNeutral02,
    bdlYellorange,
    bdlGreenLight,
    bdlGrimace,
    bdlPurpleRain,
    bdlWatermelonRed,
];

const getInitials = (name: string) => {
    const firstInitial = name.slice(0, 1);
    const lastInitial = name.slice(name.lastIndexOf(' ') + 1, name.lastIndexOf(' ') + 2);
    return (firstInitial + lastInitial).toUpperCase();
};

const getColor = (id?: number | string) => {
    const avatarColorIdx = parseInt(id, 10) || 0;
    const backgroundColor = AVATAR_COLORS[avatarColorIdx % AVATAR_COLORS.length];
    return backgroundColor;
};

export { AVATAR_COLORS, getInitials, getColor };
