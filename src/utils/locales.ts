/**
 * @flow
 * @file Functions to return the list of locales supported by Box
 * @author Box
 */
import data, { LanguagesData, NameItem } from 'box-locale-data';

const defaultDisplayNames: Array<NameItem> = [
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

function getDisplayNames(): Array<string> {
    return defaultDisplayNames.map(entry => {
        return entry.name;
    });
}

function getDisplayNamesWithIds(): Array<NameItem> {
    return defaultDisplayNames;
}

function getLocalizedNames(langdata: LanguagesData = data.languages): Array<string> {
    return langdata.localizedNameList.map((name: NameItem) => {
        return name.name;
    });
}

function getLocalizedNamesWithIds(langdata: LanguagesData = data.languages): Array<NameItem> {
    return langdata.localizedNameList;
}

export { getDisplayNames, getDisplayNamesWithIds, getLocalizedNames, getLocalizedNamesWithIds, NameItem };
