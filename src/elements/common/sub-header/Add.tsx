import * as React from 'react';
import { useIntl } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Plus } from '@box/blueprint-web-assets/icons/Fill';

import messages from '../messages';

export interface AddProps {
    isDisabled: boolean;
    onCreate: () => void;
    onUpload: () => void;
    showCreate: boolean;
    showUpload: boolean;
}

const Add = ({ isDisabled, onUpload, onCreate, showUpload = true, showCreate = true }: AddProps) => {
    const { formatMessage } = useIntl();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton
                    aria-label={formatMessage(messages.add)}
                    className="be-btn-add"
                    disabled={isDisabled}
                    icon={Plus}
                />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {showUpload && (
                    <DropdownMenu.Item onClick={onUpload}>{formatMessage(messages.upload)}</DropdownMenu.Item>
                )}
                {showCreate && (
                    <DropdownMenu.Item onClick={onCreate}>{formatMessage(messages.newFolder)}</DropdownMenu.Item>
                )}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default Add;
