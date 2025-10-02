/**
 * @flow
 * @file Editable Skill Keywords card component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PillSelector from '../../../../components/pill-selector-dropdown/PillSelector';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import Button from '../../../../components/button/Button';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import getPills from './keywordUtils';
import type { Pill, Pills } from './flowTypes';
import type { SkillCardEntry } from '../../../../common/types/skills';
import './EditableKeywords.scss';

type Props = {
    keywords: Array<SkillCardEntry>,
    onAdd: Function,
    onCancel: Function,
    onDelete: Function,
    onSave: Function,
};

type State = {
    isInCompositionMode: boolean,
    keyword: string,
    pills: Pills,
};

class EditableKeywords extends React.PureComponent<Props, State> {
    props: Props;

    state: State;

    /**
     * [constructor]
     *
     * @public
     * @return {EditableKeywords}
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            pills: getPills(props.keywords),
            keyword: '',
            isInCompositionMode: false,
        };
    }

    /**
     * Called when keywords gets new properties.
     * Should reset to original state.
     *
     * @private
     * @param {Object} nextProps - component props
     * @return {void}
     */
    componentDidUpdate({ keywords: prevKeywords }: Props): void {
        const { keywords } = this.props;

        if (prevKeywords !== keywords) {
            this.setState({ pills: getPills(keywords), keyword: '' });
        }
    }

    /**
     * Called when keywords gets new properties.
     * Should reset to original state.
     *
     * @private
     * @param {Object} option - pill
     * @param {number} index - pill index
     * @return {void}
     */
    onRemove = (option: Pill, index: number): void => {
        // eslint-disable-line
        const { onDelete, keywords }: Props = this.props;
        onDelete(keywords[index]);
    };

    /**
     * When pressing enter in the pill input box
     *
     * @private
     * @param {Event} event - keyboard event
     * @return {void}
     */
    onKeyDown = ({ key }: SyntheticKeyboardEvent<HTMLInputElement>): void => {
        if (key === 'Enter' && !this.state.isInCompositionMode) {
            this.onBlur();
        }
    };

    /**
     * Called when pill selector is blurred.
     * Adds a new pill if needed.
     *
     * @private
     * @return {void}
     */
    onBlur = () => {
        const { onAdd }: Props = this.props;
        const { keyword } = this.state;

        if (keyword) {
            onAdd({
                type: 'text',
                text: keyword,
            });
        }
    };

    /**
     * Enables composition mode.
     *
     * @private
     * @return {void}
     */
    onCompositionStart = () => {
        this.setState({ isInCompositionMode: true });
    };

    /**
     * Disables composition mode.
     *
     * @private
     * @return {void}
     */
    onCompositionEnd = () => {
        this.setState({ isInCompositionMode: false });
    };

    /**
     * Called when pill selector gets new input value.
     *
     * @private
     * @return {void}
     */
    onInput = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const currentTarget = (event.currentTarget: HTMLInputElement);
        this.setState({
            keyword: currentTarget.value,
        });
    };

    /**
     * Renders the keywords
     *
     * @private
     * @return {void}
     */
    render() {
        const { onSave, onCancel }: Props = this.props;
        const { pills, keyword }: State = this.state;
        return (
            <span className="bdl-EditableKeywords">
                <PillSelector
                    onBlur={this.onBlur}
                    onCompositionEnd={this.onCompositionEnd}
                    onCompositionStart={this.onCompositionStart}
                    onInput={this.onInput}
                    onKeyDown={this.onKeyDown}
                    onPaste={this.onInput}
                    onRemove={this.onRemove}
                    selectedOptions={pills}
                    value={keyword}
                />
                <div className="be-keywords-buttons">
                    <Button data-resin-target={SKILLS_TARGETS.KEYWORDS.EDIT_CANCEL} onClick={onCancel} type="button">
                        <FormattedMessage {...messages.cancel} />
                    </Button>
                    <PrimaryButton data-resin-target={SKILLS_TARGETS.KEYWORDS.EDIT_SAVE} onClick={onSave} type="button">
                        <FormattedMessage {...messages.save} />
                    </PrimaryButton>
                </div>
            </span>
        );
    }
}

export default EditableKeywords;
