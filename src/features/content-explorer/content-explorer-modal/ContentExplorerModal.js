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
    isResponsive?: boolean,
    onRequestClose?: Function,
    onSelectItem?: (item: Object, index: number) => void,
    onSelectedClick?: () => void,
    title?: string,
};

const ContentExplorerModal = ({
    className = '',
    customInput,
    title = '',
    description = '',
    isOpen = false,
    isResponsive = false,
    onRequestClose,
    onSelectedClick,
    onSelectItem,
    ...rest
}: Props) => (
    <Modal
        title={title}
        className={classNames('content-explorer-modal', className, {
            'bdl-ContentExplorerModal--responsive': isResponsive,
        })}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
    >
        {description}
        <ContentExplorer
            customInput={customInput}
            isResponsive={isResponsive}
            onCancelButtonClick={onRequestClose}
            onSelectedClick={onSelectedClick}
            onSelectItem={onSelectItem}
            listWidth={560}
            listHeight={285}
            {...rest}
        />
    </Modal>
);

export default ContentExplorerModal;
