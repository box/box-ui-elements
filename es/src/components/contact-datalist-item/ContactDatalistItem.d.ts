import * as React from 'react';
import { ContactType } from '../../features/unified-share-modal/types';
import { SuggestedPillType } from '../pill-selector-dropdown/types';
import './ContactDatalistItem.scss';
export interface ContactDatalistItemProps {
    getContactAvatarUrl?: (contact: ContactType) => string | Promise<string | null | undefined>;
    getPillImageUrl?: (data: SuggestedPillType) => string | Promise<string>;
    id?: string;
    isExternal?: boolean;
    name: string | null | undefined;
    showAvatar?: boolean;
    subtitle?: React.ReactNode;
    type?: string | null | undefined;
}
interface ContactDatalistItemState {
    avatarUrl: string | null | undefined;
}
declare class ContactDatalistItem extends React.PureComponent<ContactDatalistItemProps, ContactDatalistItemState> {
    constructor(props: ContactDatalistItemProps);
    isMounted: boolean;
    /**
     * Success handler for getting avatar url
     *
     * @param {string} [avatarUrl] the user avatar url
     */
    getAvatarUrlHandler: (avatarUrl: string | null | undefined) => void;
    /**
     * Gets the avatar URL for the user from the getContactAvatarUrl prop
     *
     * @return {void}
     */
    getAvatarUrl(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}
export default ContactDatalistItem;
