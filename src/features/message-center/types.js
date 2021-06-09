// @flow
import {
    PREVIEW_TITLE_BODY_TAGS,
    PREVIEW_TITLE_BODY_TAGS_BUTTON,
    TITLE_BODY_TAGS,
    TITLE_BODY_TAGS_BUTTON,
} from './constants';

export type UnreadEligibleMessageCenterMessageCount = {| count: number |};

type CommonParams = {|
    body: string,
    category: string,
    name: string,
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
