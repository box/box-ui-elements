// @flow
import * as React from 'react';
import {
    PREVIEW_TITLE_BODY_TAGS,
    PREVIEW_TITLE_BODY_TAGS_BUTTON,
    TITLE_BODY_TAGS,
    TITLE_BODY_TAGS_BUTTON,
} from './constants';
import ContentPreview from '../../elements/content-preview';

export type UnreadEligibleMessageCenterMessageCount = {| count: number |};

type CommonParams = {|
    body: string,
    category: string,
    tags: string,
    title: string,
|};

type PreviewParams = {|
    fileUpload?: { fileId: string, sharedLinkUrl: string },
|};

export type ButtonParam = {
    actions: Array<{ target: string, type: string, url: string }>,
    label: string,
};

export type ButtonParams = {|
    button1?: ButtonParam,
|};

export type PreviewTitleBodyTagsTemplateParams = {|
    ...CommonParams,
    ...PreviewParams,
|};
export type PreviewTitleBodyTagsButtonTemplateParams = {|
    ...ButtonParams,
    ...CommonParams,
    ...PreviewParams,
|};
export type TitleBodyTagsTemplateParams = {|
    ...CommonParams,
|};
export type TitleBodyTagsButtonTemplateParams = {|
    ...ButtonParams,
    ...CommonParams,
|};
export type EligibleMessageCenterMessage = {|
    activateDate: number,
    id: number,
    name: string,
    priority: number,
    templateName:
        | typeof PREVIEW_TITLE_BODY_TAGS
        | typeof PREVIEW_TITLE_BODY_TAGS_BUTTON
        | typeof TITLE_BODY_TAGS
        | typeof TITLE_BODY_TAGS_BUTTON,
    templateParams: {|
        ...ButtonParams,
        ...CommonParams,
        ...PreviewParams,
    |},
|};

export type GetEligibleMessageCenterMessages = Array<EligibleMessageCenterMessage>;

export type ContentPreviewProps = $Diff<
    React.ElementConfig<typeof ContentPreview>,
    {
        apiHost: any,
        cache: any,
        className: any,
        componentRef: any,
        fileId: any,
        onError: any,
        onLoad: any,
        sharedLink: any,
        token: any,
    },
>;
