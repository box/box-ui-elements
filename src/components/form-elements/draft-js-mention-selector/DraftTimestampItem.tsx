import * as React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import './DraftTimestamp.scss';

interface Props {
    children: React.ReactNode;
}

const DraftTimestampItem: React.FC<Props> = ({ children }) => {
    const { formatMessage } = useIntl();
    const videoTimestampLabel = formatMessage(messages.commentTimestampLabel);
    return (
        <div
            className="bcs-CommentTimestamp-entity"
            aria-label={videoTimestampLabel}
            contentEditable={false}
            suppressContentEditableWarning={true}
        >
            {children}
        </div>
    );
};

export default DraftTimestampItem;
