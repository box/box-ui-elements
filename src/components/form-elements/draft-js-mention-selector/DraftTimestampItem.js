// @flow
import * as React from 'react';
import './DraftTimeStamp.scss';

type Props = {
    children: React.Node,
    entityKey: string,
    contentState: Object,
};

const DraftTimestampItem = ({ children, entityKey, contentState }: Props) => {
    const entity = contentState.getEntity(entityKey);
    const { timestamp } = entity.getData();
    return (
        <div
            className="bcs-CommentTimestamp-entity"
            title={`Video timestamp: ${timestamp}`}
            contentEditable={false}
            suppressContentEditableWarning={true}
        >
            {children}
        </div>
    );
};

export default DraftTimestampItem;
