// @flow

type PreviewParams = {|
    fileUpload?: { fileId: string, sharedLinkUrl: string },
|};

export type PreviewTitleBody2ButtonsPopoutParams = {|
    body: HTMLParam,
    button1: ButtonParam,
    button2?: ButtonParam,
    templateID: string,
    title: HTMLParam,
    ...PreviewParams,
|};
