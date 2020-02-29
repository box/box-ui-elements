import * as React from 'react';

import IconExcelDesktop from './IconExcelDesktop';
import IconPowerPointDesktop from './IconPowerPointDesktop';
import IconWordDesktop from './IconWordDesktop';
import { FileIcon } from '../iconTypes';

const OfficeDesktopIcon = ({ className, dimension = 30, extension, title }: FileIcon) => {
    let Component = null;
    switch (extension) {
        case 'doc':
        case 'docx':
            Component = IconWordDesktop;
            break;
        case 'ppt':
        case 'pptx':
            Component = IconPowerPointDesktop;
            break;
        case 'xls':
        case 'xlsx':
        case 'xlsm':
        case 'xlsb':
            Component = IconExcelDesktop;
            break;
        // no default
    }

    if (Component !== null) {
        return <Component className={className} height={dimension} title={title} width={dimension} />;
    }
    return null;
};

export default OfficeDesktopIcon;
