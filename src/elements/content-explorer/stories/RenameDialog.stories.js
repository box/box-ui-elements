// @flow
import * as React from 'react';
import { useArgs } from '@storybook/preview-api';

import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import { addRootElement } from '../../../utils/storybook';

import RenameDialog from '../RenameDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../common/modal.scss';

export const renameDialog = {
    // eslint-disable-next-line react/prop-types
    render: (args: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [, setArgs] = useArgs();

        const handleOpenModal = () => setArgs({ isOpen: true });

        const handleCloseModal = () => {
            setArgs({ isOpen: false });
        };

        const { rootElement } = addRootElement();

        return (
            <div>
                <RenameDialog
                    item={{
                        id: '123456',
                        name: 'mockItem',
                        type: 'file',
                    }}
                    onCancel={handleCloseModal}
                    parentElement={rootElement}
                    {...args}
                />

                <PrimaryButton onClick={handleOpenModal}>Launch RenameDialog</PrimaryButton>
            </div>
        );
    },
};

export default {
    title: 'Elements/ContentExplorer',
    component: RenameDialog,
    args: {
        isLoading: false,
        isOpen: false,
    },
};
