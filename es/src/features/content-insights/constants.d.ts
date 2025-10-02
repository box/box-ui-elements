export declare const METRIC: Readonly<{
    DOWNLOADS: "DOWNLOADS";
    PREVIEWS: "PREVIEWS";
    USERS: "USERS";
}>;
export declare const PERIOD: Readonly<{
    WEEK: "week";
    MONTH: "month";
    THREEMONTHS: "threemonths";
    YEAR: "year";
}>;
export declare const PRESET_TIMES: Readonly<{
    ONE_WEEK: "one_week";
    TWO_WEEKS: "two_weeks";
    ONE_MONTH: "one_month";
    TWO_MONTHS: "two_months";
    THREE_MONTHS: "three_months";
    SIX_MONTHS: "six_months";
    ONE_YEAR: "one_year";
    TWO_YEARS: "two_years";
}>;
export declare const PRESET_TO_TIMESTAMPS_MAP: {
    readonly week: {
        readonly currentPeriod: "one_week";
        readonly previousPeriod: "two_weeks";
    };
    readonly month: {
        readonly currentPeriod: "one_month";
        readonly previousPeriod: "two_months";
    };
    readonly threemonths: {
        readonly currentPeriod: "three_months";
        readonly previousPeriod: "six_months";
    };
    readonly year: {
        readonly currentPeriod: "one_year";
        readonly previousPeriod: "two_years";
    };
};
