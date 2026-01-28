/* eslint-disable */
// @ts-nocheck

declare const global: {
    FEATURE_FLAGS: Record<string, boolean>;
    FILE_ID: string;
    FOLDER_ID: string;
    TOKEN: string;
};

declare module '*.md' {
    const content: string;
    export = content;
}

declare module '@box/cldr-data/locale-data/*' {
    import { LocaleData } from '@box/cldr-data/types.d.ts';
    const data: LocaleData;
    export default data;
}
