import * as React from 'react';

import { DocGenTag } from './types';
import './DocGenSidebar.scss';

type Props = {
    tags: DocGenTag[];
};

const TagsList = ({ tags }: Props) => (
    <div>
        {tags.map(tag => (
            <span className="docgen-tag-path" key={tag.jsonPaths[0]}>
                {tag.jsonPaths[0]}
            </span>
        ))}
    </div>
);

export default TagsList;
