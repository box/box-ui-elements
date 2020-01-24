const cldr = require('cldr-data');

const boxLanguages = {
    'en-US': {
        id: 4,
        bcp47Tag: 'en-US',
        cldrTag: 'en',
        name: 'English (US)',
        displayName: 'English (US)',
        displayOrder: 1,
    },
    'zh-CN': {
        id: 6,
        bcp47Tag: 'zh-CN',
        cldrTag: 'zh-Hans',
        name: 'Chinese (Simplified)',
        displayName: '简体中文',
        displayOrder: 23,
    },
    'ru-RU': { id: 8, bcp47Tag: 'ru-RU', cldrTag: 'ru', name: 'Russian', displayName: 'Русский', displayOrder: 19 },
    'es-ES': { id: 10, bcp47Tag: 'es-ES', cldrTag: 'es', name: 'Spanish', displayName: 'Español', displayOrder: 7 },
    'pt-BR': {
        id: 14,
        bcp47Tag: 'pt-BR',
        cldrTag: 'pt',
        name: 'Portuguese',
        displayName: 'Português',
        displayOrder: 15,
    },
    'it-IT': { id: 16, bcp47Tag: 'it-IT', cldrTag: 'it', name: 'Italian', displayName: 'Italiano', displayOrder: 11 },
    'de-DE': { id: 18, bcp47Tag: 'de-DE', cldrTag: 'de', name: 'German', displayName: 'Deutsch', displayOrder: 4 },
    'ja-JP': { id: 19, bcp47Tag: 'ja-JP', cldrTag: 'ja', name: 'Japanese', displayName: '日本語', displayOrder: 22 },
    'fr-FR': { id: 21, bcp47Tag: 'fr-FR', cldrTag: 'fr', name: 'French', displayName: 'Français', displayOrder: 9 },
    'nl-NL': { id: 24, bcp47Tag: 'nl-NL', cldrTag: 'nl', name: 'Dutch', displayName: 'Nederlands', displayOrder: 12 },
    'pl-PL': { id: 30, bcp47Tag: 'pl-PL', cldrTag: 'pl', name: 'Polish', displayName: 'Polski', displayOrder: 14 },
    'tr-TR': { id: 49, bcp47Tag: 'tr-TR', cldrTag: 'tr', name: 'Turkish', displayName: 'Türkçe', displayOrder: 18 },
    'ko-KR': { id: 55, bcp47Tag: 'ko-KR', cldrTag: 'ko', name: 'Korean', displayName: '한국어', displayOrder: 25 },
    'sv-SE': { id: 57, bcp47Tag: 'sv-SE', cldrTag: 'sv', name: 'Swedish', displayName: 'Svenska', displayOrder: 17 },
    'en-GB': {
        id: 59,
        bcp47Tag: 'en-GB',
        cldrTag: 'en-GB',
        name: 'English (UK)',
        displayName: 'English (UK)',
        displayOrder: 2,
    },
    'fi-FI': { id: 61, bcp47Tag: 'fi-FI', cldrTag: 'fi', name: 'Finnish', displayName: 'Suomi', displayOrder: 16 },
    'zh-TW': {
        id: 63,
        bcp47Tag: 'zh-TW',
        cldrTag: 'zh-Hant',
        name: 'Chinese (Traditional)',
        displayName: '繁體中文',
        displayOrder: 24,
    },
    'fr-CA': {
        id: 65,
        bcp47Tag: 'fr-CA',
        cldrTag: 'fr-CA',
        name: 'French (Canada)',
        displayName: 'Français (Canada)',
        displayOrder: 10,
    },
    'en-CA': {
        id: 66,
        bcp47Tag: 'en-CA',
        cldrTag: 'en-CA',
        name: 'English (Canada)',
        displayName: 'English (Canada)',
        displayOrder: 6,
    },
    'en-AU': {
        id: 67,
        bcp47Tag: 'en-AU',
        cldrTag: 'en-AU',
        name: 'English (Australia)',
        displayName: 'English (Australia)',
        displayOrder: 5,
    },
    'da-DK': { id: 68, bcp47Tag: 'da-DK', cldrTag: 'da', name: 'Danish', displayName: 'Dansk', displayOrder: 3 },
    'nb-NO': {
        id: 69,
        bcp47Tag: 'nb-NO',
        cldrTag: 'nb',
        name: 'Norwegian (Bokmål)',
        displayName: 'Norsk (Bokmål)',
        displayOrder: 13,
    },
    'bn-IN': { id: 70, bcp47Tag: 'bn-IN', cldrTag: 'bn', name: 'Bengali', displayName: 'বাংলা', displayOrder: 21 },
    'hi-IN': { id: 71, bcp47Tag: 'hi-IN', cldrTag: 'hi', name: 'Hindi', displayName: 'हिन्दी', displayOrder: 20 },
    'es-419': {
        id: 72,
        bcp47Tag: 'es-419',
        cldrTag: 'es-419',
        name: 'Spanish (Latin America)',
        displayName: 'Español (Latinoamérica)',
        displayOrder: 8,
    },
};

/**
 * Function to extract language data from cldr-data and merge with box language data.
 *
 * @param {string} language - language from @box/languages to extract data
 * @return {Object} object containing data for the input language
 */
const buildLanguageLocaleData = language => {
    const data = boxLanguages[language] || boxLanguages['en-US'];
    const tag = data.cldrTag;
    const entireMain = cldr.entireMainFor(tag);
    entireMain.forEach(main => {
        const top = main.main[tag];
        if (typeof top.localeDisplayNames !== 'undefined' && typeof top.localeDisplayNames.languages !== 'undefined') {
            const displayNameList = [];
            const localizedNameList = [];
            Object.keys(boxLanguages).forEach(lang => {
                const boxLanguage = boxLanguages[lang] || boxLanguages['en-US'];
                const localeId = boxLanguage.id;
                const localeTag = boxLanguage.cldrTag;
                const localeName = top.localeDisplayNames.languages[localeTag];
                const localizedName = { id: localeId, name: localeName };
                const displayName = {
                    id: localeId,
                    name: boxLanguage.displayName,
                    displayOrder: boxLanguage.displayOrder,
                };
                localizedNameList.push(localizedName);
                displayNameList.push(displayName);
            });
            data.localizedNameList = localizedNameList;
            data.displayNameList = displayNameList;
        }
    });
    return data;
};

module.exports = buildLanguageLocaleData;
