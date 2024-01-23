/**
 * @flow
 * @file Doc Gen tags section component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';
import type { DocGenTag } from './types';

import './DocGenSidebar.scss';
import TagsList from './TagsList';

type Props = {
    message: MessageDescriptor,
    tags: DocGenTag[],
};

const TagsSection = ({ tags, message }: Props) => (
    <>
        {tags.length > 0 && (
            <div className="docgen-tag-section">
                <span className="docgen-tag-section-header">
                    <FormattedMessage {...message} />
                </span>

                <TagsList tags={tags} />
            </div>
        )}
    </>
);

export default TagsSection;
