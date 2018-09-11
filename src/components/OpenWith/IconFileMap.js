import IconAdobeSign from 'box-react-ui/lib/icons/adobe-sign/IconAdobeSign';
import FileIcon from 'box-react-ui/lib/icons/file-icon/FileIcon';
import IconGoogleDocs from 'box-react-ui/lib/icons/google-docs/IconGoogleDocs';
import IconGoogleSheets from 'box-react-ui/lib/icons/google-docs/IconGoogleSheets';
import IconGoogleSlides from 'box-react-ui/lib/icons/google-docs/IconGoogleSlides';

const ICON_FILE_MAP = {
    default: FileIcon,
    Adobe: IconAdobeSign,
    'Google Docs': IconGoogleDocs,
    'Google Sheets': IconGoogleSheets,
    'Google Slides': IconGoogleSlides,
};

export default ICON_FILE_MAP;
