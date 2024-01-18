/**
 * @flow
 * @file Doc Gen tags list component
 * @author Box
 */

import * as React from 'react';
import type { DocGenTag } from './types';

type Props = {
    tags: DocGenTag[],
};

const TagsList = ({ tags }: Props) => (
    <div>
        {tags.map(tag => (
            <p key={tag.jsonPaths[0]}>{tag.jsonPaths[0]}</p>
        ))}
    </div>
);

export default TagsList;
