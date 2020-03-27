// @flow
import * as React from 'react';

import IconIWorkKeynote from './IconIWorkKeynote';
import IconIWorkNumbers from './IconIWorkNumbers';
import IconIWorkPages from './IconIWorkPages';

type Props = {
    /** Additional class name */
    className?: string,
    /** Dimension of the icon */
    dimension?: number,
    /** The file extension */
    extension: string,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
};

const IWorkIcon = ({ className, dimension = 30, extension, title }: Props) => {
    let Component = null;
    switch (extension) {
        case 'pages':
            Component = IconIWorkPages;
            break;
        case 'numbers':
            Component = IconIWorkNumbers;
            break;
        case 'key':
            Component = IconIWorkKeynote;
            break;
        // no default
    }

    if (Component !== null) {
        return <Component className={className} height={dimension} title={title} width={dimension} />;
    }
    return null;
};

export default IWorkIcon;
