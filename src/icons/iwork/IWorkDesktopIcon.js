// @flow
import * as React from 'react';

import IconIWorkKeynoteDesktop from './IconIWorkKeynoteDesktop';
import IconIWorkPagesDesktop from './IconIWorkPagesDesktop';
import IconIWorkNumbersDesktop from './IconIWorkNumbersDesktop';

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

const IWorkDesktopIcon = ({ className, dimension = 30, extension, title }: Props) => {
    let Component = null;
    switch (extension) {
        case 'pages':
            Component = IconIWorkPagesDesktop;
            break;
        case 'numbers':
            Component = IconIWorkNumbersDesktop;
            break;
        case 'key':
            Component = IconIWorkKeynoteDesktop;
            break;
        // no default
    }

    if (Component !== null) {
        return <Component className={className} height={dimension} title={title} width={dimension} />;
    }
    return null;
};

export default IWorkDesktopIcon;
