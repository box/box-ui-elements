/**
 * @flow
 * @file Maintains a mapping of integration names to icons.
 * @author Box
 */
import IconAdobeSign from 'box-react-ui/lib/icons/adobe-sign/IconAdobeSign';
import IconGoogleDocs from 'box-react-ui/lib/icons/google-docs/IconGoogleDocs';
import IconGoogleSheets from 'box-react-ui/lib/icons/google-docs/IconGoogleSheets';
import IconGoogleSlides from 'box-react-ui/lib/icons/google-docs/IconGoogleSlides';
import FileIcon from 'box-react-ui/lib/icons/file-icon/FileIcon';

const ICON_FILE_MAP = {
    'Adobe Sign': IconAdobeSign,
    'Google Docs': IconGoogleDocs,
    'Google Docs (beta)': IconGoogleDocs,
    'Google Sheets': IconGoogleSheets,
    'Google Sheets (beta)': IconGoogleSheets,
    'Google Slides': IconGoogleSlides,
    'Google Slides (beta)': IconGoogleSlides,
};

function getIcon(iconName: string): Element {
    return ICON_FILE_MAP[iconName] || FileIcon;
}

export default getIcon;
