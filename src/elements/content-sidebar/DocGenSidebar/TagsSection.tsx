import * as React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import { JsonPathsMap } from './types';

import './DocGenSidebar.scss';
import TagTree from './TagTree';

type Props = {
    message: MessageDescriptor;
    data: JsonPathsMap;
};

const TagsSection = ({ data, message }: Props) => (
    <>
        {!(typeof data !== 'object' || Array.isArray(data) || Object.keys(data).length === 0) && (
            <div className="docgen-tag-section">
                <span className="docgen-tag-section-header">
                    <FormattedMessage {...message} />
                </span>

                <TagTree data={data} />
            </div>
        )}
    </>
);

export default TagsSection;
