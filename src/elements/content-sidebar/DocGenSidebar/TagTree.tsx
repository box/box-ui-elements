import React from 'react';
import './DocGenSidebar.scss';
import { JsonPathsMap } from './types';

interface TagTreeProps {
    data: JsonPathsMap;
    level?: number;
}

const TagTree = ({ data, level = 0 }: TagTreeProps) => {
    if (Array.isArray(data) || !data) {
        return null;
    }

    return (
        <div>
            {Object.keys(data)
                .sort()
                .map(key => (
                    <div key={`${key}-${level}`} style={{ paddingLeft: `${level * 12}px` }}>
                        <span className="docgen-tag-path">{key}</span>
                        {data[key] && <TagTree data={data[key]} level={level + 1} />}
                    </div>
                ))}
        </div>
    );
};

export default TagTree;
