/**
 * @flow
 * @file Functions to return the list of locales supported by Box
 * @author Box
 */
import { languages } from 'box-locale-data';

const defaultDisplayNames = [
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

const localeComparator = (locale1, locale2) => locale1.name.localeCompare(locale2.name);

function getDisplayNames(): Array<string> {
    const displayNames = [];
    defaultDisplayNames.forEach(locale => displayNames.push(locale.name));
    return displayNames;
}

function getDisplayNamesWithIds(): Array<Object> {
    return defaultDisplayNames;
}

function getLocalizedNames(): Array<string> {
    const sorted = languages.localizedNameList.sort(localeComparator);
    const localizedNames = [];
    sorted.forEach(locale => localizedNames.push(locale.name));
    return localizedNames;
}

function getLocalizedNamesWithIds(): Array<Object> {
    const localizedNames = languages.localizedNameList.sort(localeComparator);
    return localizedNames;
}

export { getDisplayNames, getDisplayNamesWithIds, getLocalizedNames, getLocalizedNamesWithIds };
