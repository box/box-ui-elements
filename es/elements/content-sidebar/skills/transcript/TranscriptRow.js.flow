/**
 * @flow
 * @file Transcript row component
 * @author Box
 */

import * as React from 'react';
import { formatTime } from '../../../../utils/datetime';
import ReadOnlyTranscriptRow from './ReadOnlyTranscriptRow';
import EditingTranscriptRow from './EditingTranscriptRow';
import { isValidTimeSlice } from './timeSliceUtils';
import type { SkillCardEntryTimeSlice } from '../../../../common/types/skills';

import './TranscriptRow.scss';

type Props = {
    appears?: Array<SkillCardEntryTimeSlice>,
    interactionTarget: string,
    isEditing: boolean,
    onCancel: Function,
    onChange: Function,
    onClick: Function,
    onSave: Function,
    text?: string,
};

const TranscriptRow = ({ appears, text, isEditing, onClick, onSave, onCancel, onChange, interactionTarget }: Props) => {
    const isValid = isValidTimeSlice(appears) && Array.isArray(appears) && appears.length === 1;
    const timeSlice = ((appears: any): Array<SkillCardEntryTimeSlice>);
    const start = isValid ? formatTime(timeSlice[0].start) : undefined;

    return isEditing ? (
        <EditingTranscriptRow onCancel={onCancel} onChange={onChange} onSave={onSave} text={text} time={start} />
    ) : (
        <ReadOnlyTranscriptRow interactionTarget={interactionTarget} onClick={onClick} text={text} time={start} />
    );
};

export default TranscriptRow;
