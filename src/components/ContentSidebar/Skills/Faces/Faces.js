/**
 * @flow
 * @file Faces Skill Card component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import PrimaryButton from 'box-react-ui/lib/components/primary-button/PrimaryButton';
import Button from 'box-react-ui/lib/components/button/Button';
import IconEdit from 'box-react-ui/lib/icons/general/IconEdit';
import Face from './Face';
import Timeline from '../Timeline';
import messages from '../../../messages';
import { SKILLS_TARGETS } from '../../../../interactionTargets';
import type { SkillCard, SkillCardEntry } from '../../../../flowTypes';
import './Faces.scss';

type Props = {
    card: SkillCard,
    isEditable: boolean,
    getPreviewer?: Function,
    onSkillChange: Function
};

type State = {
    selected?: SkillCardEntry,
    isEditing: boolean,
    faces: Array<SkillCardEntry>,
    removes: Array<SkillCardEntry>
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
            isEditing: false
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
        this.setState({ faces: props.card.entries, removes: [], isEditing: false, selected: undefined });
    }

    /**
     * Called when faces gets new properties
     *
     * @private
     * @param {Object} nextProps - component props
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        this.resetState(nextProps);
    }

    /**
     * Toggles the edit mode
     *
     * @private
     * @return {void}
     */
    toggleisEditing = (): void => {
        this.setState((prevState) => ({
            isEditing: !prevState.isEditing
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
            selected: selected === face ? undefined : face
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
        onSkillChange(removes);
        this.toggleisEditing();
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
        const { card, isEditable, getPreviewer }: Props = this.props;
        const { selected, faces, removes, isEditing }: State = this.state;
        const { duration }: SkillCard = card;
        const entries = faces.filter((face: SkillCardEntry) => !removes.includes(face));
        const editClassName = classNames('be-faces', {
            'be-faces-is-editing': isEditing
        });

        return (
            <div className={editClassName}>
                {isEditable && (
                    <PlainButton
                        type='button'
                        className='be-face-edit'
                        onClick={this.toggleisEditing}
                        data-resin-target={SKILLS_TARGETS.FACES.EDIT}
                    >
                        <IconEdit />
                    </PlainButton>
                )}
                {entries.map((face: SkillCardEntry, index: number) => (
                    /* eslint-disable react/no-array-index-key */
                    <Face
                        key={index}
                        face={face}
                        selected={selected}
                        isEditing={isEditing}
                        onDelete={this.onDelete}
                        onSelect={this.onSelect}
                    />
                    /* eslint-enable react/no-array-index-key */
                ))}
                {!!selected &&
                    !isEditing &&
                    Array.isArray(selected.appears) &&
                    selected.appears.length > 0 && (
                        <Timeline
                            timeslices={selected.appears}
                            duration={duration}
                            getPreviewer={getPreviewer}
                            interactionTarget={SKILLS_TARGETS.FACES.TIMELINE}
                        />
                    )}
                {isEditable &&
                    isEditing && (
                        <div className='be-faces-buttons'>
                            <Button onClick={this.onCancel} data-resin-target={SKILLS_TARGETS.FACES.EDIT_CANCEL}>
                                <FormattedMessage {...messages.cancel} />
                            </Button>
                            <PrimaryButton onClick={this.onSave} data-resin-target={SKILLS_TARGETS.FACES.EDIT_SAVE}>
                                <FormattedMessage {...messages.save} />
                            </PrimaryButton>
                        </div>
                    )}
            </div>
        );
    }
}

export default Faces;
