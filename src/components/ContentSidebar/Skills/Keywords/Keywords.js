/**
 * @flow
 * @file File Keywords SkillCard component
 * @author Box
 */

import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconEdit from 'box-react-ui/lib/icons/general/IconEdit';
import EditableKeywords from './EditableKeywords';
import ReadOnlyKeywords from './ReadOnlyKeywords';
import SkillsBusyIndicator from '../SkillsBusyIndicator';
import messages from '../../../messages';
import { SKILLS_TARGETS } from '../../../../interactionTargets';

import './Keywords.scss';

type Props = {
    card: SkillCard,
    transcript?: SkillCard,
    isEditable: boolean,
    getPreviewer?: Function,
    onSkillChange: Function
};

type State = {
    isEditing: boolean,
    isLoading: boolean,
    keywords: Array<SkillCardEntry>,
    adds: Array<SkillCardEntry>,
    removes: Array<SkillCardEntry>
};

class Keywords extends PureComponent<Props, State> {
    props: Props;
    state: State;

    /**
     * [constructor]
     *
     * @public
     * @return {Keywords}
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            keywords: props.card.entries,
            adds: [],
            removes: [],
            isEditing: false,
            isLoading: false
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
            keywords: props.card.entries,
            adds: [],
            removes: [],
            isEditing: false,
            isLoading: false
        });
    }

    /**
     * Called when keywords gets new properties
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
    toggleIsEditing = (): void => {
        this.setState((prevState) => ({
            isEditing: !prevState.isEditing
        }));
    };

    /**
     * Adds a new keyword.
     * Iterates over the transcript to find locations
     *
     * @private
     * @return {void}
     */
    onAdd = (keyword: SkillCardEntry): void => {
        const { transcript }: Props = this.props;
        const { adds } = this.state;
        const locations = [];

        if (transcript && Array.isArray(transcript.entries)) {
            transcript.entries.forEach(({ text, appears }: SkillCardEntry): void => {
                if (
                    text &&
                    text.includes(((keyword.text: any): string)) &&
                    Array.isArray(appears) &&
                    appears.length > 0
                ) {
                    locations.push(appears[0]);
                }
            });
        }

        keyword.appears = locations;
        adds.push(keyword);
        this.setState({ adds: adds.slice(0) });
    };

    /**
     * Deletes a keyword
     *
     * @private
     * @return {void}
     */
    onDelete = (keyword: SkillCardEntry): void => {
        const { adds, removes } = this.state;
        const addedIndex = adds.findIndex((added) => added === keyword);
        if (addedIndex > -1) {
            adds.splice(addedIndex, 1);
            this.setState({ adds: adds.slice(0) });
        } else {
            removes.push(keyword);
            this.setState({ removes: removes.slice(0) });
        }
    };

    /**
     * Saves the new card data
     *
     * @private
     * @return {void}
     */
    onSave = (): void => {
        const { onSkillChange }: Props = this.props;
        const { removes, adds }: State = this.state;
        this.toggleIsEditing();
        if (removes.length > 0 || adds.length > 0) {
            this.setState({ isLoading: true });
            onSkillChange(removes, adds);
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
     * Renders the keywords
     *
     * @private
     * @return {void}
     */
    render() {
        const { card, getPreviewer, isEditable }: Props = this.props;
        const { duration }: SkillCard = card;
        const { isEditing, isLoading, keywords, removes, adds }: State = this.state;
        const hasKeywords = keywords.length > 0;
        const entries = keywords.filter((face: SkillCardEntry) => !removes.includes(face)).concat(adds);
        const editClassName = classNames('be-keyword-edit', {
            'be-keyword-is-editing': isEditing
        });

        return (
            <div className='be-keywords'>
                {hasKeywords &&
                    isEditable &&
                    !isLoading && (
                        <PlainButton
                            type='button'
                            className={editClassName}
                            onClick={this.toggleIsEditing}
                            data-resin-target={SKILLS_TARGETS.KEYWORDS.EDIT}
                        >
                            <IconEdit />
                        </PlainButton>
                    )}
                {isEditing && (
                    <EditableKeywords
                        keywords={entries}
                        onSave={this.onSave}
                        onAdd={this.onAdd}
                        onDelete={this.onDelete}
                        onCancel={this.onCancel}
                    />
                )}
                {!isEditing &&
                    hasKeywords && (
                        <ReadOnlyKeywords keywords={entries} duration={duration} getPreviewer={getPreviewer} />
                    )}
                {!isEditing && !hasKeywords && <FormattedMessage {...messages.skillNoInfoFoundError} />}
                {isLoading && <SkillsBusyIndicator />}
            </div>
        );
    }
}

export default Keywords;
