/**
 * @flow
 * @file Functions to return the list of locales supported by Box
 * @author Box
 */
import { languages } from 'box-locale-data';

const boxLocaleComparator = (locale1, locale2) => locale1.displayOrder - locale2.displayOrder;
const localeComparator = (locale1, locale2) => locale1.name.localeCompare(locale2.name);

function getDisplayNames(): Array<string> {
    const sorted = languages.displayNameList.sort(boxLocaleComparator);
    const displayNames = [];
    sorted.forEach(locale => displayNames.push(locale.name));
    return displayNames;
}

function getDisplayNamesWithIds(): Array<string> {
    const sorted = languages.displayNameList.sort(boxLocaleComparator);
    const displayNames = [];
    sorted.forEach(locale => displayNames.push({ id: locale.id, name: locale.name }));
    return displayNames;
}

function getLocalizedNames(): Array<String> {
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
