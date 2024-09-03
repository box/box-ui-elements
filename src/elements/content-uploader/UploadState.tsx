import * as React from 'react';
import classNames from 'classnames';
import { useIntl, FormattedMessage } from 'react-intl';
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
    onSelect: () => void;
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
    const intl = useIntl();
    let icon;
    let content;
    switch (view) {
        case VIEW_ERROR:
            icon = <HatWand aria-label={intl.formatMessage(messages.uploadErrorState)} height={126} width={130} />;
            content = <UploadStateContent message={<FormattedMessage {...messages.uploadError} />} />;
            break;
        case VIEW_UPLOAD_EMPTY:
            icon = <UploadEmptyState title={<FormattedMessage {...messages.uploadEmptyState} />} />;
            /* eslint-disable no-nested-ternary */
            content =
                canDrop && hasItems ? (
                    <UploadStateContent message={<FormattedMessage {...messages.uploadInProgress} />} />
                ) : isTouch ? (
                    <UploadStateContent
                        fileInputLabel={<FormattedMessage {...messages.uploadNoDragDrop} />}
                        onChange={onSelect}
                        useButton
                    />
                ) : (
                    <UploadStateContent
                        fileInputLabel={<FormattedMessage {...messages.uploadEmptyFileInput} />}
                        folderInputLabel={
                            isFolderUploadEnabled && <FormattedMessage {...messages.uploadEmptyFolderInput} />
                        }
                        message={
                            isFolderUploadEnabled ? (
                                <FormattedMessage {...messages.uploadEmptyWithFolderUploadEnabled} />
                            ) : (
                                <FormattedMessage {...messages.uploadEmptyWithFolderUploadDisabled} />
                            )
                        }
                        onChange={onSelect}
                    />
                );
            /* eslint-enable no-nested-ternary */
            break;
        case VIEW_UPLOAD_IN_PROGRESS:
            icon = <UploadEmptyState title={<FormattedMessage {...messages.uploadEmptyState} />} />;
            content = <UploadStateContent message={<FormattedMessage {...messages.uploadInProgress} />} />;
            break;
        case VIEW_UPLOAD_SUCCESS:
            icon = <UploadSuccessState title={<FormattedMessage {...messages.uploadSuccessState} />} />;
            content = (
                <UploadStateContent
                    fileInputLabel={<FormattedMessage {...messages.uploadSuccessFileInput} />}
                    folderInputLabel={
                        isFolderUploadEnabled && <FormattedMessage {...messages.uploadSuccessFolderInput} />
                    }
                    message={<FormattedMessage {...messages.uploadSuccess} />}
                    onChange={onSelect}
                    useButton={isTouch}
                />
            );
            break;
        default:
            break;
        /* eslint-enable jsx-a11y/label-has-for */
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
