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

/**
 * Test whether or not the current platform and JS engine supports the Intl object
 * and resolving time zones. If it doesn't, we just return a static list of time
 * zones. If it does, we make a dynamic list where each time zone is given with the
 * offset for the current day, taking into account whether that is in DST or not.
 */
const supportsIntl: boolean = (function support() {
    if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
        return false;
    }

    const tz: string = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
    }).resolvedOptions().timeZone;

    return typeof tz !== 'undefined';
})();

/**
 * Convert the offset in minutes to an hour:minute string.
 */
function getOffsetStr(offsetInMinutes: number): string {
    const offsetHours = Math.floor(Math.abs(offsetInMinutes) / 60);
    const offsetMinutes = Math.floor(Math.abs(offsetInMinutes) % (offsetHours * 60));

    return `${offsetInMinutes < 1 ? '+' : '-'}${offsetHours < 10 ? `0${offsetHours}` : offsetHours}:${
        offsetMinutes < 10 ? `0${offsetMinutes}` : offsetMinutes
    }`;
}

/**
 * Return the offset from UTC in minutes.
 */
function offset(date: Date, timeZone: string): number {
    // use Japanese with toLocaleString because they have a nice arrangement of date parts from largest to smallest.
    // If toLocaleString on this engine does not support locale or options parameters, then this call will throw
    // and we will catch that
    const arr: number[] = date
        .toLocaleString('ja', { timeZone })
        .split(/[/\s:]/)
        .map(part => {
            return Number(part);
        });
    arr[1] -= 1; // months are zero-based in JS for some reason, so subtract one to get the right month number
    const t1 = Date.UTC.apply(null, arr as [number, number, number, number, number, number]);
    const t2 = new Date(date).setMilliseconds(0);
    return (t2 - t1) / 60000;
}

/**
 * Calculate the display name of the zone for the given date. If the zone is in DST on that date or not,
 * then return the string appropriately. If the zone does not use DST or if the platform cannot calculate it,
 * then just return the static displayName string from @box/cldr-data
 */
function getCurrentDisplayName(date: Date, zone: TimeZone): string {
    const { name, displayName } = zone;
    if (supportsIntl && zone.abbreviationDaylight) {
        try {
            const jan1 = new Date(date.getFullYear(), 0, 1, 0, 0, 0);
            const jun1 = new Date(date.getFullYear(), 5, 1, 0, 0, 0);
            const jan1offset = offset(jan1, name);
            const jun1offset = offset(jun1, name);
            if (jan1offset === jun1offset) {
                // no DST in this zone in this year, so just return the already calculated display name
                return displayName;
            }

            const current = offset(new Date(Date.now()), name);
            let zonename = `GMT${getOffsetStr(current)} ${zone.nameLocalized} `;
            if (jan1offset < jun1offset) {
                // southern hemisphere
                zonename += current === jan1offset ? zone.abbreviationDaylight : zone.abbreviationStandard;
            } else {
                // northern hemisphere
                zonename += current === jun1offset ? zone.abbreviationDaylight : zone.abbreviationStandard;
            }
            return zonename;
        } catch (e) {
            // sometimes the current platform does not support all of the zones or toLocaleString does not support
            // locale and option parameters, so we have to catch for those cases
            return displayName;
        }
    } else {
        return displayName;
    }
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

    const today = new Date(Date.now());
    tzData.forEach(zone => {
        if (includeZones === 'all' || zone.enabled) {
            zones[String(zone.id)] = {
                ...zone,
                displayName: getCurrentDisplayName(today, zone),
            };
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
