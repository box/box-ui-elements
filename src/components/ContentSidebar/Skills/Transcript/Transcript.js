/**
 * @flow
 * @file Transcript component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconEdit from 'box-react-ui/lib/icons/general/IconEdit';
import IconCopy from 'box-react-ui/lib/icons/general/IconCopy';
import IconExpand from 'box-react-ui/lib/icons/general/IconExpand';
import IconCollapse from 'box-react-ui/lib/icons/general/IconCollapse';
import { formatTime } from 'box-react-ui/lib/utils/datetime';
import TranscriptRow from './TranscriptRow';
import { isValidTimeSlice } from './timeSliceUtils';
import { COLOR_999 } from '../../../../constants';
import { copy } from '../../../../util/download';
import { SKILLS_TARGETS } from '../../../../interactionTargets';
import messages from '../../../messages';
import type { SkillCard, SkillCardEntry, SkillCardEntryTimeSlice } from '../../../../flowTypes';
import './Transcript.scss';

type Props = {
    card: SkillCard,
    isEditable: boolean,
    getPreviewer?: Function,
    onSkillChange: Function
};

type State = {
    isEditingIndex?: number,
    newTranscriptText: string,
    isCollapsed: boolean
};

class Transcript extends React.PureComponent<Props, State> {
    props: Props;
    state: State = { isEditingIndex: undefined, newTranscriptText: '', isCollapsed: true };
    copyBtn: HTMLButtonElement;

    /**
     * Called when transcripts gets new properties
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(): void {
        const wasEditing = typeof this.state.isEditingIndex === 'number';
        this.setState({ isEditingIndex: wasEditing ? -1 : undefined, newTranscriptText: '' });
    }

    /**
     * Reducer to accumulate all transcript entries for copying
     *
     * @param {Object} accumulator - reducer accumulator
     * @return {string} accumulated transcript entries
     */
    transcriptReducer = (accumulator: string, { appears, text }: SkillCardEntry): string => {
        const start: string =
            isValidTimeSlice(appears) && Array.isArray(appears) ? formatTime(appears[0].start) : '0:00';
        return `${accumulator}${start}: ${text || ''}\r\n`;
    };

    /**
     * Mapper to accumulate all transcript entries for displaying
     *
     * @param {Object} accumulator - reducer accumulator
     * @param {number} index - mapper index
     * @return {string} accumulated transcript entries
     */
    transcriptMapper = ({ appears, text }: SkillCardEntry, index: number): React.Node => {
        const { isEditingIndex, newTranscriptText }: State = this.state;
        const isEditingRow = isEditingIndex === index;
        const transcriptText = isEditingRow ? newTranscriptText || text : text;
        const interactionTarget = isEditingRow
            ? SKILLS_TARGETS.TRANSCRIPTS.EDIT_TEXT
            : SKILLS_TARGETS.TRANSCRIPTS.TRANSCRIPT;
        return (
            <TranscriptRow
                key={index}
                isEditing={isEditingRow}
                appears={appears}
                text={transcriptText}
                onClick={() => this.onClick(index)}
                onSave={this.onSave}
                onCancel={this.onCancel}
                onChange={this.onChange}
                interactionTarget={interactionTarget}
            />
        );
    };

    /**
     * Toggles the edit mode
     *
     * @private
     * @return {void}
     */
    toggleIsEditing = (): void => {
        this.setState((prevState) => ({
            isEditingIndex: typeof prevState.isEditingIndex === 'number' ? undefined : -1
        }));
    };

    /**
     * Previews a transcript segment
     *
     * @private
     * @param {number|void} [index] - row index to edit
     * @return {void}
     */
    previewSegment(index: number) {
        const { card: { entries }, getPreviewer }: Props = this.props;
        const { appears } = entries[index];
        const viewer = getPreviewer ? getPreviewer() : null;
        const isValid = isValidTimeSlice(appears) && Array.isArray(appears) && appears.length === 1;
        const timeSlice = ((appears: any): Array<SkillCardEntryTimeSlice>);
        const start = isValid ? timeSlice[0].start : 0;

        if (isValid && viewer && viewer.isLoaded() && !viewer.isDestroyed() && typeof viewer.play === 'function') {
            viewer.play(start);
        }
    }

    /**
     * Saves the new card data
     *
     * @private
     * @return {void}
     */
    onSave = (): void => {
        const { card: { entries }, onSkillChange }: Props = this.props;
        const { isEditingIndex, newTranscriptText }: State = this.state;

        if (typeof isEditingIndex !== 'number') {
            return;
        }

        const entry = entries[isEditingIndex];
        if (entry.text === newTranscriptText) {
            this.onCancel();
        } else {
            onSkillChange(null, null, [
                {
                    replacement: { ...entry, text: newTranscriptText },
                    replaced: entry
                }
            ]);
        }
    };

    /**
     * Cancels editing
     *
     * @private
     * @return {void}
     */
    onCancel = (): void => {
        this.setState({ isEditingIndex: -1, newTranscriptText: '' });
    };

    /**
     * Reflects changes of editing
     *
     * @private
     * @param {Event} event - keyboard event
     * @return {void}
     */
    onChange = (event: SyntheticKeyboardEvent<HTMLTextAreaElement>): void => {
        const currentTarget = (event.currentTarget: HTMLTextAreaElement);
        this.setState({
            newTranscriptText: currentTarget.value
        });
    };

    /**
     * Click handler for transcript
     *
     * @private
     * @return {void}
     */
    onClick = (index: number): void => {
        const { isEditingIndex }: State = this.state;
        if (typeof isEditingIndex === 'number') {
            this.setState({
                isEditingIndex: index
            });
        } else {
            this.previewSegment(index);
        }
    };

    /**
     * Copies the transcript.
     * Also animates the copy button.
     *
     * @private
     * @return {void}
     */
    copyTranscript = () => {
        const { card: { entries } }: Props = this.props;
        const copiedClass = 'be-transcript-copied';
        copy(entries.reduce(this.transcriptReducer, ''));

        // Animate the button by adding a class
        if (this.copyBtn) {
            this.copyBtn.classList.add(copiedClass);
        }

        // Remove the animation class
        setTimeout(() => {
            if (this.copyBtn) {
                this.copyBtn.classList.remove(copiedClass);
            }
        }, 1000);
    };

    /**
     * Copy button reference
     *
     * @private
     * @return {void}
     */
    copyBtnRef = (btn: HTMLButtonElement): void => {
        this.copyBtn = btn;
    };

    /**
     * Toggles transcript exapand and collapse
     *
     * @private
     * @return {void}
     */
    toggleExpandCollapse = (): void => {
        this.setState((prevState) => ({
            isCollapsed: !prevState.isCollapsed
        }));
    };

    /**
     * Renders the transcript
     *
     * @private
     * @return {Object}
     */
    render() {
        const { card: { entries }, isEditable }: Props = this.props;
        const { isEditingIndex, isCollapsed }: State = this.state;
        const isEditing = typeof isEditingIndex === 'number';
        const editBtnClassName = classNames('be-transcript-edit', {
            'be-transcript-is-editing': isEditing
        });
        const contentClassName = classNames({
            'be-transcript-content-collapsed': isCollapsed
        });

        return (
            <div className='be-transcript'>
                <PlainButton
                    type='button'
                    className='be-transcript-copy'
                    getDOMRef={this.copyBtnRef}
                    onClick={this.copyTranscript}
                >
                    <IconCopy color={COLOR_999} />
                </PlainButton>
                <PlainButton type='button' className='be-transcript-expand' onClick={this.toggleExpandCollapse}>
                    {isCollapsed ? <IconExpand color={COLOR_999} /> : <IconCollapse color={COLOR_999} />}
                </PlainButton>
                {isEditable && (
                    <PlainButton
                        type='button'
                        className={editBtnClassName}
                        onClick={this.toggleIsEditing}
                        data-resin-target={SKILLS_TARGETS.TRANSCRIPTS.EDIT}
                    >
                        <IconEdit />
                    </PlainButton>
                )}
                {isEditing ? (
                    <div className='be-transcript-edit-message'>
                        <FormattedMessage {...messages.transcriptEdit} />
                    </div>
                ) : null}
                <div className={contentClassName}>{entries.map(this.transcriptMapper)}</div>
            </div>
        );
    }
}

export default Transcript;
