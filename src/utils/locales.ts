/**
 * @file Functions to return the list of locales supported by Box
 * @author Box
 */
import data, { LanguagesData } from 'box-locale-data';

export interface BoxLanguage {
    id: number;
    name: string;
}

const { languages } = data;

const defaultDisplayNames: Array<BoxLanguage> = [
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

/**
 * Compararator for language names
 *
 * @param  {BoxLanguage} locale1
 * @param  {BoxLanguage} locale2
 *
 * @return {Array<string>}
 */
const localeComparator = (locale1: BoxLanguage, locale2: BoxLanguage) =>
    locale1.name.localeCompare(locale2.name, languages.bcp47Tag);

/**
 * Given the language id, returns the name for display (in its native languages)
 *
 * @param  {number} id
 *
 * @return string
 */
function getDisplayName(id: number): string {
    const lang: BoxLanguage | undefined = defaultDisplayNames.find(locale => locale.id === id);
    if (lang) {
        return lang.name;
    }
    throw new Error('Invalid Box language id!');
}

/**
 * Returns list of language names for display (in their native languages)
 *
 * @return {Array<string>}
 */
function getDisplayNames(): Array<string> {
    return defaultDisplayNames.map(locale => locale.name);
}

/**
 * Returns list of language names for display (in their native languages) with ids
 *
 * @return {Array<BoxLanguage>}
 */
function getDisplayNamesWithIds(): Array<BoxLanguage> {
    return defaultDisplayNames;
}

/**
 * Returns list of localized language names
 *
 * @param {LanguagesData} languagesData optional language data to be used to look up localized names instead of the default one
 *
 * @return {Array<string>}
 */
function getLocalizedNames(languagesData?: LanguagesData): Array<string> {
    const langData: LanguagesData = languagesData || languages;
    const sorted: Array<BoxLanguage> = langData.localizedNameList.sort(localeComparator);
    return sorted.map(locale => locale.name);
}

/**
 * Returns list of localized language names with ids
 *
 * @param {LanguagesData} languagesData optional language data to be used to look up localized names instead of the default one
 *
 * @return {Array<BoxLanguage>}
 */
function getLocalizedNamesWithIds(languagesData?: LanguagesData): Array<BoxLanguage> {
    const langData: LanguagesData = languagesData || languages;
    const localizedNames = langData.localizedNameList.sort(localeComparator);
    return localizedNames;
}

/**
 * Given the language id, returns the localized language name
 *
 * @param {number} id
 * @param {LanguagesData} languagesData optional language data to be used to look up localized name instead of the default one
 *
 * @return string
 */
function getLocalizedName(id: number, languagesData?: LanguagesData): string {
    const lang: BoxLanguage | undefined = getLocalizedNamesWithIds(languagesData).find(locale => locale.id === id);
    if (lang) {
        return lang.name;
    }
    throw new Error('Invalid Box language id!');
}

export {
    getDisplayName,
    getDisplayNames,
    getDisplayNamesWithIds,
    getLocalizedName,
    getLocalizedNames,
    getLocalizedNamesWithIds,
};
