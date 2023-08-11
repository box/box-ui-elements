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
    title?: string,
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
    ...rest
}: Props) => (
    <Modal
        className={classNames('content-explorer-modal', className, {
            'bdl-ContentExplorerModal--responsive': isResponsive,
        })}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={title}
    >
        {description}
        <ContentExplorer
            breadcrumbProps={breadcrumbProps}
            customInput={customInput}
            isResponsive={isResponsive}
            listHeight={285}
            listWidth={560}
            onCancelButtonClick={onRequestClose}
            onSelectedClick={onSelectedClick}
            onSelectItem={onSelectItem}
            {...rest}
        />
    </Modal>
);

export default ContentExplorerModal;
