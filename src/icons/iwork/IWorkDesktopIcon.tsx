import * as React from 'react';

import IconIWorkKeynoteDesktop from './IconIWorkKeynoteDesktop';
import IconIWorkPagesDesktop from './IconIWorkPagesDesktop';
import IconIWorkNumbersDesktop from './IconIWorkNumbersDesktop';
import { FileIcon } from '../iconTypes';

const IWorkDesktopIcon = ({ className, dimension = 30, extension, title }: FileIcon) => {
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
