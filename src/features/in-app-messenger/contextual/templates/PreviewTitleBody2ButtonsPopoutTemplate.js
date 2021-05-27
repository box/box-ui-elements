// @flow

/**
 * This component is intended to be passed to TemplateContainer as templateComponent prop, like this:
 *   <TemplateContainer templateID='my-template' templateComponent=MyTemplate/>
 */

import * as React from 'react';

import Button from '../../../../components/button/Button';
import Overlay from '../../../../components/flyout/Overlay';
import MessagePreviewContent from '../../../message-center/components/templates/common/MessagePreviewContent';

import { type PreviewTitleBody2ButtonsPopoutParams } from '../../types';

import './styles/PreviewTitleBody2ButtonsPopoutTemplate.scss';

type Props = {
    apiHost: string,
    contentPreviewProps?: ContentPreviewProps,
    getToken: (folderID: string | number) => void,
    onAction: Function,
    params: PreviewTitleBody2ButtonsPopoutParams,
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

const PreviewTitleBody2ButtonsPopoutTemplate = ({
    apiHost,
    contentPreviewProps,
    getToken,
    onAction,
    params: { body, button1, button2, fileUpload: { fileId, sharedLinkUrl } = {}, title },
}: Props) => {
    return (
        <div className="bdl-PreviewTitleBody2ButtonsPopoutTemplate">
            <Overlay>
                <div className="content-container">
                    <div className="preview-container">
                        <MessagePreviewContent
                            apiHost={apiHost}
                            contentPreviewProps={contentPreviewProps}
                            fileId={fileId}
                            getToken={getToken}
                            sharedLink={sharedLinkUrl}
                        />
                    </div>
                    <div className="main-container">
                        {/* eslint-disable react/no-danger */}
                        <div
                            className="title"
                            dangerouslySetInnerHTML={{
                                __html: title,
                            }}
                        />
                        <div
                            className="body"
                            dangerouslySetInnerHTML={{
                                __html: body,
                            }}
                        />
                        {/* eslint-enable react/no-danger */}
                        <div className="buttons">
                            {button2 && (
                                <Button data-resin-target="cta2" onClick={() => handleButton2Click(onAction, button2)}>
                                    {button2.label}
                                </Button>
                            )}
                            <Button
                                className="btn-primary"
                                data-resin-target="cta1"
                                onClick={() => handleButton1Click(onAction, button1)}
                            >
                                {button1.label}
                            </Button>
                        </div>
                    </div>
                </div>
            </Overlay>
        </div>
    );
};

export default PreviewTitleBody2ButtonsPopoutTemplate;
