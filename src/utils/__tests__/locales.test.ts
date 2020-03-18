import {
    getDisplayName,
    getDisplayNames,
    getDisplayNamesWithIds,
    getLocalizedName,
    getLocalizedNames,
    getLocalizedNamesWithIds,
} from '../locales';

const japaneseLanguagesData = {
    id: 19,
    bcp47Tag: 'ja-JP',
    name: 'Japanese',
    localizedName: '日本語',
    localizedNameList: [
        {
            id: 4,
            name: '英語',
        },
        {
            id: 6,
            name: '簡体中国語',
        },
        {
            id: 8,
            name: 'ロシア語',
        },
        {
            id: 10,
            name: 'スペイン語',
        },
        {
            id: 14,
            name: 'ポルトガル語',
        },
        {
            id: 16,
            name: 'イタリア語',
        },
        {
            id: 18,
            name: 'ドイツ語',
        },
        {
            id: 19,
            name: '日本語',
        },
        {
            id: 21,
            name: 'フランス語',
        },
        {
            id: 24,
            name: 'オランダ語',
        },
        {
            id: 30,
            name: 'ポーランド語',
        },
        {
            id: 49,
            name: 'トルコ語',
        },
        {
            id: 55,
            name: '韓国語',
        },
        {
            id: 57,
            name: 'スウェーデン語',
        },
        {
            id: 59,
            name: 'イギリス英語',
        },
        {
            id: 61,
            name: 'フィンランド語',
        },
        {
            id: 63,
            name: '繁体中国語',
        },
        {
            id: 65,
            name: 'フランス語 (カナダ)',
        },
        {
            id: 66,
            name: 'カナダ英語',
        },
        {
            id: 67,
            name: 'オーストラリア英語',
        },
        {
            id: 68,
            name: 'デンマーク語',
        },
        {
            id: 69,
            name: 'ノルウェー語(ブークモール)',
        },
        {
            id: 70,
            name: 'ベンガル語',
        },
        {
            id: 71,
            name: 'ヒンディー語',
        },
        {
            id: 72,
            name: 'スペイン語 (ラテンアメリカ)',
        },
    ],
};

describe('util/locales', () => {
    describe.each([
        [4, 'English (US)'],
        [59, 'English (UK)'],
        [10, 'Español'],
        [21, 'Français'],
        [19, '日本語'],
        [6, '简体中文'],
    ])('%o', (id, expected) => {
        test('should return display name given the id', () => {
            expect(getDisplayName(id)).toEqual(expected);
        });
    });
    test('should throw error when given the invalid id', () => {
        expect(() => getDisplayName(12345)).toThrow(/Invalid Box language id/);
    });
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
    describe.each([
        [4, 'English'],
        [59, 'British English'],
        [10, 'Spanish'],
        [21, 'French'],
        [19, 'Japanese'],
        [6, 'Simplified Chinese'],
    ])('%o', (id, expected) => {
        test('should return display name given the id', () => {
            expect(getLocalizedName(id)).toEqual(expected);
        });
    });
    describe.each([
        [4, '英語'],
        [59, 'イギリス英語'],
        [10, 'スペイン語'],
        [21, 'フランス語'],
        [19, '日本語'],
        [6, '簡体中国語'],
    ])('%o', (id, expected) => {
        test('should return display name given the id and Japanese languages data', () => {
            expect(getLocalizedName(id, japaneseLanguagesData)).toEqual(expected);
        });
    });
    test('should throw error when given the invalid id', () => {
        expect(() => getLocalizedName(12345)).toThrow(/Invalid Box language id/);
    });
    test('should return localized names in order', () => {
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
    test('should return localized names in order in Japanese', () => {
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
    test('should return localized names with ids in order', () => {
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
    test('should return localized names with ids in order in Japanese', () => {
        expect(getLocalizedNamesWithIds(japaneseLanguagesData)).toEqual([
            { id: 59, name: 'イギリス英語' },
            { id: 16, name: 'イタリア語' },
            { id: 67, name: 'オーストラリア英語' },
            { id: 24, name: 'オランダ語' },
            { id: 66, name: 'カナダ英語' },
            { id: 57, name: 'スウェーデン語' },
            { id: 10, name: 'スペイン語' },
            { id: 72, name: 'スペイン語 (ラテンアメリカ)' },
            { id: 68, name: 'デンマーク語' },
            { id: 18, name: 'ドイツ語' },
            { id: 49, name: 'トルコ語' },
            { id: 69, name: 'ノルウェー語(ブークモール)' },
            { id: 71, name: 'ヒンディー語' },
            { id: 61, name: 'フィンランド語' },
            { id: 21, name: 'フランス語' },
            { id: 65, name: 'フランス語 (カナダ)' },
            { id: 70, name: 'ベンガル語' },
            { id: 30, name: 'ポーランド語' },
            { id: 14, name: 'ポルトガル語' },
            { id: 8, name: 'ロシア語' },
            { id: 19, name: '日本語' },
            { id: 6, name: '簡体中国語' },
            { id: 63, name: '繁体中国語' },
            { id: 4, name: '英語' },
            { id: 55, name: '韓国語' },
        ]);
    });
});
