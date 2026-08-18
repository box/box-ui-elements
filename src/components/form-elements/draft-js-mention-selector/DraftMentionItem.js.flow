// @flow
import * as React from 'react';
import { ContentState } from 'draft-js';

type Props = {
    children: React.Node, // React.ChildrenArray<React.Element<any>> unsupported by babel-plugin-flow-react-proptypes
    contentState: ContentState,
    decoratedText: string,
    entityKey?: string,
};

const DraftMentionItem = ({ contentState, entityKey, children }: Props) => {
    let id = '';
    if (entityKey) {
        id = contentState.getEntity(entityKey).getData().id;
    }

    return <a href={`/profile/${id}`}>{children}</a>;
};

export default DraftMentionItem;
