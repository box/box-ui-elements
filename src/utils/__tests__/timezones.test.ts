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

describe('util/timezones', () => {
    test('should work in English', () => {
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        }); // default is English
        expect(zones['1']).toStrictEqual({
            name: 'Africa/Abidjan',
            displayName: 'GMT+00:00 Africa/Abidjan GMT',
            id: 1,
        });
        expect(zones['139']).toStrictEqual({
            name: 'America/Los_Angeles',
            displayName: 'GMT-08:00 America/Los_Angeles PST',
            enabled: true,
            id: 139,
        });
    });

    test('should work in German', () => {
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
            tzData: germanZoneData,
        });
        expect(zones['295']).toStrictEqual({
            name: 'Asia/Yekaterinburg',
            displayName: 'GMT+05:00 Jekaterinburg +05',
            enabled: true,
            id: 295,
        });
        expect(zones['301']).toStrictEqual({
            name: 'Atlantic/Faeroe',
            displayName: 'GMT+00:00 Färöer UTC',
            id: 301,
        });
    });

    test('should work in Japanese', () => {
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
            tzData: japaneseZoneData,
        });
        expect(zones['321']).toStrictEqual({
            name: 'Australia/Melbourne',
            displayName: 'GMT+10:00 メルボルン AEST',
            id: 321,
        });
        expect(zones['390']).toStrictEqual({
            name: 'Europe/Amsterdam',
            displayName: 'GMT+01:00 アムステルダム CET',
            enabled: true,
            id: 390,
        });
    });

    test('should work in Russian', () => {
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
            tzData: russianZoneData,
        });
        expect(zones['295']).toStrictEqual({
            name: 'Asia/Yekaterinburg',
            displayName: 'GMT+05:00 Екатеринбург +05',
            enabled: true,
            id: 295,
        });
        expect(zones['402']).toStrictEqual({
            name: 'Europe/Dublin',
            displayName: 'GMT+01:00 Дублин IST/GMT',
            id: 402,
        });
    });

    test('should get all zones', () => {
        const zones: TimeZoneEntries = timezones({
            includeZones: 'all',
        });
        expect(Object.keys(zones).length).toBe(551);
        expect(zones['1']).toStrictEqual({
            name: 'Africa/Abidjan',
            displayName: 'GMT+00:00 Africa/Abidjan GMT',
            id: 1,
        });
        expect(zones['139']).toStrictEqual({
            name: 'America/Los_Angeles',
            displayName: 'GMT-08:00 America/Los_Angeles PST',
            enabled: true,
            id: 139,
        });
    });

    test('should get only enabled zones', () => {
        const zones: TimeZoneEntries = timezones({
            includeZones: 'enabled',
        });
        expect(Object.keys(zones).length).toBe(85);
        expect(zones['1']).toBeUndefined();
        expect(zones['139']).toStrictEqual({
            name: 'America/Los_Angeles',
            displayName: 'GMT-08:00 America/Los_Angeles PST',
            enabled: true,
            id: 139,
        });
    });

    test('findzone should work in English', () => {
        const zone: TimeZone = findTimeZone(139);
        expect(zone).toStrictEqual({
            name: 'America/Los_Angeles',
            displayName: 'GMT-08:00 America/Los_Angeles PST',
            enabled: true,
            id: 139,
        });
    });

    test('findzone should work in English with a string param', () => {
        const zone: TimeZone = findTimeZone('139');
        expect(zone).toStrictEqual({
            name: 'America/Los_Angeles',
            displayName: 'GMT-08:00 America/Los_Angeles PST',
            enabled: true,
            id: 139,
        });
    });

    test('findzone should work with disabled zones in English', () => {
        const zone: TimeZone = findTimeZone(1);
        expect(zone).toStrictEqual({
            name: 'Africa/Abidjan',
            displayName: 'GMT+00:00 Africa/Abidjan GMT',
            id: 1,
        });
    });

    test('findzone should work in Japanese', () => {
        const zone: TimeZone = findTimeZone(139, {
            tzData: japaneseZoneData,
        });
        expect(zone).toStrictEqual({
            name: 'America/Los_Angeles',
            displayName: 'GMT-08:00 ロサンゼルス PST',
            enabled: true,
            id: 139,
        });
    });
});
