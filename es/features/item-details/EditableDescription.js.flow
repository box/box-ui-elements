// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import TextareaAutosize from 'react-textarea-autosize';

import messages from './messages';

type Props = {
    intl: Object,
    onDescriptionChange: Function,
    textAreaProps?: Object,
    value?: string,
};

type State = {
    value: string,
};

class EditableDescription extends React.PureComponent<Props, State> {
    static defaultProps = {
        textAreaProps: {},
        value: '',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.value || '',
        };
    }

    componentDidUpdate({ value: prevValue }: Props): void {
        const { value } = this.props;
        if (prevValue !== value) {
            this.setState({ value });
        }
    }

    handleBlur = (): void => {
        const { value } = this.state;
        this.props.onDescriptionChange(value);
    };

    handleChange = (event: SyntheticEvent<HTMLTextAreaElement>): void => {
        const { value } = event.currentTarget;
        this.setState({ value });
    };

    render() {
        const { intl, textAreaProps } = this.props;
        const { value } = this.state;

        return (
            <TextareaAutosize
                {...textAreaProps}
                className="description-textarea"
                maxLength="255"
                maxRows={6}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
                value={value}
            />
        );
    }
}

export { EditableDescription as EditableDescriptionBase };
export default injectIntl(EditableDescription);
