/**
 * @flow
 * @file Logging Class
 * @author Box
 */

/**
 * Generates a GUID/UUID compliant with RFC4122 version 4.
 *
 * @return {string} A 36 character uuid
 */
function uuidv4() {
    /* eslint-disable */
    function generateRandom(c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    }
    /* eslint-enable */

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, generateRandom);
}

// Unique ID of this session.
const SESSION_ID = uuidv4();

class Logger {
    /* Function callback to invoke with a metric object */
    onMetricLog: Function = console.log; // eslint-disable-line no-console

    /* A list of unique events that have occurred */
    uniqueEvents: Set = new Set();

    /**
     * Composes a component and event name together to make a semi-unique tag.
     *
     * @param {string} component - The component name
     * @param {string} name - The event namne
     * @returns {string} A string containing the component and event name
     */
    createComponentEventName(component: string, name: string): string {
        return `${component}::${name}`;
    }

    /**
     * Checks to see if the specified event for the component has already been fired.
     *
     * @param {string} component - the component name
     * @param {string} name - the event name
     * @returns {boolean} True if the event has already been fired
     */
    hasLoggedEvent(component: string, name: string): boolean {
        return this.uniqueEvents.has(this.createComponentEventName(component, name));
    }

    /**
     * Invokes the provided metric logging callback.
     *
     * @param {string} component - the name of the component
     * @param {string} name  - the name of the event
     * @param {Object} [data] - Additional data to apply to the event
     */
    logMetric(component: string, name: string, data?: Object = {}): void {
        const event = {
            component,
            name,
            timestamp: this.getTimestamp(),
            sessionId: SESSION_ID,
            type: 'metric',
            ...data,
        };

        this.onMetricLog(event);
    }

    /**
     * Logs a unique metric event. Prevents duplicate events from being logged in the session.
     *
     * @param {string} component - the name of the component
     * @param {string} name  - the name of the event
     * @param {Object} [data] - Additional data to apply to the event
     */
    logUniqueMetric(component: string, name: string, data?: Object): void {
        if (this.hasLoggedEvent(component, name)) {
            return;
        }
        this.logMetric(component, name, data);
        this.uniqueEvents.add(this.createComponentEventName(component, name));
    }

    /**
     * Log a timing related metric.
     *
     * @param {string} component - the name of the component
     * @param {string} name - the event name
     * @param {string} start - Performance API mark for the start of the timer
     * @param {string} end - Performance API mark for the end of the timer
     * @param {boolean} [isUnique] - If true, guarantees a unique event firing
     * @returns {void}
     */
    logTimeMetric(component: string, name: string, start: string, end: string, isUnique?: boolean = false): void {
        const tagInfo = {
            start,
            end,
        };

        if (isUnique) {
            this.logUniqueMetric(component, name, tagInfo);
        } else {
            this.logMetric(component, name, tagInfo);
        }
    }

    /**
     * Create an ISO Timestamp for right now.
     *
     * @returns {string}
     */
    getTimestamp(): string {
        return new Date().toISOString();
    }
}

export default new Logger();
export const LoggerType = Logger;
