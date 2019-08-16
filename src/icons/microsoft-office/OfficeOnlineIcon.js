// @flow
import * as React from 'react';

import IconExcelOnline from './IconExcelOnline';
import IconPowerPointOnline from './IconPowerPointOnline';
import IconWordOnline from './IconWordOnline';

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

const OfficeOnlineIcon = ({ className, dimension = 30, extension, title }: Props) => {
    let Component = null;
    switch (extension) {
        case 'doc':
        case 'docx':
            Component = IconWordOnline;
            break;
        case 'ppt':
        case 'pptx':
            Component = IconPowerPointOnline;
            break;
        case 'xls':
        case 'xlsx':
        case 'xlsm':
        case 'xlsb':
            Component = IconExcelOnline;
            break;
        // no default
    }

    if (Component !== null) {
        return <Component className={className} height={dimension} title={title} width={dimension} />;
    }
    return null;
};

export default OfficeOnlineIcon;
