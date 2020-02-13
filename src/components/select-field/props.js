// @flow

export type SelectOptionValueProp = string | number | null;

export type SelectOptionProp = {
    avatarUrl?: string,
    displayText: string,
    hasWarning?: boolean,
    id?: string | number,
    value: SelectOptionValueProp,
};
