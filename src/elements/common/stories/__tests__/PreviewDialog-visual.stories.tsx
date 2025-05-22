import * as React from 'react';

import { expect, screen, userEvent, within } from '@storybook/test';
import { Button } from '@box/blueprint-web';
import { useArgs } from '@storybook/preview-api';
import PreviewDialog from '../../preview-dialog';

import { addRootElement } from '../../../../utils/storybook';

// need to import this into the story because it's usually in ContentExplorer

import '../../modal.scss';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button', { name: 'Launch PreviewDialog' });
        await userEvent.click(button);

        expect(await screen.findByText('Book Sample.pdf')).toBeInTheDocument();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [, setArgs] = useArgs();

        const handleOpenModal = () => setArgs({ isOpen: true });

        const handleCloseModal = () => {
            setArgs({ isOpen: false });
        };

        const { appElement, rootElement } = addRootElement();

        return (
            <div>
                <PreviewDialog
                    appElement={appElement}
                    item={{
                        type: 'file',
                        id: '416044542013',
                        name: 'Book Sample.pdf',
                    }}
                    onCancel={handleCloseModal}
                    parentElement={rootElement}
                    currentCollection={{
                        items: [
                            {
                                type: 'file',
                                id: '416044542013',
                                name: 'Book Sample.pdf',
                                extension: 'pdf',
                                permissions: {
                                    can_download: true,
                                    can_preview: true,
                                    can_upload: false,
                                    can_comment: true,
                                    can_rename: false,
                                    can_delete: false,
                                    can_share: false,
                                    can_set_share_access: false,
                                    can_invite_collaborator: false,
                                    can_annotate: false,
                                    can_view_annotations_all: true,
                                    can_view_annotations_self: true,
                                    can_create_annotations: true,
                                    can_view_annotations: true,
                                },
                                has_collaborations: true,
                            },
                        ],
                    }}
                    {...args}
                />

                <Button onClick={handleOpenModal} variant="primary">
                    Launch PreviewDialog
                </Button>
            </div>
        );
    },
};

export default {
    title: 'Elements/Common/tests/PreviewDialog/visual',
    component: PreviewDialog,
    args: {
        token: global.TOKEN,
    },
};
