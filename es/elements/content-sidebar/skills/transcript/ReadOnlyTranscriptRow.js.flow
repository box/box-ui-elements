/**
 * @flow
 * @file Read only transcript row component
 * @author Box
 */

import * as React from 'react';
import PlainButton from '../../../../components/plain-button/PlainButton';

type Props = {
    interactionTarget: string,
    onClick: Function,
    text?: string,
    time?: string,
};

const ReadOnlyTranscriptRow = ({ time, text = '', onClick, interactionTarget }: Props) => (
    <PlainButton className="be-transcript-row" data-resin-target={interactionTarget} onClick={onClick} type="button">
        {time && <div className="be-transcript-time">{time}</div>}
        <div className="be-transcript-text">{text}</div>
    </PlainButton>
);

export default ReadOnlyTranscriptRow;
