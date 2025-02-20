import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PillSelector from '../../../../components/pill-selector-dropdown/PillSelector';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import Button, { ButtonType } from '../../../../components/button/Button';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import getPills from './keywordUtils';
import { Pill, Pills } from './types';
import { SkillCardEntry } from '../../../../common/types/skills';
import './EditableKeywords.scss';

interface Props {
    keywords: Array<SkillCardEntry>;
    onAdd: (keyword: SkillCardEntry) => void;
    onCancel: () => void;
    onDelete: (keyword: SkillCardEntry) => void;
    onSave: () => void;
}

interface State {
    isInCompositionMode: boolean;
    keyword: string;
    pills: Pills;
}

class EditableKeywords extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            pills: getPills(props.keywords),
            keyword: '',
            isInCompositionMode: false,
        };
    }

    componentDidUpdate({ keywords: prevKeywords }: Props): void {
        const { keywords } = this.props;

        if (prevKeywords !== keywords) {
            this.setState({ pills: getPills(keywords), keyword: '' });
        }
    }

    onRemove = (option: Pill, index: number): void => {
        const { onDelete, keywords } = this.props;
        onDelete(keywords[index]);
    };

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter' && !this.state.isInCompositionMode) {
            event.preventDefault();
            this.onBlur();
        }
    };

    onBlur = (): void => {
        const { onAdd } = this.props;
        const { keyword } = this.state;

        if (keyword) {
            onAdd({
                type: 'text',
                text: keyword,
            });
            this.setState({ keyword: '' });
        }
    };

    onCompositionStart = (): void => {
        this.setState({ isInCompositionMode: true });
    };

    onCompositionEnd = (): void => {
        this.setState({ isInCompositionMode: false });
    };

    onInput = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        this.setState({
            keyword: event.currentTarget.value,
        });
    };

    render(): React.ReactElement {
        const { onSave, onCancel } = this.props;
        const { pills, keyword } = this.state;
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
                    <Button
                        data-resin-target={SKILLS_TARGETS.KEYWORDS.EDIT_CANCEL}
                        onClick={onCancel}
                        type={ButtonType.BUTTON}
                    >
                        <FormattedMessage {...messages.cancel} />
                    </Button>
                    <PrimaryButton
                        data-resin-target={SKILLS_TARGETS.KEYWORDS.EDIT_SAVE}
                        onClick={onSave}
                        type={ButtonType.BUTTON}
                    >
                        <FormattedMessage {...messages.save} />
                    </PrimaryButton>
                </div>
            </span>
        );
    }
}

export default EditableKeywords;
