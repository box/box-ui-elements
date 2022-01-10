/**
 * @flow
 * @file Maintains a mapping of integration names to icons.
 * @author Box
 */
import * as React from 'react';
import IconGoogleDocs from '../../icons/google-docs/IconGoogleDocs';
import IconGoogleSheets from '../../icons/google-docs/IconGoogleSheets';
import IconGoogleSlides from '../../icons/google-docs/IconGoogleSlides';
import FileIcon from '../../icons/file-icon/FileIcon';

const ICON_FILE_MAP = {
    'Google Docs': IconGoogleDocs,
    'Google Docs (beta)': IconGoogleDocs,
    'Google Sheets': IconGoogleSheets,
    'Google Sheets (beta)': IconGoogleSheets,
    'Google Slides': IconGoogleSlides,
    'Google Slides (beta)': IconGoogleSlides,
};

function getIcon(iconName: string): React.ComponentType<any> {
    return ICON_FILE_MAP[iconName] || FileIcon;
}

export default getIcon;
