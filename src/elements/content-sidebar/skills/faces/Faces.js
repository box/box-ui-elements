/**
 * @flow
 * @file Faces Skill Card component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PlainButton from '../../../../components/plain-button/PlainButton';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import LoadingIndicatorWrapper from '../../../../components/loading-indicator/LoadingIndicatorWrapper';
import InlineError from '../../../../components/inline-error/InlineError';
import Tooltip from '../../../../components/tooltip/Tooltip';
import Button from '../../../../components/button/Button';
import IconEdit from '../../../../icons/general/IconEdit';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import Face from './Face';
import Timeline from '../timeline';
import type { SkillCardEntry, SkillCard } from '../../../../common/types/skills';
import './Faces.scss';

type Props = {
    card: SkillCard,
    getViewer?: Function,
    hasError: boolean,
    isEditable: boolean,
    onSkillChange: Function,
};

type State = {
    faces: Array<SkillCardEntry>,
    hasError: boolean,
    isEditing: boolean,
    isLoading: boolean,
    removes: Array<SkillCardEntry>,
    selected?: SkillCardEntry,
};

class Faces extends React.PureComponent<Props, State> {
    props: Props;

    state: State;

    /**
     * [constructor]
     *
     * @public
     * @return {Faces}
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            faces: props.card.entries,
            removes: [],
            isEditing: props.hasError,
            hasError: props.hasError,
            isLoading: false,
        };
    }

    /**
     * Helper to reset the state
     *
     * @private
     * @param {Object} props - component props
     * @return {void}
     */
    resetState(props: Props): void {
        this.setState({
            faces: props.card.entries,
            removes: [],
            isEditing: false,
            selected: undefined,
            hasError: false,
            isLoading: false,
        });
    }

    /**
     * Toggles the edit mode
     *
     * @private
     * @return {void}
     */
    toggleIsEditing = (): void => {
        this.setState(prevState => ({
            isEditing: !prevState.isEditing,
        }));
    };

    /**
     * Toggles face selection
     *
     * @private
     * @return {void}
     */
    onSelect = (face: SkillCardEntry): void => {
        const { selected } = this.state;
        this.setState({
            selected: selected === face ? undefined : face,
        });
    };

    /**
     * Deletes a face
     *
     * @private
     * @return {void}
     */
    onDelete = (face: SkillCardEntry): void => {
        const { removes } = this.state;
        removes.push(face);
        this.setState({ removes: removes.slice(0) });
    };

    /**
     * Saves the new card data
     *
     * @private
     * @return {void}
     */
    onSave = (): void => {
        const { onSkillChange }: Props = this.props;
        const { removes }: State = this.state;
        this.toggleIsEditing();
        if (removes.length > 0) {
            this.setState({ isLoading: true });
            onSkillChange(removes);
        }
    };

    /**
     * Cancels editing
     *
     * @private
     * @return {void}
     */
    onCancel = (): void => {
        this.resetState(this.props);
    };

    /**
     * Renders the faces
     *
     * @private
     * @return {void}
     */
    render() {
        const { card, isEditable, getViewer }: Props = this.props;
        const { selected, faces, removes, isEditing, hasError, isLoading }: State = this.state;
        const { duration }: SkillCard = card;
        const hasFaces = faces.length > 0;
        const entries = faces.filter((face: SkillCardEntry) => !removes.includes(face));
        const editClassName = classNames('be-face-edit', {
            'be-faces-is-editing': isEditing,
        });

        return (
            <LoadingIndicatorWrapper className="be-faces" isLoading={isLoading}>
                {hasFaces && isEditable && !isLoading && (
                    <Tooltip text={<FormattedMessage {...messages.editLabel} />}>
                        <PlainButton
                            className={editClassName}
                            data-resin-target={SKILLS_TARGETS.FACES.EDIT}
                            onClick={this.toggleIsEditing}
                            type="button"
                        >
                            <IconEdit />
                        </PlainButton>
                    </Tooltip>
                )}
                {hasError && (
                    <InlineError title={<FormattedMessage {...messages.sidebarSkillsErrorTitle} />}>
                        <FormattedMessage {...messages.sidebarSkillsErrorContent} />
                    </InlineError>
                )}
                {hasFaces ? (
                    entries.map((face: SkillCardEntry, index: number) => (
                        /* eslint-disable react/no-array-index-key */
                        <Face
                            key={index}
                            face={face}
                            isEditing={isEditing}
                            onDelete={this.onDelete}
                            onSelect={this.onSelect}
                            selected={selected}
                        />
                        /* eslint-enable react/no-array-index-key */
                    ))
                ) : (
                    <FormattedMessage {...messages.skillNoInfoFoundError} />
                )}
                {!!selected && !isEditing && Array.isArray(selected.appears) && selected.appears.length > 0 && (
                    <Timeline
                        duration={duration}
                        getViewer={getViewer}
                        interactionTarget={SKILLS_TARGETS.FACES.TIMELINE}
                        timeslices={selected.appears}
                    />
                )}
                {isEditing && (
                    <div className="be-faces-buttons">
                        <Button
                            data-resin-target={SKILLS_TARGETS.FACES.EDIT_CANCEL}
                            onClick={this.onCancel}
                            type="button"
                        >
                            <FormattedMessage {...messages.cancel} />
                        </Button>
                        <PrimaryButton
                            data-resin-target={SKILLS_TARGETS.FACES.EDIT_SAVE}
                            onClick={this.onSave}
                            type="button"
                        >
                            <FormattedMessage {...messages.save} />
                        </PrimaryButton>
                    </div>
                )}
            </LoadingIndicatorWrapper>
        );
    }
}

export default Faces;
