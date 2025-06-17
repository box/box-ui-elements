import * as React from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '@box/blueprint-web';

import { addRootElement } from '../../../utils/storybook';

import RenameDialog, { RenameDialogProps } from '../RenameDialog';

export const renameDialog = {
    render: (args: RenameDialogProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [, setArgs] = useArgs();

        const handleOpenModal = () => setArgs({ isOpen: true });

        const handleCloseModal = () => {
            setArgs({ isOpen: false });
        };

        const { appElement, rootElement } = addRootElement();

        return (
            <div>
                <RenameDialog
                    appElement={appElement}
                    item={{
                        id: '123456',
                        name: 'mockItem',
                    }}
                    onCancel={handleCloseModal}
                    parentElement={rootElement}
                    {...args}
                />
                <Button onClick={handleOpenModal} variant="primary">
                    Launch RenameDialog
                </Button>
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
