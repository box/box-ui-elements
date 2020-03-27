// @flow
const iconType = () => `
className?: string,
color?: string,
height?: number,
/** A string describing the icon if it's not purely decorative for accessibility */
title?: string | Element<any>,
width?: number,
`;

export default iconType;
