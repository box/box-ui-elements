/**
 * @file Function to provide a localized list of time zones that Box supports
 * @author Box
 */

import data, { TimeZone, TimeZoneList } from 'box-locale-data';

export { TimeZone };

const { timezones: boxzones } = data;

export interface TimeZoneOptions {
    tzData?: TimeZoneList;
    includeZones?: 'all' | 'enabled';
}

export interface TimeZoneEntries {
    [id: string]: TimeZone;
}

function timezones(options: TimeZoneOptions = {}): TimeZoneEntries {
    const zones: TimeZoneEntries = {};

    const { includeZones = 'enabled' }: { includeZones?: string } = options;

    // used the passed in info first. If it is not there, fall back to
    // the one we loaded above from the 'box-locale-data' alias
    let { tzData }: { tzData?: TimeZoneList } = options;
    if (!tzData) {
        tzData = boxzones;
    }

    tzData.forEach(zone => {
        if (includeZones === 'all' || zone.enabled) {
            zones[String(zone.id)] = zone;
        }
    });

    return zones;
}

export function findTimeZone(id: string | number, options: TimeZoneOptions = {}): TimeZone {
    const stringId = String(id);
    return timezones({
        ...options,
        includeZones: 'all',
    })[stringId];
}

export default timezones;
