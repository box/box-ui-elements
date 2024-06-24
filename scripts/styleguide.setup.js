import { IntlProvider } from 'react-intl';
import features from '../examples/src/features';
// Constants
global.FEATURES = global.FEATURES || features;
global.FILE_ID = global.FILE_ID || __FILEID__ || '415542803939'; // eslint-disable-line
global.FOLDER_ID = global.FOLDER_ID || __FOLDERID__ || '69083462919'; // eslint-disable-line
// NOTE: The token used is a readonly token accessing public data in a demo enterprise. DO NOT PUT A WRITE TOKEN
global.TOKEN = global.TOKEN || __TOKEN__ || 'P1n3ID8nYMxHRWvenDatQ9k6JKzWzYrz'; // eslint-disable-line
global.PROPS = global.PROPS || {}; // eslint-disable-line

// Classes
global.IntlProvider = IntlProvider;

// Components
global.Avatar = require('../src/components/avatar').default;
global.Button = require('../src/components/button').default;
global.DatalistItem = require('../src/components/datalist-item').default;
global.Flyout = require('../src/components/flyout').Flyout;
global.Label = require('../src/components/label').default;
global.Link = require('../src/components/link').default;
global.ModalActions = require('../src/components/modal/ModalActions').default;
global.ModalDialog = require('../src/components/modal/ModalDialog').default;
global.Overlay = require('../src/components/flyout').Overlay;
global.PlainButton = require('../src/components/plain-button').default;
global.PrimaryButton = require('../src/components/primary-button').default;
global.SearchForm = require('../src/components/search-form').default;
global.SelectMenuLinkItem = require('../src/components/menu').SelectMenuLinkItem;
global.Table = require('../src/components/table').Table;
global.TableBody = require('../src/components/table').TableBody;
global.TableCell = require('../src/components/table').TableCell;
global.TableHeader = require('../src/components/table').TableHeader;
global.TableHeaderCell = require('../src/components/table').TableHeaderCell;
global.TableRow = require('../src/components/table').TableRow;
global.TextArea = require('../src/components/text-area').default;
global.TextInput = require('../src/components/text-input').default;

// Icons
global.IconHelp = require('../src/icons/general/IconHelp').default;

// Features
global.QuickSearch = require('../src/features/quick-search').QuickSearch;
global.QuickSearchItem = require('../src/features/quick-search').QuickSearchItem;

// Form Elements
global.FormElement = require('../src/components/form-elements/form').default;
global.TextAreaElement = require('../src/components/form-elements/text-area').default;
global.TextInputElement = require('../src/components/form-elements/text-input').default;
