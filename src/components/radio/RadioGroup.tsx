import * as React from 'react';

export interface RadioGroupProps {
    children: Array<React.ReactElement> | React.ReactElement;
    className: string;
    name?: string;
    onChange?: Function;
    value?: string;
}

export interface RadioGroupState {
    value?: string;
}

class RadioGroup extends React.Component<RadioGroupProps, RadioGroupState> {
    static defaultProps = {
        className: '',
    };

    constructor(props: RadioGroupProps) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    // @TODO: think about adding componentDidUpdate or gDSFP
    // to update the internal state value based on new props value
    onChangeHandler = (event: React.SyntheticEvent<HTMLElement>) => {
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
        const { value: stateValue } = this.state;

        return (
            <div className={`radio-group ${className}`} onChange={this.onChangeHandler}>
                {React.Children.map(children, (radio: React.ReactElement) => {
                    const { value } = radio.props as { value: string };

                    return React.cloneElement(radio, {
                        name,
                        isSelected: value === stateValue,
                    } as React.HTMLAttributes<HTMLInputElement>);
                })}
            </div>
        );
    }
}

export default RadioGroup;
