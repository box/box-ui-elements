// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import TextInput from '../../components/text-input/TextInput';
import commonMessages from '../../common/messages';

import messages from './messages';

const VALUE_MISSING = 'valueMissing';
const TYPE_MISMATCH = 'typeMismatch';

const errorMap = {
    [VALUE_MISSING]: <FormattedMessage {...commonMessages.requiredFieldError} />,
    [TYPE_MISMATCH]: <FormattedMessage {...commonMessages.invalidURLError} />,
};

type Props = {
    intl: Object,
    onValidURLChange: Function,
    value: string,
};

type State = {
    error: '' | $Keys<typeof errorMap>,
    value: string,
};

class EditableURL extends React.Component<Props, State> {
    state = {
        error: '',
        value: this.props.value,
    };

    componentDidUpdate({ value: prevValue }: Props) {
        const { value } = this.props;
        if (prevValue !== value) {
            this.setState({ value });
        }
    }

    inputEl: ?HTMLInputElement;

    handleBlur = (): void => {
        if (!this.inputEl) {
            return;
        }

        const { valid, valueMissing } = this.inputEl.validity;
        if (!valid) {
            this.setState({
                error: valueMissing ? VALUE_MISSING : TYPE_MISMATCH,
            });
            return;
        }

        this.props.onValidURLChange(this.state.value);
    };

    handleChange = (event: SyntheticEvent<HTMLInputElement>): void => {
        this.setState({ value: event.currentTarget.value });
    };

    handleFocus = (): void => {
        this.setState({ error: '' });
    };

    render() {
        const {
            intl: { formatMessage },
        } = this.props;
        const { error, value } = this.state;

        return (
            <TextInput
                className="url-input"
                error={error ? errorMap[error] : undefined}
                hideLabel
                inputRef={ref => {
                    this.inputEl = ref;
                }}
                isRequired
                label={formatMessage(messages.url)}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                placeholder={formatMessage(messages.urlPlaceholder)}
                type="url"
                value={value}
            />
        );
    }
}

export { EditableURL as EditableURLBase, VALUE_MISSING, TYPE_MISMATCH };
export default injectIntl(EditableURL);
