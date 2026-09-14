import * as React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import './DraftTimestamp.scss';

export interface DraftTimestampItemProps {
    /** Decorated timestamp text nodes */
    children: React.ReactNode;
}

const DraftTimestampItem = ({ children }: DraftTimestampItemProps) => {
    const { formatMessage } = useIntl();
    const videoTimestampLabel = formatMessage(messages.commentTimestampLabel);
    return (
        <div
            className="bcs-CommentTimestamp-entity"
            aria-label={videoTimestampLabel}
            contentEditable={false}
            suppressContentEditableWarning
        >
            {children}
        </div>
    );
};

export default DraftTimestampItem;
