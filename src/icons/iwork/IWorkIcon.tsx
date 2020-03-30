import * as React from 'react';

import IconIWorkKeynote from './IconIWorkKeynote';
import IconIWorkNumbers from './IconIWorkNumbers';
import IconIWorkPages from './IconIWorkPages';
import { FileIcon } from '../iconTypes';

const IWorkIcon = ({ className, dimension = 30, extension, title }: FileIcon) => {
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
