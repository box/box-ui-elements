import * as React from 'react';
import { ContentState } from 'draft-js';

export interface DraftMentionItemProps {
    /** Decorated mention text nodes */
    children: React.ReactNode;
    /** DraftJS content state that holds the mention entity */
    contentState: ContentState;
    /** Decorated mention text provided by DraftJS */
    decoratedText: string;
    /** Entity key for the mention */
    entityKey?: string;
}

const DraftMentionItem = ({ contentState, entityKey, children }: DraftMentionItemProps) => {
    let id = '';
    if (entityKey) {
        id = contentState.getEntity(entityKey).getData().id;
    }

    return <a href={`/profile/${id}`}>{children}</a>;
};

export default DraftMentionItem;
