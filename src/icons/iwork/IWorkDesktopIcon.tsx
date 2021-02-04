import * as React from 'react';

import KeynoteForMac32 from '../../icon/logo/KeynoteForMac32';
import NumbersForMac32 from '../../icon/logo/NumbersForMac32';
import PagesForMac32 from '../../icon/logo/PagesForMac32';

import { FileIcon } from '../iconTypes';

const IWorkDesktopIcon = ({ className, dimension = 32, extension, title }: FileIcon) => {
    let Component = null;
    switch (extension) {
        case 'pages':
            Component = PagesForMac32;
            break;
        case 'numbers':
            Component = NumbersForMac32;
            break;
        case 'key':
            Component = KeynoteForMac32;
            break;
        // no default
    }

    if (Component !== null) {
        return <Component className={className} height={dimension} title={title} width={dimension} />;
    }
    return null;
};

export default IWorkDesktopIcon;
