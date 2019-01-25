// @flow
import * as React from 'react';
import { ContentState } from 'draft-js';

type Props = {
    children: React.Node, // React.ChildrenArray<React.Element<any>> unsupported by babel-plugin-flow-react-proptypes
    contentState: ContentState,
    entityKey: string,
};

const DraftMentionItem = ({ contentState, entityKey, children }: Props) => {
    const { id } = contentState.getEntity(entityKey).getData();

    return <a href={`/profile/${id}`}>{children}</a>;
};

export default DraftMentionItem;
