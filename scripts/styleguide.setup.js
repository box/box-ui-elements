import { IntlProvider } from 'react-intl';
import features from '../examples/src/features';
// Constants
global.FEATURES = global.FEATURES || features;
global.FILE_ID = global.FILE_ID || __FILEID__ || '415542803939'; // eslint-disable-line
global.FOLDER_ID = global.FOLDER_ID || __FOLDERID__ || '69083462919'; // eslint-disable-line
// NOTE: The token used is a readonly token accessing public data in a demo enterprise. DO NOT PUT A WRITE TOKEN
global.TOKEN = global.TOKEN || __TOKEN__ || 'QvMQdM3Lqk9zyYjxS2a9bCNkM1R4Icr1'; // eslint-disable-line
global.PROPS = global.PROPS || {}; // eslint-disable-line

// Components
global.IntlProvider = IntlProvider;
