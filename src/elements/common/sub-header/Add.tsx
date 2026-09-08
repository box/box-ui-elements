import * as React from 'react';
import { useIntl } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Plus } from '@box/blueprint-web-assets/icons/Fill';

import messages from '../messages';

export interface AddProps {
    isDisabled: boolean;
    onCreate: () => void;
    onUpload: () => void;
    portalElement?: HTMLElement;
    showCreate: boolean;
    showUpload: boolean;
}

const Add = ({ isDisabled, onUpload, onCreate, portalElement, showCreate = true, showUpload = true }: AddProps) => {
    const { formatMessage } = useIntl();
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger ref={triggerRef}>
                <IconButton
                    aria-label={formatMessage(messages.add)}
                    className="be-btn-add"
                    disabled={isDisabled}
                    icon={Plus}
                />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                container={portalElement}
                onCloseAutoFocus={event => {
                    event.preventDefault();
                    triggerRef.current?.focus({ preventScroll: true });
                }}
                // @ts-ignore next line - onOpenAutoFocus is intentionally stripped from DropdownMenuContentProps via Omit<MenuContentImplPrivateProps> in Radix's types, but it IS wired at runtime because DropdownMenuContentImpl spreads all props through to MenuContent, which passes it directly to FocusScope as onMountAutoFocus.
                onOpenAutoFocus={(event: Event) => {
                    event.preventDefault();
                    (event.currentTarget as HTMLElement | null)?.focus({ preventScroll: true });
                }}
            >
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
