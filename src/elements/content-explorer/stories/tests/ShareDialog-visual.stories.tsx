import * as React from 'react';

import { ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN } from '../../../../constants';
import { addRootElement, defaultVisualConfig } from '../../../../utils/storybook';

import ShareDialog, { ShareDialogProps } from '../../ShareDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../../common/modal.scss';

const item = {
    id: 'abcdefg',
    shared_link: {
        access: ACCESS_OPEN,
        url: 'https://cloud.box.com/s/abcdefg',
    },
};

export const shareDialogNotLoading = {
    render: (args: ShareDialogProps) => {
        const { appElement, rootElement } = addRootElement();

        return (
            <ShareDialog
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

export const shareDialogIsLoading = {
    render: (args: ShareDialogProps) => {
        const { appElement, rootElement } = addRootElement();

        return (
            <ShareDialog appElement={appElement} isLoading isOpen item={item} parentElement={rootElement} {...args} />
        );
    },
};

export const shareDialogShareAccessSelect = {
    render: (args: ShareDialogProps) => {
        const { appElement, rootElement } = addRootElement();

        return (
            <ShareDialog
                appElement={appElement}
                canSetShareAccess
                isOpen
                item={{
                    allowed_shared_link_access_levels: [ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN],
                    id: 'abcdefg',
                    permissions: {
                        can_set_share_access: true,
                    },
                    shared_link: {
                        access: ACCESS_OPEN,
                        url: 'https://cloud.box.com/s/abcdefg',
                    },
                }}
                parentElement={rootElement}
                {...args}
            />
        );
    },
};

export default {
    title: 'Elements/ContentExplorer/tests/ShareDialog/visual',
    component: ShareDialog,
};
