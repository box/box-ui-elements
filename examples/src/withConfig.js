import * as React from 'react';
import messages from '../../i18n/en-US';

const TOKEN = __TOKEN__ || 'aiMADZorjZDCJEfi7zREbvHBo2K70MXf'; // eslint-disable-line
const FOLDER_ID = __FOLDERID__ || '51964781421'; // eslint-disable-line
const FILE_ID = __FILEID__ || '308338515622'; // eslint-disable-line

function withConfig(WrappedComponent) {
    return class extends React.PureComponent {
        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    rootFolderId={FOLDER_ID}
                    fileId={FILE_ID}
                    token={TOKEN}
                    language='en-US'
                    messages={messages}
                />
            );
        }
    };
}

export default withConfig;
