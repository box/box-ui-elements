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
import type { MessageActions, PreviewTitleBodyTwoButtonsParams} from '../../types';

import './styles/PreviewTitleBodyTwoButtonsPopoutTemplate.scss';

type Props = {
    apiHost: string,
    contentPreviewProps?: ContentPreviewProps,
    getToken: (folderID: string | number) => Promise<Token>,
    onAction: (MessageActions, ...Array<any>) => any,
    params: PreviewTitleBodyTwoButtonsParams,
};

const handleButtonClick = (onAction, button) => {
    if (button) {
        onAction(button.actions);
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
                                <Button data-resin-target="cta2" onClick={() => handleButtonClick(onAction, button2)}>
                                    {button2.label}
                                </Button>
                            )}
                            <PrimaryButton
                                data-resin-target="cta1"
                                onClick={() => handleButtonClick(onAction, button1)}
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
