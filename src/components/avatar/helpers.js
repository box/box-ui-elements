// @flow strict
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

const getInitials = (name: string) => {
    const firstInitial = name.slice(0, 1);
    const lastInitial = name.slice(name.lastIndexOf(' ') + 1, name.lastIndexOf(' ') + 2);
    return firstInitial + lastInitial;
};

const getColor = (id?: number | string) => {
    const avatarColorIdx = parseInt(id, 10) || 0;
    const backgroundColor = AVATAR_COLORS[avatarColorIdx % AVATAR_COLORS.length];
    return backgroundColor;
};

export { AVATAR_COLORS, getInitials, getColor };
