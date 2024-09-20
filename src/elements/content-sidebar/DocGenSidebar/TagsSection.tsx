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
        <div className="bcs-TagsSection" data-testid="bcs-TagsSection">
            <span className="bcs-TagsSection-header">
                <FormattedMessage {...message} />
            </span>
            <div className="bcs-TagsSection-accordion-wrapper">
                <TagTree data={data} />
            </div>
        </div>
    );
};

export default TagsSection;
