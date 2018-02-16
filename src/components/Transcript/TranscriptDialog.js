/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl, FormattedMessage } from 'react-intl';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconMoveCopy from 'box-react-ui/lib/icons/general/IconMoveCopy';
import IconCollapse from 'box-react-ui/lib/icons/general/IconCollapse';
import { formatTime } from '../../util/datetime';
import { copy } from '../../util/download';
import messages from '../messages';
import { isValidTimeSlice } from './timeSliceUtils';
import { CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL, COLOR_DOWNTOWN_GREY } from '../../constants';
import type { SkillCardEntry } from '../../flowTypes';
import './TranscriptDialog.scss';

type Props = {
    isOpen: boolean,
    onCancel: Function,
    data: SkillCardEntry[],
    rootElement: HTMLElement,
    appElement: HTMLElement,
    title?: string,
    onInteraction: Function,
    intl: any
};

const transcriptReducer = (accumulator: string, { appears, text }: SkillCardEntry) => {
    const start: string = isValidTimeSlice(appears) && Array.isArray(appears) ? formatTime(appears[0].start) : '0:00';
    return `${accumulator}${start}: ${text || ''}\r\n`;
};

const transcriptMapper = ({ appears, text }: SkillCardEntry, index) => {
    const start: string = isValidTimeSlice(appears) && Array.isArray(appears) ? formatTime(appears[0].start) : '0:00';
    return <p key={index}>{`${start}: ${text || ''}`}</p>;
};

const TranscriptDialog = ({ isOpen, onCancel, data, rootElement, appElement, title, onInteraction, intl }: Props) => (
    <Modal
        isOpen={isOpen}
        portalClassName={`${CLASS_MODAL} be-modal-transcript`}
        parentSelector={() => rootElement}
        className={CLASS_MODAL_CONTENT_FULL_BLEED}
        overlayClassName={CLASS_MODAL_OVERLAY}
        onRequestClose={onCancel}
        contentLabel={title || intl.formatMessage(messages.transcriptSkill)}
        appElement={appElement}
    >
        <div className='be-modal-transcript-header'>
            {title || <FormattedMessage {...messages.transcriptSkill} />}
            <div className='be-modal-transcript-btn'>
                <PlainButton
                    type='button'
                    className='be-transcript-copy'
                    onClick={() => {
                        onInteraction({ target: 'transcript-copy' });
                        copy(data.reduce(transcriptReducer, ''));
                    }}
                >
                    <IconMoveCopy color={COLOR_DOWNTOWN_GREY} />
                </PlainButton>
                <PlainButton type='button' className='be-transcript-collapse' onClick={onCancel}>
                    <IconCollapse color={COLOR_DOWNTOWN_GREY} />
                </PlainButton>
            </div>
        </div>
        <div className='be-modal-content'>{data.map(transcriptMapper)}</div>
    </Modal>
);

export default injectIntl(TranscriptDialog);
