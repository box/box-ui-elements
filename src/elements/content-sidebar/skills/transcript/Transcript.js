/**
 * @flow
 * @file Transcript component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { bdlGray50 } from '../../../../styles/variables';
import PlainButton from '../../../../components/plain-button/PlainButton';
import IconEdit from '../../../../icons/general/IconEdit';
import IconCopy from '../../../../icons/general/IconCopy';
import IconExpand from '../../../../icons/general/IconExpand';
import IconCollapse from '../../../../icons/general/IconCollapse';
import { formatTime } from '../../../../utils/datetime';
import LoadingIndicatorWrapper from '../../../../components/loading-indicator/LoadingIndicatorWrapper';
import Tooltip from '../../../../components/tooltip/Tooltip';
import { copy } from '../../../../utils/download';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import messages from '../../../common/messages';
import { isValidTimeSlice } from './timeSliceUtils';
import TranscriptRow from './TranscriptRow';
import type { SkillCardEntry, SkillCard, SkillCardEntryTimeSlice } from '../../../../common/types/skills';
import './Transcript.scss';

type Props = {
    card: SkillCard,
    getViewer?: Function,
    isEditable: boolean,
    onSkillChange: Function,
};

type State = {
    isCollapsed: boolean,
    isEditingIndex?: number,
    isLoading: boolean,
    newTranscriptText: string,
};

class Transcript extends React.PureComponent<Props, State> {
    props: Props;

    state: State = {
        isEditingIndex: undefined,
        newTranscriptText: '',
        isCollapsed: true,
        isLoading: false,
    };

    copyBtn: HTMLButtonElement;

    /**
     * Called when transcripts gets new properties
     *
     * @private
     * @return {void}
     */
    componentDidUpdate(prevProps: Props): void {
        if (prevProps === this.props) {
            return;
        }

        const wasEditing = typeof this.state.isEditingIndex === 'number';
        this.setState({
            isEditingIndex: wasEditing ? -1 : undefined,
            newTranscriptText: '',
            isLoading: false,
        });
    }

    /**
     * Reducer to accumulate all transcript entries for copying
     *
     * @param {Object} accumulator - reducer accumulator
     * @return {string} accumulated transcript entries
     */
    transcriptReducer = (accumulator: string, { appears, text }: SkillCardEntry): string => {
        const start: string =
            isValidTimeSlice(appears) && Array.isArray(appears) ? `${formatTime(appears[0].start)}:` : '';
        return `${accumulator}${start} ${text || ''}\r\n`;
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
        const transcriptText = isEditingRow ? newTranscriptText : text;
        const interactionTarget = isEditingRow
            ? SKILLS_TARGETS.TRANSCRIPTS.EDIT_TEXT
            : SKILLS_TARGETS.TRANSCRIPTS.TRANSCRIPT;
        return (
            <TranscriptRow
                key={index}
                appears={appears}
                interactionTarget={interactionTarget}
                isEditing={isEditingRow}
                onCancel={this.onCancel}
                onChange={this.onChange}
                onClick={() => this.onClick(index)}
                onSave={this.onSave}
                text={transcriptText}
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
        this.setState(prevState => ({
            isEditingIndex: typeof prevState.isEditingIndex === 'number' ? undefined : -1,
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
        const {
            card: { entries },
            getViewer,
        }: Props = this.props;
        const { appears } = entries[index];
        const viewer = getViewer ? getViewer() : null;
        const isValid = isValidTimeSlice(appears) && Array.isArray(appears) && appears.length === 1;
        const timeSlice = ((appears: any): Array<SkillCardEntryTimeSlice>);
        const start = isValid ? timeSlice[0].start : 0;

        if (isValid && viewer && typeof viewer.play === 'function') {
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
        const {
            card: { entries },
            onSkillChange,
        }: Props = this.props;
        const { isEditingIndex, newTranscriptText }: State = this.state;

        if (typeof isEditingIndex !== 'number') {
            return;
        }

        const entry = entries[isEditingIndex];
        if (entry.text === newTranscriptText) {
            this.onCancel();
        } else {
            this.setState({ isLoading: true, isEditingIndex: -1 });
            onSkillChange(null, null, [
                {
                    replacement: { ...entry, text: newTranscriptText },
                    replaced: entry,
                },
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
            newTranscriptText: currentTarget.value,
        });
    };

    /**
     * Click handler for transcript
     *
     * @private
     * @return {void}
     */
    onClick = (index: number): void => {
        const {
            card: { entries },
        }: Props = this.props;
        const { isEditingIndex }: State = this.state;
        if (typeof isEditingIndex === 'number') {
            this.setState({
                isEditingIndex: index,
                newTranscriptText: entries[index].text,
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
        const {
            card: { entries },
        }: Props = this.props;
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
        this.setState(prevState => ({
            isCollapsed: !prevState.isCollapsed,
        }));
    };

    /**
     * Renders the transcript
     *
     * @private
     * @return {Object}
     */
    render() {
        const {
            card: { entries },
            isEditable,
        }: Props = this.props;
        const { isEditingIndex, isCollapsed, isLoading }: State = this.state;
        const hasEntries = entries.length > 0;
        const hasManyEntries = entries.length > 5;
        const isEditing = typeof isEditingIndex === 'number';
        const editBtnClassName = classNames('be-transcript-edit', {
            'be-transcript-is-editing': isEditing,
        });
        const contentClassName = classNames({
            'be-transcript-content-collapsed': isCollapsed,
        });
        const expandCollapseMessage = isCollapsed ? messages.expand : messages.collapse;

        return (
            <LoadingIndicatorWrapper className="be-transcript" isLoading={isLoading}>
                {hasEntries && !isLoading && (
                    <div className="be-transcript-actions">
                        <Tooltip text={<FormattedMessage {...messages.copy} />}>
                            <PlainButton
                                className="be-transcript-copy"
                                data-resin-target={SKILLS_TARGETS.TRANSCRIPTS.COPY}
                                getDOMRef={this.copyBtnRef}
                                onClick={this.copyTranscript}
                                type="button"
                            >
                                <IconCopy color={bdlGray50} />
                            </PlainButton>
                        </Tooltip>
                        {hasManyEntries && (
                            <Tooltip text={<FormattedMessage {...expandCollapseMessage} />}>
                                <PlainButton
                                    className="be-transcript-expand"
                                    data-resin-target={SKILLS_TARGETS.TRANSCRIPTS.EXPAND}
                                    onClick={this.toggleExpandCollapse}
                                    type="button"
                                >
                                    {isCollapsed ? (
                                        <IconExpand color={bdlGray50} />
                                    ) : (
                                        <IconCollapse color={bdlGray50} />
                                    )}
                                </PlainButton>
                            </Tooltip>
                        )}
                        {isEditable && (
                            <Tooltip text={<FormattedMessage {...messages.editLabel} />}>
                                <PlainButton
                                    className={editBtnClassName}
                                    data-resin-target={SKILLS_TARGETS.TRANSCRIPTS.EDIT}
                                    onClick={this.toggleIsEditing}
                                    type="button"
                                >
                                    <IconEdit />
                                </PlainButton>
                            </Tooltip>
                        )}
                    </div>
                )}
                {isEditing ? (
                    <div className="be-transcript-edit-message">
                        <FormattedMessage {...messages.transcriptEdit} />
                    </div>
                ) : null}
                {hasEntries ? (
                    <div className={contentClassName}>{entries.map(this.transcriptMapper)}</div>
                ) : (
                    <FormattedMessage {...messages.skillNoInfoFoundError} />
                )}
            </LoadingIndicatorWrapper>
        );
    }
}

export default Transcript;
