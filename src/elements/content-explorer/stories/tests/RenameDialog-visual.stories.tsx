import * as React from 'react';

import { addRootElement } from '../../../../utils/storybook';

import RenameDialog, { RenameDialogProps } from '../../RenameDialog';
import {
    ERROR_CODE_ITEM_NAME_IN_USE,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
} from '../../../../constants';

import '../../../common/modal.scss';

const item = {
    id: '123456',
    name: 'mockItem',
};

const itemWithLongName = {
    id: '123456',
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Aliquam faucibus purus in massa tempor nec. Ut consequat semper viverra nam libero justo laoreet sit amet. Purus gravida quis blandit turpis cursus in hac. Dui ut ornare lectus sit amet est. Nisl condimentum id venenatis a condimentum vitae sapien ',
};

export const renameDialogNotLoading = {
    render: (args: RenameDialogProps) => {
        const { appElement, rootElement } = addRootElement();

        return (
            <RenameDialog
                appElement={appElement}
                isLoading={false}
                isOpen
                item={item}
                parentElement={rootElement}
                {...args}
            />
        );
    },
};

export const renameDialogIsLoading = {
    render: (args: RenameDialogProps) => {
        const { appElement, rootElement } = addRootElement();

        return (
            <RenameDialog appElement={appElement} isLoading isOpen item={item} parentElement={rootElement} {...args} />
        );
    },
};

export const renameDialogNameInvalidError = {
    render: (args: RenameDialogProps) => {
        const { appElement, rootElement } = addRootElement();

        return (
            <RenameDialog
                appElement={appElement}
                errorCode={ERROR_CODE_ITEM_NAME_INVALID}
                isLoading={false}
                isOpen
                item={item}
                parentElement={rootElement}
                {...args}
            />
        );
    },
};

export const renameDialogNameInUseError = {
    render: (args: RenameDialogProps) => {
        const { appElement, rootElement } = addRootElement();

        return (
            <RenameDialog
                appElement={appElement}
                errorCode={ERROR_CODE_ITEM_NAME_IN_USE}
                isLoading={false}
                isOpen
                item={item}
                parentElement={rootElement}
                {...args}
            />
        );
    },
};

export const renameDialogNameTooLongError = {
    render: (args: RenameDialogProps) => {
        const { appElement, rootElement } = addRootElement();

        return (
            <RenameDialog
                appElement={appElement}
                errorCode={ERROR_CODE_ITEM_NAME_TOO_LONG}
                isLoading={false}
                isOpen
                item={itemWithLongName}
                parentElement={rootElement}
                {...args}
            />
        );
    },
};

export default {
    title: 'Elements/ContentExplorer/tests/RenameDialog/visual',
    component: RenameDialog,
};
