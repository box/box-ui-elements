// @flow
import * as React from 'react';
import type { Token } from '../../../../common/types/core';
import type { EligibleMessageCenterMessage } from '../../types';
import type { ContentPreviewProps } from '../../../message-preview-content/MessagePreviewContent';
import { PreviewTitleBodyTags, PreviewTitleBodyTagsButton, TitleBodyTags, TitleBodyTagsButton } from '../templates';
import {
    PREVIEW_TITLE_BODY_TAGS,
    PREVIEW_TITLE_BODY_TAGS_BUTTON,
    TITLE_BODY_TAGS,
    TITLE_BODY_TAGS_BUTTON,
} from '../../constants';

type Props = {|
    ...EligibleMessageCenterMessage,
    apiHost: string,
    contentPreviewProps?: ContentPreviewProps,
    getToken: (fileId: string) => Promise<Token>,
|};

function Message({
    activateDate,
    apiHost,
    contentPreviewProps,
    getToken,
    templateName,
    templateParams: { body, button1, fileUpload, tags, title },
    name,
}: Props) {
    const date = new Date(activateDate * 1000);
    if (templateName === PREVIEW_TITLE_BODY_TAGS && fileUpload) {
        return (
            <PreviewTitleBodyTags
                apiHost={apiHost}
                body={body}
                contentPreviewProps={contentPreviewProps}
                date={date}
                fileUpload={fileUpload}
                getToken={getToken}
                tags={tags}
                title={title}
                name={name}
            />
        );
    }
    if (templateName === PREVIEW_TITLE_BODY_TAGS_BUTTON && button1 && fileUpload) {
        return (
            <PreviewTitleBodyTagsButton
                apiHost={apiHost}
                body={body}
                button1={button1}
                contentPreviewProps={contentPreviewProps}
                date={date}
                fileUpload={fileUpload}
                getToken={getToken}
                tags={tags}
                title={title}
                name={name}
            />
        );
    }
    if (templateName === TITLE_BODY_TAGS) {
        return <TitleBodyTags body={body} date={date} tags={tags} title={title} name={name} />;
    }
    if (templateName === TITLE_BODY_TAGS_BUTTON && button1) {
        return <TitleBodyTagsButton body={body} button1={button1} date={date} tags={tags} title={title} name={name} />;
    }

    return null;
}

export default Message;
