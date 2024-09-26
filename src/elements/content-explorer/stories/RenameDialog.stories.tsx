import * as React from 'react';
import { useArgs } from '@storybook/preview-api';

import { Button } from '@box/blueprint-web';
import { addRootElement } from '../../../utils/storybook';

import RenameDialog from '../RenameDialog';

export const renameDialog = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
