// @flow
import * as React from 'react';
import classNames from 'classnames';
import LabelPill from '../../../../../components/label-pill';
import './styles/MessageTags.scss';

type Props = {|
    className?: string,
    tags: string,
|};

const generateTags = tags => {
    const tagArray = tags.split(',');

    return tagArray
        .filter(tag => !!tag)
        .map(tag => {
            return (
                <LabelPill.Pill key={`${tag}`} className="MessageTags-tag">
                    <LabelPill.Text>{tag.trim()}</LabelPill.Text>
                </LabelPill.Pill>
            );
        });
};

function MessageTags({ tags, className }: Props) {
    return <div className={classNames('MessageTags', className)}>{generateTags(tags)}</div>;
}

export default MessageTags;
