/**
 * @flow
 * @file Editable transcript row component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TextareaAutosize from 'react-textarea-autosize';
import PrimaryButton from 'box-react-ui/lib/components/primary-button/PrimaryButton';
import Button from 'box-react-ui/lib/components/button/Button';
import messages from 'elements/common/messages';
import { SKILLS_TARGETS } from 'elements/common/interactionTargets';
import './EditingTranscriptRow.scss';

type Props = {
    time?: string,
    text?: string,
    onSave: Function,
    onCancel: Function,
    onChange: Function,
};

const EditingTranscriptRow = ({ time, text = '', onSave, onCancel, onChange }: Props) => (
    <div className="be-transcript-row be-transcript-editing-row">
        {time && <div className="be-transcript-time">{time}</div>}
        <div className="be-transcript-text">
            <TextareaAutosize maxRows={10} onChange={onChange} value={text} />
            <div className="be-transcript-buttons">
                <Button type="button" onClick={onCancel} data-resin-target={SKILLS_TARGETS.TRANSCRIPTS.EDIT_CANCEL}>
                    <FormattedMessage {...messages.cancel} />
                </Button>
                <PrimaryButton type="button" onClick={onSave} data-resin-target={SKILLS_TARGETS.TRANSCRIPTS.EDIT_SAVE}>
                    <FormattedMessage {...messages.save} />
                </PrimaryButton>
            </div>
        </div>
    </div>
);

export default EditingTranscriptRow;
