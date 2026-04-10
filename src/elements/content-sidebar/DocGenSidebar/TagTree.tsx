import * as React from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { Accordion } from '@box/blueprint-web';
import { useFeatureConfig } from '../../common/feature-checking';

import './DocGenSidebar.scss';
import { JsonPathsMap } from './types';

interface TagTreeProps {
    data?: JsonPathsMap;
    level?: number;
}

const TagTree = ({ data, level = 0 }: TagTreeProps) => {
    const { enabled: isPreviewModernizationEnabled } = useFeatureConfig('previewModernization');

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
                                fixed
                                className="bcs-DocGen-collapsible"
                            >
                                <span
                                    className={classNames('bcs-DocGen-tagPath', {
                                        'bcs-DocGen-tagPath--modernized': isPreviewModernizationEnabled,
                                    })}
                                    tabIndex={0}
                                    role="button"
                                    aria-disabled="true"
                                >
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
