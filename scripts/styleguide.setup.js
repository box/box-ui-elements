import { IntlProvider } from 'react-intl';
import features from '../examples/src/features';
// Constants
global.FEATURES = global.FEATURES || features;
global.FILE_ID = global.FILE_ID || __FILEID__ || '415542803939'; // eslint-disable-line
global.FOLDER_ID = global.FOLDER_ID || __FOLDERID__ || '69083462919'; // eslint-disable-line
// NOTE: The token used is a readonly token accessing public data in a demo enterprise.
global.TOKEN = global.TOKEN || __TOKEN__ || 'S8wjvjOL9GEK5VtXsQNVMOwSrx1g55oC'; // eslint-disable-line
global.PROPS = global.PROPS || {}; // eslint-disable-line

// Components
global.IntlProvider = IntlProvider;
