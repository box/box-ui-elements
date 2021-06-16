// @flow

/**
 * This component is intended to be passed to TemplateContainer as templateComponent prop, like this:
 *   <TemplateContainer templateID='my-template' templateComponent=MyTemplate/>
 */

import * as React from 'react';

import Button from '../../../../components/button/Button';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import Overlay from '../../../../components/flyout/Overlay';
import MessagePreviewContent from '../../../message-preview-content/MessagePreviewContent';
import type { Token } from '../../../../common/types/core';
import type { MessageActions } from '../../types';

import { type PreviewTitleBodyTwoButtonsPopoutParams } from '../../types';

import './styles/PreviewTitleBodyTwoButtonsPopoutTemplate.scss';

type Props = {
    apiHost: string,
    contentPreviewProps?: ContentPreviewProps,
    getToken: (folderID: string | number) => Promise<Token>,
    onAction: (MessageActions, ...Array<any>) => any,
    params: PreviewTitleBodyTwoButtonsPopoutParams,
};

const handleButton1Click = (onAction, button1) => {
    if (button1) {
        onAction(button1.actions);
    }
};

const handleButton2Click = (onAction, button2) => {
    if (button2) {
        onAction(button2.actions);
    }
};

const PreviewTitleBodyTwoButtonsPopoutTemplate = ({
    apiHost,
    contentPreviewProps,
    getToken,
    onAction,
    params: { body, button1, button2, fileUpload: { fileId, sharedLinkUrl } = {}, title },
}: Props) => {
    return (
        <div className="bdl-PreviewTitleBodyTwoButtonsPopoutTemplate">
            <Overlay>
                <div className="bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-contentContainer">
                    <div className="bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-previewContainer">
                        <MessagePreviewContent
                            apiHost={apiHost}
                            contentPreviewProps={contentPreviewProps}
                            fileId={fileId}
                            getToken={getToken}
                            sharedLink={sharedLinkUrl}
                        />
                    </div>
                    <div className="bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-mainContainer">
                        {/* eslint-disable react/no-danger */}
                        <div
                            className="bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-title"
                            dangerouslySetInnerHTML={{
                                __html: title,
                            }}
                        />
                        <div
                            className="bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-body"
                            dangerouslySetInnerHTML={{
                                __html: body,
                            }}
                        />
                        {/* eslint-enable react/no-danger */}
                        <div className="bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-buttons">
                            {button2 && (
                                <Button data-resin-target="cta2" onClick={() => handleButton2Click(onAction, button2)}>
                                    {button2.label}
                                </Button>
                            )}
                            <PrimaryButton
                                data-resin-target="cta1"
                                onClick={() => handleButton1Click(onAction, button1)}
                            >
                                {button1.label}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </Overlay>
        </div>
    );
};

export default PreviewTitleBodyTwoButtonsPopoutTemplate;
