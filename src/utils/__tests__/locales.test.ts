import germanLocaleData from '@box/cldr-data/locale-data/de-DE';
import russianLocaleData from '@box/cldr-data/locale-data/ru-RU';
import japaneseLocaleData from '@box/cldr-data/locale-data/ja-JP';
import { getDisplayNames, getDisplayNamesWithIds, getLocalizedNames, getLocalizedNamesWithIds } from '../locales';

const germanLanguagesData = germanLocaleData.languages;
const russianLanguagesData = russianLocaleData.languages;
const japaneseLanguagesData = japaneseLocaleData.languages;

describe('util/locales in English', () => {
    test('should return display names in order', () => {
        expect(getDisplayNames()).toEqual([
            'English (US)',
            'English (UK)',
            'Dansk',
            'Deutsch',
            'English (Australia)',
            'English (Canada)',
            'Español',
            'Español (Latinoamérica)',
            'Français',
            'Français (Canada)',
            'Italiano',
            'Nederlands',
            'Norsk (Bokmål)',
            'Polski',
            'Português',
            'Suomi',
            'Svenska',
            'Türkçe',
            'Русский',
            'हिन्दी',
            'বাংলা',
            '日本語',
            '简体中文',
            '繁體中文',
            '한국어',
        ]);
    });

    test('should return display names with ids in order', () => {
        expect(getDisplayNamesWithIds()).toEqual([
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
        ]);
    });

    test('should return display names with ids in order', () => {
        expect(getLocalizedNames()).toEqual([
            'Australian English',
            'Bangla',
            'British English',
            'Canadian English',
            'Canadian French',
            'Danish',
            'Dutch',
            'English',
            'Finnish',
            'French',
            'German',
            'Hindi',
            'Italian',
            'Japanese',
            'Korean',
            'Latin American Spanish',
            'Norwegian Bokmål',
            'Polish',
            'Portuguese',
            'Russian',
            'Simplified Chinese',
            'Spanish',
            'Swedish',
            'Traditional Chinese',
            'Turkish',
        ]);
    });

    test('should return display names with ids in order', () => {
        expect(getLocalizedNamesWithIds()).toEqual([
            { id: 67, name: 'Australian English' },
            { id: 70, name: 'Bangla' },
            { id: 59, name: 'British English' },
            { id: 66, name: 'Canadian English' },
            { id: 65, name: 'Canadian French' },
            { id: 68, name: 'Danish' },
            { id: 24, name: 'Dutch' },
            { id: 4, name: 'English' },
            { id: 61, name: 'Finnish' },
            { id: 21, name: 'French' },
            { id: 18, name: 'German' },
            { id: 71, name: 'Hindi' },
            { id: 16, name: 'Italian' },
            { id: 19, name: 'Japanese' },
            { id: 55, name: 'Korean' },
            { id: 72, name: 'Latin American Spanish' },
            { id: 69, name: 'Norwegian Bokmål' },
            { id: 30, name: 'Polish' },
            { id: 14, name: 'Portuguese' },
            { id: 8, name: 'Russian' },
            { id: 6, name: 'Simplified Chinese' },
            { id: 10, name: 'Spanish' },
            { id: 57, name: 'Swedish' },
            { id: 63, name: 'Traditional Chinese' },
            { id: 49, name: 'Turkish' },
        ]);
    });
});

describe('util/locales in German', () => {
    test('should return display names with ids in order', () => {
        expect(getLocalizedNames(germanLanguagesData)).toEqual([
            'Bengalisch',
            'Chinesisch (traditionell)',
            'Chinesisch (vereinfacht)',
            'Dänisch',
            'Deutsch',
            'Englisch',
            'Englisch (Australien)',
            'Englisch (Kanada)',
            'Englisch (Vereinigtes Königreich)',
            'Finnisch',
            'Französisch',
            'Französisch (Kanada)',
            'Hindi',
            'Italienisch',
            'Japanisch',
            'Koreanisch',
            'Niederländisch',
            'Norwegisch Bokmål',
            'Polnisch',
            'Portugiesisch',
            'Russisch',
            'Schwedisch',
            'Spanisch',
            'Spanisch (Lateinamerika)',
            'Türkisch',
        ]);
    });

    test('should return display names with ids in order', () => {
        expect(getLocalizedNamesWithIds(germanLanguagesData)).toEqual([
            {
                id: 70,
                name: 'Bengalisch',
            },
            {
                id: 63,
                name: 'Chinesisch (traditionell)',
            },
            {
                id: 6,
                name: 'Chinesisch (vereinfacht)',
            },
            {
                id: 68,
                name: 'Dänisch',
            },
            {
                id: 18,
                name: 'Deutsch',
            },
            {
                id: 4,
                name: 'Englisch',
            },
            {
                id: 67,
                name: 'Englisch (Australien)',
            },
            {
                id: 66,
                name: 'Englisch (Kanada)',
            },
            {
                id: 59,
                name: 'Englisch (Vereinigtes Königreich)',
            },
            {
                id: 61,
                name: 'Finnisch',
            },
            {
                id: 21,
                name: 'Französisch',
            },
            {
                id: 65,
                name: 'Französisch (Kanada)',
            },
            {
                id: 71,
                name: 'Hindi',
            },
            {
                id: 16,
                name: 'Italienisch',
            },
            {
                id: 19,
                name: 'Japanisch',
            },
            {
                id: 55,
                name: 'Koreanisch',
            },
            {
                id: 24,
                name: 'Niederländisch',
            },
            {
                id: 69,
                name: 'Norwegisch Bokmål',
            },
            {
                id: 30,
                name: 'Polnisch',
            },
            {
                id: 14,
                name: 'Portugiesisch',
            },
            {
                id: 8,
                name: 'Russisch',
            },
            {
                id: 57,
                name: 'Schwedisch',
            },
            {
                id: 10,
                name: 'Spanisch',
            },
            {
                id: 72,
                name: 'Spanisch (Lateinamerika)',
            },
            {
                id: 49,
                name: 'Türkisch',
            },
        ]);
    });
});

describe('util/locales in Japanese', () => {
    test('should return display names with ids in order', () => {
        expect(getLocalizedNames(japaneseLanguagesData)).toEqual([
            'イギリス英語',
            'イタリア語',
            'オーストラリア英語',
            'オランダ語',
            'カナダ英語',
            'スウェーデン語',
            'スペイン語',
            'スペイン語 (ラテンアメリカ)',
            'デンマーク語',
            'ドイツ語',
            'トルコ語',
            'ノルウェー語(ブークモール)',
            'ヒンディー語',
            'フィンランド語',
            'フランス語',
            'フランス語 (カナダ)',
            'ベンガル語',
            'ポーランド語',
            'ポルトガル語',
            'ロシア語',
            '日本語',
            '簡体中国語',
            '繁体中国語',
            '英語',
            '韓国語',
        ]);
    });

    test('should return display names with ids in order', () => {
        expect(getLocalizedNamesWithIds(japaneseLanguagesData)).toEqual([
            {
                id: 59,
                name: 'イギリス英語',
            },
            {
                id: 16,
                name: 'イタリア語',
            },
            {
                id: 67,
                name: 'オーストラリア英語',
            },
            {
                id: 24,
                name: 'オランダ語',
            },
            {
                id: 66,
                name: 'カナダ英語',
            },
            {
                id: 57,
                name: 'スウェーデン語',
            },
            {
                id: 10,
                name: 'スペイン語',
            },
            {
                id: 72,
                name: 'スペイン語 (ラテンアメリカ)',
            },
            {
                id: 68,
                name: 'デンマーク語',
            },
            {
                id: 18,
                name: 'ドイツ語',
            },
            {
                id: 49,
                name: 'トルコ語',
            },
            {
                id: 69,
                name: 'ノルウェー語(ブークモール)',
            },
            {
                id: 71,
                name: 'ヒンディー語',
            },
            {
                id: 61,
                name: 'フィンランド語',
            },
            {
                id: 21,
                name: 'フランス語',
            },
            {
                id: 65,
                name: 'フランス語 (カナダ)',
            },
            {
                id: 70,
                name: 'ベンガル語',
            },
            {
                id: 30,
                name: 'ポーランド語',
            },
            {
                id: 14,
                name: 'ポルトガル語',
            },
            {
                id: 8,
                name: 'ロシア語',
            },
            {
                id: 19,
                name: '日本語',
            },
            {
                id: 6,
                name: '簡体中国語',
            },
            {
                id: 63,
                name: '繁体中国語',
            },
            {
                id: 4,
                name: '英語',
            },
            {
                id: 55,
                name: '韓国語',
            },
        ]);
    });
});

describe('util/locales in Russian', () => {
    test('should return display names with ids in order', () => {
        expect(getLocalizedNames(russianLanguagesData)).toEqual([
            'австралийский английский',
            'английский',
            'бенгальский',
            'британский английский',
            'датский',
            'испанский',
            'итальянский',
            'канадский английский',
            'канадский французский',
            'китайский, традиционное письмо',
            'китайский, упрощенное письмо',
            'корейский',
            'латиноамериканский испанский',
            'немецкий',
            'нидерландский',
            'норвежский букмол',
            'польский',
            'португальский',
            'русский',
            'турецкий',
            'финский',
            'французский',
            'хинди',
            'шведский',
            'японский',
        ]);
    });

    test('should return display names with ids in order', () => {
        expect(getLocalizedNamesWithIds(russianLanguagesData)).toEqual([
            {
                id: 67,
                name: 'австралийский английский',
            },
            {
                id: 4,
                name: 'английский',
            },
            {
                id: 70,
                name: 'бенгальский',
            },
            {
                id: 59,
                name: 'британский английский',
            },
            {
                id: 68,
                name: 'датский',
            },
            {
                id: 10,
                name: 'испанский',
            },
            {
                id: 16,
                name: 'итальянский',
            },
            {
                id: 66,
                name: 'канадский английский',
            },
            {
                id: 65,
                name: 'канадский французский',
            },
            {
                id: 63,
                name: 'китайский, традиционное письмо',
            },
            {
                id: 6,
                name: 'китайский, упрощенное письмо',
            },
            {
                id: 55,
                name: 'корейский',
            },
            {
                id: 72,
                name: 'латиноамериканский испанский',
            },
            {
                id: 18,
                name: 'немецкий',
            },
            {
                id: 24,
                name: 'нидерландский',
            },
            {
                id: 69,
                name: 'норвежский букмол',
            },
            {
                id: 30,
                name: 'польский',
            },
            {
                id: 14,
                name: 'португальский',
            },
            {
                id: 8,
                name: 'русский',
            },
            {
                id: 49,
                name: 'турецкий',
            },
            {
                id: 61,
                name: 'финский',
            },
            {
                id: 21,
                name: 'французский',
            },
            {
                id: 71,
                name: 'хинди',
            },
            {
                id: 57,
                name: 'шведский',
            },
            {
                id: 19,
                name: 'японский',
            },
        ]);
    });
});
