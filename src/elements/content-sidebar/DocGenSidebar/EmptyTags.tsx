import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import NoTagsIcon from './NoTagsIcon';
// @ts-ignore: no ts definition
import messages from './messages';

const EmptyTags = () => (
    <div className="bcs-DocGen-emptyState">
        <NoTagsIcon className="bcs-DocGen-emptyState--icon" />
        <strong>
            <FormattedMessage {...messages.noTags} />
        </strong>
    </div>
);

export default EmptyTags;
