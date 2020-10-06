// @flow
import * as React from 'react';
import type { Token } from '../../../../../common/types/core';
import MessageTextContent from '../common/MessageTextContent';
import MessagePreviewContent from '../common/MessagePreviewContent';
import MessageTags from '../common/MessageTags';
import MessageFooter from '../common/MessageFooter';
import BottomContentWrapper from '../common/BottomContentWrapper';
import type { PreviewTitleBodyTagsTemplateParams } from '../../../types';

type Props = $Diff<
    {|
        ...PreviewTitleBodyTagsTemplateParams,
        apiHost: string,
        date: Date,
        getToken: (fileId: string) => Promise<Token>,
    |},
    { category: any },
>;

function PreviewTitleBodyTags({
    apiHost,
    date,
    body,
    fileUpload: { fileId, sharedLinkUrl } = {},
    tags,
    title,
    getToken,
}: Props) {
    return (
        <div className="PreviewTitleBodyTags">
            <MessagePreviewContent apiHost={apiHost} fileId={fileId} getToken={getToken} sharedLink={sharedLinkUrl} />
            <BottomContentWrapper>
                <MessageTextContent body={body} title={title} />
                <MessageTags tags={tags} />
                <MessageFooter date={date} />
            </BottomContentWrapper>
        </div>
    );
}

export default PreviewTitleBodyTags;
