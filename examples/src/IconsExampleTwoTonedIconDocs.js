// @flow
import * as React from 'react';

const iconType = () => {
    return (
        <code className="props-code">{`
className?: string,
height?: number,
/** A string describing the icon if it's not purely decorative for accessibility */
title?: string | Element<any>,
width?: number,
        `}</code>
    );
};

export default iconType;
