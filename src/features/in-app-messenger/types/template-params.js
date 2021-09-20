// @flow
import type { MessageActions } from './message-actions';

type PreviewParams = {|
    fileUpload?: { fileId: string, sharedLinkUrl: string },
|};

type ButtonParam = {
    actions: MessageActions,
    label: string,
};

export type PreviewTitleBodyTwoButtonsParams = {|
    body: string,
    button1: ButtonParam,
    button2?: ButtonParam,
    templateID: string,
    title: string,
    ...PreviewParams,
|};
