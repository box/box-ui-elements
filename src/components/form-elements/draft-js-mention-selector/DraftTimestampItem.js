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
        <span className="timestamp-item" title={`Video timestamp: ${timestamp}`}>
            asdfasdf
            {children}
        </span>
    );
};

export default DraftTimestampItem;
