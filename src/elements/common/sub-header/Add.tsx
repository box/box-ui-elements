/**
 * @file Add component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import IconAddThin from '../../../icons/general/IconAddThin';

import messages from '../messages';

interface AddProps {
    isDisabled?: boolean;
    onCreate: (event: React.MouseEvent<HTMLDivElement>) => void;
    onUpload: (event: React.MouseEvent<HTMLDivElement>) => void;
    showCreate: boolean;
    showUpload: boolean;
}

const Add = ({ onCreate, onUpload, showCreate, showUpload, isDisabled = false }: AddProps) => (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <IconButton
                aria-label={messages.add.defaultMessage}
                className="be-btn-add"
                disabled={isDisabled}
                icon={IconAddThin}
            />
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
