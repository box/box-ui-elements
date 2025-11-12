import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Accordion } from '@box/blueprint-web';

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
        <Accordion type="multiple" className="bcs-DocGen-accordion">
            {Object.keys(data)
                .sort()
                .map(key => {
                    if (isEmpty(data[key])) {
                        return (
                            <Accordion.Item
                                value={key}
                                key={`${key}-${level}`}
                                style={{ paddingLeft: `${level * 12}px` }}
                                fixed
                                className="bcs-DocGen-collapsible"
                            >
                                <span className="bcs-DocGen-tagPath" tabIndex={0} role="button" aria-disabled="true">
                                    {key}
                                </span>
                            </Accordion.Item>
                        );
                    }
                    return (
                        <Accordion.Item
                            value={key}
                            title={key}
                            key={`${key}-${level}`}
                            style={{ paddingLeft: `${level * 12}px` }}
                            className="bcs-DocGen-collapsible"
                        >
                            {data[key] && <TagTree data={data[key]} level={level + 1} />}
                        </Accordion.Item>
                    );
                })}
        </Accordion>
    );
};

export default TagTree;
