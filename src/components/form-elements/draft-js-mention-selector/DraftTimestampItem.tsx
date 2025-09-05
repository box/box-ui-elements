import * as React from 'react';
import { useIntl } from 'react-intl';
import { ContentState, EntityInstance } from 'draft-js';
import messages from './messages';
import './DraftTimestamp.scss';

interface Props {
    children: React.ReactNode;
    entityKey: string;
    contentState: ContentState;
}

interface TimestampEntityData {
    timestamp: string;
}

const DraftTimestampItem: React.FC<Props> = ({ children, entityKey, contentState }) => {
    const { formatMessage } = useIntl();
    const entity: EntityInstance = contentState.getEntity(entityKey);
    const { timestamp }: TimestampEntityData = entity.getData();
    const videoTimestampLabel = formatMessage(messages.commentTimestampLabel);
    const videoTimestampLabelText = `${videoTimestampLabel}: ${timestamp}`;
    return (
        <div
            className="bcs-CommentTimestamp-entity"
            aria-label={videoTimestampLabelText}
            contentEditable={false}
            suppressContentEditableWarning={true}
        >
            {children}
        </div>
    );
};

export default DraftTimestampItem;
