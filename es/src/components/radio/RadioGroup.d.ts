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
declare class RadioGroup extends React.Component<RadioGroupProps, RadioGroupState> {
    static defaultProps: {
        className: string;
    };
    constructor(props: RadioGroupProps);
    onChangeHandler: (event: React.SyntheticEvent<HTMLElement>) => void;
    render(): React.JSX.Element;
}
export default RadioGroup;
