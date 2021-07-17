/**
 * load locale data manually that is not the current locale so that
 * we can use it for unit testing
 */

import germanLocaleData from '@box/cldr-data/locale-data/de-DE';
import russianLocaleData from '@box/cldr-data/locale-data/ru-RU';
import japaneseLocaleData from '@box/cldr-data/locale-data/ja-JP';
import timezones, { findTimeZone, TimeZone, TimeZoneEntries } from '../timezones';

const germanZoneData = germanLocaleData.timezones;
const russianZoneData = russianLocaleData.timezones;
const japaneseZoneData = japaneseLocaleData.timezones;

const RealDate = Date;

function mockDate(isoDate: string) {
    const unixtime = new Date(isoDate).getTime();
    global.Date.now = jest.fn(() => {
        return unixtime;
    });
}

describe('util/timezones', () => {
    afterEach(() => {
        global.Date.now = RealDate.now;
    });

    test('should work in English', () => {
        mockDate('2020-06-01T00:00:00z');

        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        }); // default is English

        // no DST
        expect(zones['1']).toStrictEqual({
            name: 'Africa/Abidjan',
            nameLocalized: 'Africa/Abidjan',
            displayName: 'GMT+00:00 Africa/Abidjan GMT',
            abbreviationStandard: 'GMT',
            id: 1,
        });
        // has DST
        expect(zones['139']).toStrictEqual({
            name: 'America/Los_Angeles',
            nameLocalized: 'America/Los_Angeles',
            displayName: 'GMT-07:00 America/Los_Angeles PDT',
            abbreviationStandard: 'PST',
            abbreviationDaylight: 'PDT',
            enabled: true,
            id: 139,
        });
    });

    test('should be sensitive to the current date in English', () => {
        mockDate('2020-01-01T00:00:00z');

        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        }); // default is English
        // no DST
        expect(zones['1']).toStrictEqual({
            name: 'Africa/Abidjan',
            nameLocalized: 'Africa/Abidjan',
            displayName: 'GMT+00:00 Africa/Abidjan GMT',
            abbreviationStandard: 'GMT',
            id: 1,
        });
        // has DST
        expect(zones['139']).toStrictEqual({
            name: 'America/Los_Angeles',
            nameLocalized: 'America/Los_Angeles',
            displayName: 'GMT-08:00 America/Los_Angeles PST',
            abbreviationStandard: 'PST',
            abbreviationDaylight: 'PDT',
            enabled: true,
            id: 139,
        });
    });

    test('should work in the southern hemisphere standard time', () => {
        mockDate('2020-06-01T00:00:00z');
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        });
        expect(zones['321']).toStrictEqual({
            name: 'Australia/Melbourne',
            nameLocalized: 'Australia/Melbourne',
            displayName: 'GMT+10:00 Australia/Melbourne AEST',
            abbreviationStandard: 'AEST',
            abbreviationDaylight: 'AEDT',
            id: 321,
        });
    });

    test('should work in the southern hemisphere daylight time', () => {
        mockDate('2020-01-01T00:00:00z');
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        });
        expect(zones['321']).toStrictEqual({
            name: 'Australia/Melbourne',
            nameLocalized: 'Australia/Melbourne',
            displayName: 'GMT+11:00 Australia/Melbourne AEDT',
            abbreviationStandard: 'AEST',
            abbreviationDaylight: 'AEDT',
            id: 321,
        });
    });

    test('should be able to format partial hour offsets standard', () => {
        mockDate('2020-01-01T00:00:00z');

        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        }); // default is English
        // northern hemisphere
        expect(zones['184']).toStrictEqual({
            name: 'America/St_Johns',
            nameLocalized: 'America/St_Johns',
            displayName: 'GMT-03:30 America/St_Johns NST',
            abbreviationStandard: 'NST',
            abbreviationDaylight: 'NDT',
            enabled: true,
            id: 184,
        });
        // southern hemisphere
        expect(zones['487']).toStrictEqual({
            name: 'Pacific/Chatham',
            nameLocalized: 'Pacific/Chatham',
            displayName: 'GMT+13:45 Pacific/Chatham +1245/+1345',
            abbreviationStandard: '+1245/+1345',
            abbreviationDaylight: '+1245/+1345',
            id: 487,
        });
    });

    test('should be able to format partial hour offsets daylight', () => {
        mockDate('2020-06-01T00:00:00z');

        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        }); // default is English
        // northern hemisphere
        expect(zones['184']).toStrictEqual({
            name: 'America/St_Johns',
            nameLocalized: 'America/St_Johns',
            displayName: 'GMT-02:30 America/St_Johns NDT',
            abbreviationStandard: 'NST',
            abbreviationDaylight: 'NDT',
            enabled: true,
            id: 184,
        });
        // southern hemisphere
        expect(zones['487']).toStrictEqual({
            name: 'Pacific/Chatham',
            nameLocalized: 'Pacific/Chatham',
            displayName: 'GMT+12:45 Pacific/Chatham +1245/+1345',
            abbreviationStandard: '+1245/+1345',
            abbreviationDaylight: '+1245/+1345',
            id: 487,
        });
    });

    test('should work in German', () => {
        mockDate('2020-06-01T00:00:00z');
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
            tzData: germanZoneData,
        });
        expect(zones['295']).toStrictEqual({
            name: 'Asia/Yekaterinburg',
            nameLocalized: 'Jekaterinburg',
            displayName: 'GMT+05:00 Jekaterinburg +05',
            abbreviationStandard: '+05',
            enabled: true,
            id: 295,
        });
        expect(zones['301']).toStrictEqual({
            name: 'Atlantic/Faeroe',
            nameLocalized: 'Färöer',
            displayName: 'GMT+00:00 Färöer UTC',
            abbreviationStandard: 'UTC',
            id: 301,
        });
    });

    test('should work in Japanese', () => {
        mockDate('2020-06-01T00:00:00z');
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
            tzData: japaneseZoneData,
        });
        expect(zones['321']).toStrictEqual({
            name: 'Australia/Melbourne',
            nameLocalized: 'メルボルン',
            displayName: 'GMT+10:00 メルボルン AEST',
            abbreviationStandard: 'AEST',
            abbreviationDaylight: 'AEDT',
            id: 321,
        });
        expect(zones['390']).toStrictEqual({
            name: 'Europe/Amsterdam',
            nameLocalized: 'アムステルダム',
            displayName: 'GMT+02:00 アムステルダム CEST',
            abbreviationStandard: 'CET',
            abbreviationDaylight: 'CEST',
            enabled: true,
            id: 390,
        });
    });

    test('should work in Russian', () => {
        mockDate('2020-06-01T00:00:00z');
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
            tzData: russianZoneData,
        });
        expect(zones['295']).toStrictEqual({
            name: 'Asia/Yekaterinburg',
            nameLocalized: 'Екатеринбург',
            displayName: 'GMT+05:00 Екатеринбург +05',
            abbreviationStandard: '+05',
            enabled: true,
            id: 295,
        });
        expect(zones['402']).toStrictEqual({
            name: 'Europe/Dublin',
            nameLocalized: 'Дублин',
            displayName: 'GMT+01:00 Дублин IST/GMT',
            abbreviationStandard: 'IST/GMT',
            id: 402,
        });
    });

    test('should get all zones', () => {
        mockDate('2020-06-01T00:00:00z');
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        });
        expect(Object.keys(zones).length).toBe(551);
        expect(zones['1']).toStrictEqual({
            name: 'Africa/Abidjan',
            nameLocalized: 'Africa/Abidjan',
            displayName: 'GMT+00:00 Africa/Abidjan GMT',
            abbreviationStandard: 'GMT',
            id: 1,
        });
        expect(zones['139']).toStrictEqual({
            name: 'America/Los_Angeles',
            nameLocalized: 'America/Los_Angeles',
            displayName: 'GMT-07:00 America/Los_Angeles PDT',
            abbreviationStandard: 'PST',
            abbreviationDaylight: 'PDT',
            enabled: true,
            id: 139,
        });
    });

    test('should get only enabled zones', () => {
        mockDate('2020-01-01T00:00:00z');
        const zones: TimeZoneEntries = timezones({
            includeZones: 'enabled',
        });
        expect(Object.keys(zones).length).toBe(85);
        expect(zones['1']).toBeUndefined();
        expect(zones['139']).toStrictEqual({
            name: 'America/Los_Angeles',
            nameLocalized: 'America/Los_Angeles',
            displayName: 'GMT-08:00 America/Los_Angeles PST',
            abbreviationStandard: 'PST',
            abbreviationDaylight: 'PDT',
            enabled: true,
            id: 139,
        });
    });

    test('findzone should work in English', () => {
        mockDate('2020-06-01T00:00:00z');
        const zone: TimeZone = findTimeZone(139);
        expect(zone).toStrictEqual({
            name: 'America/Los_Angeles',
            nameLocalized: 'America/Los_Angeles',
            displayName: 'GMT-07:00 America/Los_Angeles PDT',
            abbreviationStandard: 'PST',
            abbreviationDaylight: 'PDT',
            enabled: true,
            id: 139,
        });
    });

    test('findzone should work in English with a string param', () => {
        mockDate('2020-06-01T00:00:00z');
        const zone: TimeZone = findTimeZone('139');
        expect(zone).toStrictEqual({
            name: 'America/Los_Angeles',
            nameLocalized: 'America/Los_Angeles',
            displayName: 'GMT-07:00 America/Los_Angeles PDT',
            abbreviationStandard: 'PST',
            abbreviationDaylight: 'PDT',
            enabled: true,
            id: 139,
        });
    });

    test('findzone should work with disabled zones in English', () => {
        mockDate('2020-06-01T00:00:00z');
        const zone: TimeZone = findTimeZone(1);
        expect(zone).toStrictEqual({
            name: 'Africa/Abidjan',
            nameLocalized: 'Africa/Abidjan',
            displayName: 'GMT+00:00 Africa/Abidjan GMT',
            abbreviationStandard: 'GMT',
            id: 1,
        });
    });

    test('findzone should work in Japanese', () => {
        mockDate('2020-06-01T00:00:00z');
        const zone: TimeZone = findTimeZone(139, {
            tzData: japaneseZoneData,
        });
        expect(zone).toStrictEqual({
            name: 'America/Los_Angeles',
            nameLocalized: 'ロサンゼルス',
            displayName: 'GMT-07:00 ロサンゼルス PDT',
            abbreviationStandard: 'PST',
            abbreviationDaylight: 'PDT',
            enabled: true,
            id: 139,
        });
    });

    test('findzone should be sensitive to the date in Japanese', () => {
        mockDate('2020-01-01T00:00:00z');
        const zone: TimeZone = findTimeZone(139, {
            tzData: japaneseZoneData,
        });
        expect(zone).toStrictEqual({
            name: 'America/Los_Angeles',
            nameLocalized: 'ロサンゼルス',
            displayName: 'GMT-08:00 ロサンゼルス PST',
            abbreviationStandard: 'PST',
            abbreviationDaylight: 'PDT',
            enabled: true,
            id: 139,
        });
    });
});
