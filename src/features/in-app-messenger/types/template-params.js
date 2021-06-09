// @flow

type PreviewParams = {|
    fileUpload?: { fileId: string, sharedLinkUrl: string },
|};

type ButtonParam = {
    actions: Array<{ target: string, type: string, url: string }>,
    label: string,
};

export type PreviewTitleBodyTwoButtonsPopoutParams = {|
    body: string,
    button1: ButtonParam,
    button2?: ButtonParam,
    templateID: string,
    title: string,
    ...PreviewParams,
|};
