// @flow
import * as React from 'react';
import type { Token } from '../../../../../common/types/core';
import MessageTextContent from '../common/MessageTextContent';
import MessagePreviewContent from '../../../../message-preview-content/MessagePreviewContent';
import type { ContentPreviewProps } from '../../../../message-preview-content/MessagePreviewContent';
import MessageTags from '../common/MessageTags';
import MessageFooter from '../common/MessageFooter';
import BottomContentWrapper from '../common/BottomContentWrapper';
import type { PreviewTitleBodyTagsTemplateParams } from '../../../types';

type Props = $Diff<
    {|
        ...PreviewTitleBodyTagsTemplateParams,
        apiHost: string,
        contentPreviewProps?: ContentPreviewProps,
        date: Date,
        getToken: (fileId: string) => Promise<Token>,
    |},
    { category: any },
>;

function PreviewTitleBodyTags({
    apiHost,
    date,
    body,
    contentPreviewProps,
    fileUpload: { fileId, sharedLinkUrl } = {},
    tags,
    title,
    getToken,
    name,
}: Props) {
    return (
        <div className="PreviewTitleBodyTags">
            <MessagePreviewContent
                apiHost={apiHost}
                contentPreviewProps={contentPreviewProps}
                fileId={fileId}
                getToken={getToken}
                sharedLink={sharedLinkUrl}
            />
            <BottomContentWrapper>
                <MessageTextContent body={body} title={title} />
                <MessageTags tags={tags} />
                <MessageFooter date={date} name={name} />
            </BottomContentWrapper>
        </div>
    );
}

export default PreviewTitleBodyTags;
