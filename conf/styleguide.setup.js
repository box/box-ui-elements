import { IntlProvider } from 'react-intl';

// Constants
global.FEATURES = {
    activityFeed: {
        tasks: {
            createFromComment: true,
            createButton: true,
        },
    },
};
global.FILE_ID = __FILEID__ || '308566420378'; // eslint-disable-line
global.FOLDER_ID = __FOLDERID__ || '51964781421'; // eslint-disable-line
global.TOKEN = __TOKEN__ || 'aiMADZorjZDCJEfi7zREbvHBo2K70MXf'; // eslint-disable-line

// Components
global.IntlProvider = IntlProvider;
