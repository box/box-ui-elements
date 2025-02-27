import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Plus } from '@box/blueprint-web-assets/icons/Fill';

import messages from '../messages';

type AddProps = {
    isDisabled?: boolean;
    onCreate: React.MouseEventHandler<HTMLDivElement>;
    onUpload: React.MouseEventHandler<HTMLDivElement>;
    showCreate: boolean;
    showUpload: boolean;
};

const Add = ({ onUpload, onCreate, showUpload = true, showCreate = true }: AddProps) => (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <IconButton aria-label={messages.add.defaultMessage} className="be-btn-add" icon={Plus} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            {showUpload && (
                <DropdownMenu.Item onClick={onUpload}>
                    <FormattedMessage {...messages.upload} />
                </DropdownMenu.Item>
            )}
            {showCreate && (
                <DropdownMenu.Item onClick={onCreate}>
                    <FormattedMessage {...messages.newFolder} />
                </DropdownMenu.Item>
            )}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
);

export default Add;
