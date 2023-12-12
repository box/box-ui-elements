// @flow
import * as React from 'react';
import { useArgs } from '@storybook/preview-api';

import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import { ACCESS_OPEN } from '../../../constants';

import ShareDialog from '../ShareDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../common/modal.scss';

const rootElement = document.createElement('div');

export const shareDialog = {
    render: args => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [, setArgs] = useArgs();

        const handleOpenModal = () => setArgs({ isOpen: true });

        const handleCloseModal = () => setArgs({ isOpen: false });

        if (document.body && document.getElementById('rootElement') === null) {
            rootElement.setAttribute('id', 'rootElement');
            document.body.appendChild(rootElement);
        }

        return (
            <div>
                <ShareDialog
                    {...args}
                    item={{
                        id: 'abcdefg',
                        shared_link: {
                            access: ACCESS_OPEN,
                            url: 'https://cloud.box.com/s/abcdefg',
                        },
                    }}
                    onCancel={handleCloseModal}
                    parentElement={rootElement}
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
