import { List } from 'immutable';

export type OptionValue = string | number | null;

export type Option = {
    displayText?: string;
    hasWarning?: boolean;
    id?: string | number;
    isExternalUser?: boolean;
    /** @deprecated Use displayText. Kept for backwards compatibility. */
    text?: string;
    type?: string;
    value: OptionValue;
};

export type SelectedOptions = Array<Option> | List<Option>;

export type SuggestedPill = {
    email: string;
    id: number;
    name: string;
    text?: string;
    type?: string;
    value?: string;
};

export type RoundOption = {
    hasWarning?: boolean;
    id?: number | string;
    isExternalUser?: boolean;
    type?: string;
} & Option;

export type SelectedRoundOptions = Array<RoundOption> | List<RoundOption>;

export type SuggestedPills = Array<SuggestedPill>;

export type SuggestedPillsFilter = keyof SuggestedPill;

export type GetPillImageUrlData = {
    id: string | number;
    [key: string]: unknown;
};

export type GetPillImageUrl = (data: GetPillImageUrlData) => string | Promise<string | null | undefined>;
