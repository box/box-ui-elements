/**
 * @flow
 * @file Read only transcript row component
 * @author Box
 */

import * as React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';

type Props = {
    time?: string,
    text?: string,
    onClick: Function,
    interactionTarget: string
};

const ReadOnlyTranscriptRow = ({ time, text = '', onClick, interactionTarget }: Props) => (
    <PlainButton type="button" className="be-transcript-row" data-resin-target={interactionTarget} onClick={onClick}>
        {time && <div className="be-transcript-time">{time}</div>}
        <div className="be-transcript-text">{text}</div>
    </PlainButton>
);

export default ReadOnlyTranscriptRow;
