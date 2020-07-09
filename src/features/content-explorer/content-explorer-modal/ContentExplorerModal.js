/* @flow */
import * as React from 'react';
import classNames from 'classnames';

import { Modal } from '../../../components/modal';

import ContentExplorer from '../content-explorer';

import './ContentExplorerModal.scss';

type Props = {
    className?: string,
    customInput?: React.ComponentType<any>,
    description?: string,
    isOpen?: boolean,
    onRequestClose?: Function,
    onSelectedClick?: () => void,
    title?: string,
};

const ContentExplorerModal = ({
    className = '',
    customInput,
    title = '',
    description = '',
    isOpen = false,
    onRequestClose,
    onSelectedClick,
    ...rest
}: Props) => (
    <Modal
        title={title}
        className={classNames('content-explorer-modal', className)}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
    >
        {description}
        <ContentExplorer
            customInput={customInput}
            onCancelButtonClick={onRequestClose}
            onSelectedClick={onSelectedClick}
            listWidth={560}
            listHeight={285}
            {...rest}
        />
    </Modal>
);

export default ContentExplorerModal;
