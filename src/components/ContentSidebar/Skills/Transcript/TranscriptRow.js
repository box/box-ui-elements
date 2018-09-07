/**
 * @flow
 * @file Transcript row component
 * @author Box
 */

import React from 'react';
import { formatTime } from 'box-react-ui/lib/utils/datetime';
import ReadOnlyTranscriptRow from './ReadOnlyTranscriptRow';
import EditingTranscriptRow from './EditingTranscriptRow';
import { isValidTimeSlice } from './timeSliceUtils';

import './TranscriptRow.scss';

type Props = {
    isEditing: boolean,
    onClick: Function,
    onSave: Function,
    onCancel: Function,
    onChange: Function,
    text?: string,
    appears?: Array<SkillCardEntryTimeSlice>,
    interactionTarget: string,
};

const TranscriptRow = ({
    appears,
    text,
    isEditing,
    onClick,
    onSave,
    onCancel,
    onChange,
    interactionTarget,
}: Props) => {
    const isValid =
        isValidTimeSlice(appears) &&
        Array.isArray(appears) &&
        appears.length === 1;
    const timeSlice = ((appears: any): Array<SkillCardEntryTimeSlice>);
    const start = isValid ? formatTime(timeSlice[0].start) : undefined;

    return isEditing ? (
        <EditingTranscriptRow
            onSave={onSave}
            onCancel={onCancel}
            onChange={onChange}
            time={start}
            text={text}
        />
    ) : (
        <ReadOnlyTranscriptRow
            interactionTarget={interactionTarget}
            onClick={onClick}
            time={start}
            text={text}
        />
    );
};

export default TranscriptRow;
