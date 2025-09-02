// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import './DraftTimeStamp.scss';

type Props = {
    children: React.Node,
    entityKey: string,
    contentState: Object,
};

const DraftTimestampItem = ({ children, entityKey, contentState }: Props) => {
    const intl = useIntl();
    const entity = contentState.getEntity(entityKey);
    const { timestamp } = entity.getData();
    const videoTimestampLabel = intl.formatMessage(messages.commentTimestampLabel);
    const videoTimestampLabelText = `${videoTimestampLabel}: ${timestamp}`;
    console.log('videoTimestampLabelText', videoTimestampLabel);
    return (
        <div
            className="bcs-CommentTimestamp-entity"
            title={videoTimestampLabelText}
            aria-label={videoTimestampLabelText}
            contentEditable={false}
            suppressContentEditableWarning={true}
        >
            {children}
        </div>
    );
};

export default DraftTimestampItem;
