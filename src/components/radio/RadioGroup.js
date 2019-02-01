// @flow
import * as React from 'react';

import RadioButton from './RadioButton';

type Props = {
    children: React.Node,
    className: string,
    name?: string,
    onChange?: Function,
    value?: string,
};

type State = {
    value?: string,
};

class RadioGroup extends React.Component<Props, State> {
    static defaultProps = {
        className: '',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    onChangeHandler = (event: SyntheticEvent<>) => {
        const { target } = event;
        const { onChange } = this.props;

        if (target instanceof HTMLInputElement) {
            this.setState({
                value: target.value,
            });
        }

        if (onChange) {
            onChange(event);
        }
    };

    render() {
        const { children, className, name } = this.props;
        const { value } = this.state;

        return (
            <div className={`radio-group ${className}`} onChange={this.onChangeHandler}>
                {React.Children.map(children, radio => (
                    <RadioButton
                        description={radio.props.description}
                        isDisabled={radio.props.isDisabled}
                        isSelected={radio.props.value === value}
                        label={radio.props.label}
                        name={name}
                        value={radio.props.value}
                    />
                ))}
            </div>
        );
    }
}

export default RadioGroup;
