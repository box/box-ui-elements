/**
 * @file Used to get the list of locales supported by Box
 * @author Box
 */
import loadLocaleData from '@box/cldr-data';
import { LocaleData, LanguagesData } from '@box/cldr-data/types';

export interface BoxLanguage {
    id: number;
    name: string;
}

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_DISPLAY_NAMES: Array<BoxLanguage> = [
    { id: 4, name: 'English (US)' },
    { id: 59, name: 'English (UK)' },
    { id: 68, name: 'Dansk' },
    { id: 18, name: 'Deutsch' },
    { id: 67, name: 'English (Australia)' },
    { id: 66, name: 'English (Canada)' },
    { id: 10, name: 'Español' },
    { id: 72, name: 'Español (Latinoamérica)' },
    { id: 21, name: 'Français' },
    { id: 65, name: 'Français (Canada)' },
    { id: 16, name: 'Italiano' },
    { id: 24, name: 'Nederlands' },
    { id: 69, name: 'Norsk (Bokmål)' },
    { id: 30, name: 'Polski' },
    { id: 14, name: 'Português' },
    { id: 61, name: 'Suomi' },
    { id: 57, name: 'Svenska' },
    { id: 49, name: 'Türkçe' },
    { id: 8, name: 'Русский' },
    { id: 71, name: 'हिन्दी' },
    { id: 70, name: 'বাংলা' },
    { id: 19, name: '日本語' },
    { id: 6, name: '简体中文' },
    { id: 63, name: '繁體中文' },
    { id: 55, name: '한국어' },
];

class Locales {
    locale: string;

    localeData: LocaleData;

    languages: LanguagesData;

    /**
     * [constructor]
     *
     * @return {void}
     */
    constructor(locale?: string) {
        this.locale = locale || DEFAULT_LOCALE;
        this.localeData = loadLocaleData(this.locale);
        this.languages = this.localeData.languages;
    }

    /**
     * Compararator for language names
     *
     * @param  {BoxLanguage} locale1
     * @param  {BoxLanguage} locale2
     *
     * @return {Array<string>}
     */
    localeComparator = (locale1: BoxLanguage, locale2: BoxLanguage) => locale1.name.localeCompare(locale2.name);

    /**
     * Returns list of language names for display (in their native languages)
     *
     * @return {Array<string>}
     */
    getDisplayNames(): Array<string> {
        const displayNames: Array<string> = [];
        DEFAULT_DISPLAY_NAMES.forEach(locale => displayNames.push(locale.name));
        return displayNames;
    }

    /**
     * Returns list of language names for display (in their native languages) with ids
     *
     * @return {Array<BoxLanguage>}
     */
    getDisplayNamesWithIds(): Array<BoxLanguage> {
        return DEFAULT_DISPLAY_NAMES;
    }

    /**
     * Returns list of localized language names
     *
     * @return {Array<string>}
     */
    getLocalizedNames(): Array<string> {
        const sorted: Array<BoxLanguage> = this.languages.localizedNameList.sort(this.localeComparator);
        const localizedNames: Array<string> = [];
        sorted.forEach(locale => localizedNames.push(locale.name));
        return localizedNames;
    }

    /**
     * Returns list of localized language names with ids
     *
     * @return {Array<BoxLanguage>}
     */
    getLocalizedNamesWithIds(): Array<BoxLanguage> {
        const localizedNames: Array<BoxLanguage> = this.languages.localizedNameList.sort(this.localeComparator);
        return localizedNames;
    }
}

export default Locales;
