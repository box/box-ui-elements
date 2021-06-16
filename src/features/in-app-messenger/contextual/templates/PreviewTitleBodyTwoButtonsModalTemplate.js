// @flow

/**
 * This component is intended to be passed to TemplateContainer as templateComponent prop, like this:
 *   <TemplateContainer templateID='my-template' templateComponent=MyTemplate/>
 */

import * as React from 'react';

import PrimaryButton from '../../../../components/primary-button';
import { Modal, ModalActions } from '../../../../components/modal';
import Button from '../../../../components/button';
import MessagePreviewContent from '../../../message-preview-content/MessagePreviewContent';
import { messageActions } from '../../types/message-actions';
import { MessageActions, type PreviewTitleBodyTwoButtonsModalParams } from '../../types';

import './styles/PreviewTitleBodyTwoButtonsModalTemplate.scss';

type Props = {
    apiHost: string,
    contentPreviewProps?: ContentPreviewProps,
    getToken: (folderID: string | number) => Promise<Token>,
    onAction: (MessageActions, ...Array<any>) => any,
    params: PreviewTitleBodyTwoButtonsModalParams,
};

const handleClose = onAction => {
    onAction([messageActions.close]);
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

const PreviewTitleBodyTwoButtonsModalTemplate = ({
    apiHost,
    contentPreviewProps,
    getToken,
    onAction,
    params: { body, button1, button2, fileUpload: { fileId, sharedLinkUrl } = {}, title },
}: Props) => {
    return (
        <Modal
            className="bdl-PreviewTitleBodyTwoButtonsModalTemplate"
            closeButtonProps={{ 'data-resin-target': 'dismiss' }}
            isOpen
            onRequestClose={() => handleClose(onAction)}
            shouldNotUsePortal
            title=""
        >
            <div className="bdl-PreviewTitleBodyTwoButtonsModalTemplate-contentContainer">
                {/* eslint-disable react/no-danger */}
                <div
                    className="bdl-PreviewTitleBodyTwoButtonsModalTemplate-title"
                    dangerouslySetInnerHTML={{
                        __html: title,
                    }}
                />
                <div
                    className="bdl-PreviewTitleBodyTwoButtonsModalTemplate-body"
                    dangerouslySetInnerHTML={{
                        __html: body,
                    }}
                />
                {/* eslint-enable react/no-danger */}
                <div className="bdl-PreviewTitleBodyTwoButtonsModalTemplate-previewContainer">
                    <MessagePreviewContent
                        apiHost={apiHost}
                        contentPreviewProps={contentPreviewProps}
                        fileId={fileId}
                        getToken={getToken}
                        sharedLink={sharedLinkUrl}
                    />
                </div>
                <ModalActions>
                    <PrimaryButton data-resin-target="cta1" onClick={() => handleButton1Click(onAction, button1)}>
                        {button1.label}
                    </PrimaryButton>
                    {button2 && (
                        <Button data-resin-target="cta2" onClick={() => handleButton2Click(onAction, button2)}>
                            {button2.label}
                        </Button>
                    )}
                </ModalActions>
            </div>
        </Modal>
    );
};

export default PreviewTitleBodyTwoButtonsModalTemplate;
