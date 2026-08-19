export type SelectOptionValueProp = string | number | null;

export interface SelectOptionProp {
    /** Text displayed for the option */
    displayText: string;
    /** Optional unique identifier for the option */
    id?: string;
    /** Value of the option */
    value: SelectOptionValueProp;
}
