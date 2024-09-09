import * as React from 'react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { HatWand } from '@box/blueprint-web-assets/illustrations/Medium';

import UploadEmptyState from '../../icons/states/UploadEmptyState';
import UploadSuccessState from '../../icons/states/UploadSuccessState';
import UploadStateContent from './UploadStateContent';
import type { View } from '../../common/types/core';

import { VIEW_ERROR, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS } from '../../constants';

import messages from '../common/messages';

import './UploadState.scss';

export interface UploadStateProps {
    canDrop: boolean;
    hasItems: boolean;
    isFolderUploadEnabled: boolean;
    isOver: boolean;
    isTouch: boolean;
    onSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    view: View;
}

const UploadState = ({
    canDrop,
    hasItems,
    isOver,
    isTouch,
    view,
    onSelect,
    isFolderUploadEnabled,
}: UploadStateProps) => {
    const { formatMessage } = useIntl();
    let icon;
    let content;
    switch (view) {
        case VIEW_ERROR:
            icon = <HatWand aria-label={formatMessage(messages.uploadErrorState)} height={126} width={130} />;
            content = <UploadStateContent message={formatMessage(messages.uploadError)} />;
            break;
        case VIEW_UPLOAD_EMPTY:
            icon = <UploadEmptyState title={formatMessage(messages.uploadEmptyState)} />;
            /* eslint-disable no-nested-ternary */
            content =
                canDrop && hasItems ? (
                    <UploadStateContent message={formatMessage(messages.uploadInProgress)} />
                ) : isTouch ? (
                    <UploadStateContent
                        fileInputLabel={formatMessage(messages.uploadNoDragDrop)}
                        onChange={onSelect}
                        useButton
                    />
                ) : (
                    <UploadStateContent
                        fileInputLabel={formatMessage(messages.uploadEmptyFileInput)}
                        folderInputLabel={isFolderUploadEnabled && formatMessage(messages.uploadEmptyFolderInput)}
                        message={
                            isFolderUploadEnabled
                                ? formatMessage(messages.uploadEmptyWithFolderUploadEnabled)
                                : formatMessage(messages.uploadEmptyWithFolderUploadDisabled)
                        }
                        onChange={onSelect}
                    />
                );
            /* eslint-enable no-nested-ternary */
            break;
        case VIEW_UPLOAD_IN_PROGRESS:
            icon = <UploadEmptyState title={formatMessage(messages.uploadEmptyState)} />;
            content = <UploadStateContent message={formatMessage(messages.uploadInProgress)} />;
            break;
        case VIEW_UPLOAD_SUCCESS:
            icon = <UploadSuccessState title={formatMessage(messages.uploadSuccessState)} />;
            content = (
                <UploadStateContent
                    fileInputLabel={formatMessage(messages.uploadSuccessFileInput)}
                    folderInputLabel={isFolderUploadEnabled && formatMessage(messages.uploadSuccessFolderInput)}
                    message={formatMessage(messages.uploadSuccess)}
                    onChange={onSelect}
                    useButton={isTouch}
                />
            );
            break;
        default:
            break;
    }

    const className = classNames('bcu-upload-state', {
        'bcu-is-droppable': isOver && canDrop,
        'bcu-is-not-droppable': isOver && !canDrop,
        'bcu-has-items': hasItems,
    });

    return (
        <div className={className}>
            <div>
                {icon}
                {content}
            </div>
            <div className="bcu-drag-drop-overlay" />
        </div>
    );
};

export default UploadState;
