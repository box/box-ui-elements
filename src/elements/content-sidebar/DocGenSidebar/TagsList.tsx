import * as React from 'react';

import { DocGenTag } from './types';
import './DocGenSidebar.scss';

type Props = {
    tags: DocGenTag[];
};

const TagsList = ({ tags }: Props) => (
    <div>
        {tags.map(tag => (
            <span className="docgen-tag-path" key={tag.tag_content}>
                {tag.tag_content}
            </span>
        ))}
    </div>
);

export default TagsList;
