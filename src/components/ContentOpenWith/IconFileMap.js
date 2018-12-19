import IconAdobeSign from 'box-react-ui/lib/icons/adobe-sign/IconAdobeSign';
import IconGoogleDocs from 'box-react-ui/lib/icons/google-docs/IconGoogleDocs';
import IconGoogleSheets from 'box-react-ui/lib/icons/google-docs/IconGoogleSheets';
import IconGoogleSlides from 'box-react-ui/lib/icons/google-docs/IconGoogleSlides';
import FileIcon from 'box-react-ui/lib/icons/file-icon/FileIcon';

const ICON_FILE_MAP = {
    default: FileIcon,
    'Adobe Sign': IconAdobeSign,
    'Google Docs': IconGoogleDocs,
    'Google Sheets': IconGoogleSheets,
    'Google Slides': IconGoogleSlides,
    Open: FileIcon,
};

export default ICON_FILE_MAP;
