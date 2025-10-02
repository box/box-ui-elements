// @flow
import * as React from 'react';
import MessageTextContent from '../common/MessageTextContent';
import MessageTags from '../common/MessageTags';
import MessageFooter from '../common/MessageFooter';
import BottomContentWrapper from '../common/BottomContentWrapper';
import type { TitleBodyTagsButtonTemplateParams } from '../../../types';

type Props = $Diff<{| ...TitleBodyTagsButtonTemplateParams, date: Date |}, { category: any }>;

function TitleBodyTagsButton({ date, body, button1, tags, title, name }: Props) {
    return (
        <div className="TitleBodyTagsButton">
            <BottomContentWrapper>
                <MessageTextContent body={body} title={title} />
                <MessageTags tags={tags} />
                <MessageFooter actionItem={button1} date={date} name={name} />
            </BottomContentWrapper>
        </div>
    );
}

export default TitleBodyTagsButton;
