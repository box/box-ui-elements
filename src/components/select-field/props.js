// @flow

export type SelectOptionValueProp = string | number | null;

export type SelectOptionProp = {
    avatarUrl?: string,
    displayText: string,
    id?: string | number,
    value: SelectOptionValueProp,
};
