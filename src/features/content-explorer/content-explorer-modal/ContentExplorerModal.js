/* @flow */
import * as React from 'react';
import classNames from 'classnames';

import Column from '@box/react-virtualized/dist/commonjs/Table/Column';
import ContentExplorer from '../content-explorer';
import { Modal } from '../../../components/modal';

import type { BreadcrumbProps } from '../../../components/breadcrumb/Breadcrumb';

import './ContentExplorerModal.scss';

type Props = {
    additionalColumns?: Array<React.ComponentType<Column>>,
    breadcrumbProps?: BreadcrumbProps,
    className?: string,
    controlledSelectedItems?: Object,
    customInput?: React.ComponentType<any>,
    description?: string,
    hasFolderTreeBreadcrumbs: boolean,
    includeSubfoldersProps?: Object,
    isNoSelectionAllowed?: boolean,
    isOpen?: boolean,
    isResponsive?: boolean,
    itemButtonRenderer: Function,
    itemRowHeight?: number,
    itemRowRenderer?: Function,
    listHeaderHeight?: number,
    listHeaderRenderer?: Function,
    onFoldersPathUpdate?: Function,
    onRequestClose?: Function,
    onSelectItem?: (item: Object, index: number) => void,
    onSelectedClick?: () => void,
    onSelectedItemsUpdate?: Function,
    onViewSelectedClick?: Function,
    shouldNotUsePortal?: boolean,
    title?: string,
    infoNoticeText?: string,
    noItemsRenderer?: Function,
};

const ContentExplorerModal = ({
    breadcrumbProps = {},
    className = '',
    customInput,
    title = '',
    description = '',
    isOpen = false,
    isResponsive = false,
    onRequestClose,
    onSelectedClick,
    onSelectItem,
    shouldNotUsePortal = false,
    infoNoticeText = '',
    ...rest
}: Props) => (
    <Modal
        title={title}
        className={classNames('content-explorer-modal', className, {
            'bdl-ContentExplorerModal--responsive': isResponsive,
        })}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        shouldNotUsePortal={shouldNotUsePortal}
    >
        {description}
        <ContentExplorer
            breadcrumbProps={breadcrumbProps}
            customInput={customInput}
            isResponsive={isResponsive}
            onCancelButtonClick={onRequestClose}
            onSelectedClick={onSelectedClick}
            onSelectItem={onSelectItem}
            listWidth={560}
            listHeight={285}
            infoNoticeText={infoNoticeText}
            {...rest}
        />
    </Modal>
);

export default ContentExplorerModal;
