// @flow
import * as React from 'react';

import IconGoogleSlides from './IconGoogleSlides';
import IconGoogleSheets from './IconGoogleSheets';
import IconGoogleDocs from './IconGoogleDocs';

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

const GoogleDocsIcon = ({ className, dimension = 30, extension, title }: Props) => {
    let Component = null;
    switch (extension) {
        case 'docm':
        case 'docx':
        case 'gdoc':
        case 'odt':
            Component = IconGoogleDocs;
            break;
        case 'gsheet':
        case 'ods':
        case 'xlsm':
        case 'xlsx':
            Component = IconGoogleSheets;
            break;
        case 'gslide':
        case 'gslides':
        case 'odp':
        case 'pptm':
        case 'pptx':
            Component = IconGoogleSlides;
            break;
        // no default
    }

    if (Component !== null) {
        return <Component className={className} height={dimension} title={title} width={dimension} />;
    }
    return null;
};

export default GoogleDocsIcon;
