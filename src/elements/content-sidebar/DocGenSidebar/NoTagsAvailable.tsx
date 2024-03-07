import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import NoTagsIcon from './NoTagsIcon';
// @ts-ignore: no ts definition
import messages from './messages';

const NoTagsAvailable = () => (
    <div className="docgen-empty-state">
        <NoTagsIcon className="docgen-empty-state--icon" />
        <strong>
            <FormattedMessage {...messages.noTags} />
        </strong>
    </div>
);

export default NoTagsAvailable;
