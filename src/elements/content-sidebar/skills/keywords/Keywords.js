/**
 * @flow
 * @file File Keywords SkillCard component
 * @author Box
 */

import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PlainButton from '../../../../components/plain-button/PlainButton';
import IconEdit from '../../../../icons/general/IconEdit';
import LoadingIndicatorWrapper from '../../../../components/loading-indicator/LoadingIndicatorWrapper';
import InlineError from '../../../../components/inline-error/InlineError';
import Tooltip from '../../../../components/tooltip/Tooltip';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import EditableKeywords from './EditableKeywords';
import ReadOnlyKeywords from './ReadOnlyKeywords';
import type { SkillCardEntry, SkillCard } from '../../../../common/types/skills';

import './Keywords.scss';

type Props = {
    card: SkillCard,
    getViewer?: Function,
    hasError: boolean,
    isEditable: boolean,
    onSkillChange: Function,
    transcript?: SkillCard,
};

type State = {
    adds: Array<SkillCardEntry>,
    hasError: boolean,
    isEditing: boolean,
    isLoading: boolean,
    keywords: Array<SkillCardEntry>,
    removes: Array<SkillCardEntry>,
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
            keywords: props.card.entries,
            adds: [],
            removes: [],
            isEditing: false,
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
        const regex = new RegExp(`\\b${((keyword.text: any): string)}\\b`, 'i');

        if (transcript && Array.isArray(transcript.entries)) {
            transcript.entries.forEach(({ text, appears }: SkillCardEntry): void => {
                if (text && regex.test(text) && Array.isArray(appears) && appears.length > 0) {
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
        const addedIndex = adds.findIndex(added => added === keyword);
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
        const { card, getViewer, isEditable }: Props = this.props;
        const { duration }: SkillCard = card;
        const { isEditing, isLoading, hasError, keywords, removes, adds }: State = this.state;
        const hasKeywords = keywords.length > 0;
        const entries = keywords.filter((face: SkillCardEntry) => !removes.includes(face)).concat(adds);
        const editClassName = classNames('be-keyword-edit', {
            'be-keyword-is-editing': isEditing,
        });

        return (
            <LoadingIndicatorWrapper className="be-keywords" isLoading={isLoading}>
                {hasKeywords && isEditable && !isLoading && (
                    <Tooltip text={<FormattedMessage {...messages.editLabel} />}>
                        <PlainButton
                            className={editClassName}
                            data-resin-target={SKILLS_TARGETS.KEYWORDS.EDIT}
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
                {isEditing && (
                    <EditableKeywords
                        keywords={entries}
                        onAdd={this.onAdd}
                        onCancel={this.onCancel}
                        onDelete={this.onDelete}
                        onSave={this.onSave}
                    />
                )}
                {!isEditing && hasKeywords && (
                    <ReadOnlyKeywords duration={duration} getViewer={getViewer} keywords={entries} />
                )}
                {!isEditing && !hasKeywords && <FormattedMessage {...messages.skillNoInfoFoundError} />}
            </LoadingIndicatorWrapper>
        );
    }
}

export default Keywords;
