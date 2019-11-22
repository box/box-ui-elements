/**
 * @flow
 * @file Upload state component
 */

import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import ErrorEmptyState from '../../icons/states/ErrorEmptyState';
import UploadIllustration from '../../icons/illustrations/UploadIllustration';
import UploadSuccessState from '../../icons/states/UploadSuccessState';
import messages from '../common/messages';
import Browser from '../../utils/Browser';
import UploadStateContent from './UploadStateContent';
import { VIEW_ERROR, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS } from '../../constants';

import './UploadState.scss';
import './UploadStateV2.scss';

type Props = {
    canDrop: boolean,
    hasItems: boolean,
    isFolderUploadEnabled: boolean,
    isOver: boolean,
    isTouch: boolean,
    onSelect: Function,
    view: View,
};

const UploadStateV2 = ({ canDrop, hasItems, isOver, isTouch, view, onSelect, isFolderUploadEnabled }: Props) => {
    let icon;
    let content;
    switch (view) {
        case VIEW_ERROR:
            icon = <ErrorEmptyState />;
            content = <UploadStateContent message={<FormattedMessage {...messages.uploadError} />} />;
            break;
        case VIEW_UPLOAD_EMPTY:
            if (!hasItems) {
                icon = isOver ? <UploadIllustration width={200} height={200} /> : <UploadIllustration />;
            }
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
                        fileInputLabel={<FormattedMessage {...messages.uploadEmptyFileInputV2} />}
                        folderInputLabel={
                            isFolderUploadEnabled && <FormattedMessage {...messages.uploadEmptyFolderInput} />
                        }
                        message={
                            !Browser.isIE() &&
                            (isFolderUploadEnabled ? (
                                <FormattedMessage {...messages.uploadEmptyWithFolderUploadEnabled} />
                            ) : (
                                <FormattedMessage {...messages.uploadEmptyWithFolderUploadDisabled} />
                            ))
                        }
                        onChange={onSelect}
                        useButton
                    />
                );
            /* eslint-enable no-nested-ternary */
            break;
        case VIEW_UPLOAD_IN_PROGRESS:
            icon = <UploadIllustration />;
            content = <UploadStateContent message={<FormattedMessage {...messages.uploadInProgress} />} />;
            break;
        case VIEW_UPLOAD_SUCCESS:
            icon = <UploadSuccessState />;
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

export default UploadStateV2;
