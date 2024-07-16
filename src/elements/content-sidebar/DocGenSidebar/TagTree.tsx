import * as React from 'react';
import './DocGenSidebar.scss';
import { JsonPathsMap } from './types';

interface TagTreeProps {
    data?: JsonPathsMap;
    level?: number;
}

const TagTree = ({ data, level = 0 }: TagTreeProps) => {
    if (!data) {
        return null;
    }

    return (
        <div>
            {Object.keys(data)
                .sort()
                .map(key => (
                    <div key={`${key}-${level}`} style={{ paddingLeft: `${level * 12}px` }}>
                        <span className="bcs-DocGen-tagPath">{key}</span>
                        {data[key] && <TagTree data={data[key]} level={level + 1} />}
                    </div>
                ))}
        </div>
    );
};

export default TagTree;
