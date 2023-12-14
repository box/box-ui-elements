// @flow
import * as React from 'react';
import { useArgs } from '@storybook/preview-api';

import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import { ACCESS_OPEN } from '../../../constants';
import { addRootElement } from '../../../utils/storybook';

import ShareDialog from '../ShareDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../common/modal.scss';

export const shareDialog = {
    render: args => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [, setArgs] = useArgs();

        const handleOpenModal = () => setArgs({ isOpen: true });

        const handleCloseModal = () => setArgs({ isOpen: false });

        const { appElement, rootElement } = addRootElement();

        return (
            <div>
                <ShareDialog
                    appElement={appElement}
                    item={{
                        id: 'abcdefg',
                        shared_link: {
                            access: ACCESS_OPEN,
                            url: 'https://cloud.box.com/s/abcdefg',
                        },
                    }}
                    onCancel={handleCloseModal}
                    parentElement={rootElement}
                    {...args}
                />
                <PrimaryButton onClick={handleOpenModal}>Launch ShareDialog</PrimaryButton>
            </div>
        );
    },
};

export default {
    title: 'Elements/ContentExplorer',
    component: ShareDialog,
    args: {
        canSetShareAccess: false,
        isLoading: false,
        isOpen: false,
    },
};
