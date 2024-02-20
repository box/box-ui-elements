import React from 'react';
import './DocGenSidebar.scss';
import { JsonData } from './types';

interface TagTreeProps {
    data: JsonData | string[];
    level?: number;
}

const TagTree = ({ data, level = 0 }: TagTreeProps) => {
    if (Array.isArray(data)) {
        return null;
    }

    return (
        <div>
            {Object.keys(data)
                .sort()
                .map(key => (
                    <div key={`${key}-${level}`} style={{ paddingLeft: `${level * 12}px` }}>
                        <span className="docgen-tag-path">{key}</span>
                        <TagTree data={data[key]} level={level + 1} />
                    </div>
                ))}
        </div>
    );
};

export default TagTree;
