/**
 * @flow
 * @file Editable transcript row component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TextareaAutosize from 'react-textarea-autosize';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import Button from '../../../../components/button/Button';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import './EditingTranscriptRow.scss';

type Props = {
    onCancel: Function,
    onChange: Function,
    onSave: Function,
    text?: string,
    time?: string,
};

const EditingTranscriptRow = ({ time, text = '', onSave, onCancel, onChange }: Props) => (
    <div className="be-transcript-row be-transcript-editing-row">
        {time && <div className="be-transcript-time">{time}</div>}
        <div className="be-transcript-text">
            <TextareaAutosize maxRows={10} onChange={onChange} value={text} />
            <div className="be-transcript-buttons">
                <Button data-resin-target={SKILLS_TARGETS.TRANSCRIPTS.EDIT_CANCEL} onClick={onCancel} type="button">
                    <FormattedMessage {...messages.cancel} />
                </Button>
                <PrimaryButton data-resin-target={SKILLS_TARGETS.TRANSCRIPTS.EDIT_SAVE} onClick={onSave} type="button">
                    <FormattedMessage {...messages.save} />
                </PrimaryButton>
            </div>
        </div>
    </div>
);

export default EditingTranscriptRow;
