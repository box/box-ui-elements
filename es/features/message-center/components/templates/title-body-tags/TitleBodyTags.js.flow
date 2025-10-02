// @flow
import * as React from 'react';
import MessageTextContent from '../common/MessageTextContent';
import MessageTags from '../common/MessageTags';
import MessageFooter from '../common/MessageFooter';
import BottomContentWrapper from '../common/BottomContentWrapper';
import type { TitleBodyTagsTemplateParams } from '../../../types';

type Props = $Diff<{| ...TitleBodyTagsTemplateParams, date: Date |}, { category: any }>;

function TitleBodyTags({ date, body, tags, title, name }: Props) {
    return (
        <div className="TitleBodyTags">
            <BottomContentWrapper>
                <MessageTextContent body={body} title={title} />
                <MessageTags tags={tags} />
                <MessageFooter date={date} name={name} />
            </BottomContentWrapper>
        </div>
    );
}

export default TitleBodyTags;
