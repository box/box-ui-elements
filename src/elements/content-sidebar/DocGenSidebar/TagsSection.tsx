import * as React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import TagTree from './TagTree';
import { JsonPathsMap } from './types';

import './DocGenSidebar.scss';

type Props = {
    message: MessageDescriptor;
    data: JsonPathsMap;
};

const TagsSection = ({ data, message }: Props) => {
    if (Object.keys(data).length === 0) {
        return null;
    }

    return (
        <div className="bcs-TagsSection">
            <span className="bcs-TagsSection-header">
                <FormattedMessage {...message} />
            </span>

            <TagTree data={data} />
        </div>
    );
};

export default TagsSection;
