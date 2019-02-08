// @flow
import { List } from 'immutable';

export type SelectedOption = {
    id?: number,
    name?: string,
    text: string,
    value: number | string,
};

export type SelectedOptions = Array<SelectedOption> | List<SelectedOption>;

export type SuggestedPill = {
    email: string,
    id: number,
    name: string,
    text?: string,
    type?: string,
    value?: string,
};

export type SuggestedPills = Array<SuggestedPill>;
