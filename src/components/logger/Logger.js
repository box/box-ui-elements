// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { METRIC_TYPE_PREVIEW_METRIC, METRIC_TYPE_ELEMENTS_LOAD_METRIC } from '../../constants';

type ElementsMetric = {
    component: ElementsOrigins,
    endMarkName: string,
    name: string,
    sessionId: string,
    timestamp: string,
    type: MetricTypes,
};

type Props = {
    fileId?: string,
    onMetric: (data: Object) => void,
    children: React.ChildrenArray<React.Element<any>>,
    source: ElementsOrigins,
};

/**
 * Converts a character, using it as a seed, to a random integer and returns it as a string.
 *
 * @param {string} c - A single character
 * @returns {string} The random character
 */
function generateRandom(c: string): string {
    /* eslint-disable no-bitwise */
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
    /* eslint-enable no-bitwise */
}

/**
 * Generates a GUID/UUID compliant with RFC4122 version 4.
 *
 * @return {string} A 36 character uuid
 */
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, generateRandom);
}

class Logger extends React.Component<Props> {
    uniqueEventsSet: Set<string>;

    sessionId: string;

    static defaultProps = {
        onMetric: noop,
    };

    constructor(props: Props) {
        super(props);
        this.uniqueEventsSet = new Set();
        this.sessionId = uuidv4();
    }

    get uniqueEvents(): Set<string> {
        return this.uniqueEventsSet;
    }

    /**
     * Creates an event name meant for use with an event which meant to be logged once per file id
     *
     * @param {string} name - The event name
     * @param {string} fileId - the file id
     * @returns {string} A string containing the component and event name
     */
    createFileEventNameWith(name: string, fileId: string): string {
        return `${fileId}::${this.createEventName(name)}`;
    }

    /**
     * Creates an event name meant for use with an event which is unique and meant to be logged only once
     *
     * @param {string} name - The event name
     * @returns {string} A string containing the component and event name
     */
    createEventName(name: string): string {
        return `${this.props.source}::${name}`;
    }

    /**
     * Checks to see if the specified event for the component has already been fired.
     *
     * @param {string} component - the component name
     * @param {string} name - the event name
     * @returns {boolean} True if the event has already been fired
     */
    hasLoggedEvent(name: string): boolean {
        return this.uniqueEvents.has(name);
    }

    /**
     * Invokes the provided metric logging callback.
     *
     * @param {string} type - the type of the event
     * @param {Object} data  - the event data
     * @param {string} name - the name of the event
     */
    logMetric(type: MetricTypes, name: string, data: Object): void {
        const metric: ElementsMetric = {
            ...data,
            component: this.props.source,
            name,
            timestamp: this.getTimestamp(),
            sessionId: this.sessionId,
            type,
        };

        this.props.onMetric(metric);
    }

    /**
     * Logs a unique metric event. Prevents duplicate events from being logged in the session.
     *
     * @param {string} type - the type of the event
     * @param {Object} data  - the event data
     * @param {string} name - the name of the event
     */
    logUniqueMetric(type: MetricTypes, name: string, data: Object): void {
        let eventName;
        if (type !== METRIC_TYPE_ELEMENTS_LOAD_METRIC) {
            if (!this.props.fileId) {
                return;
            }
            eventName = this.createFileEventNameWith(name, this.props.fileId);
        } else {
            eventName = this.createEventName(name);
        }

        if (this.hasLoggedEvent(eventName)) {
            return;
        }

        this.logMetric(type, name, data);
        this.uniqueEvents.add(eventName);
    }

    /**
     * Log a timing related metric.
     *
     * @param {string} type - the type of the event
     * @param {Object} data  - the event data
     * @param {string} name - the name of the event
     * @param {boolean} isUnique  - true if the metric should be logged only once
     * @returns {void}
     */
    logTimeMetric(type: MetricTypes, data: Object, name: string, isUnique?: boolean): void {
        if (!name) {
            return;
        }

        if (isUnique) {
            this.logUniqueMetric(type, name, data);
        } else {
            this.logMetric(type, name, data);
        }
    }

    /**
     * onMetric handler
     *
     * @param {string} type - the type of the event
     * @param {Object} data  - the event data
     * @param {string} name - the name of the event
     * @param {boolean} isUnique  - true if the metric should be logged only once
     * @returns {void}
     */
    handleMetric = (type: MetricTypes, data: Object, name?: string, isUnique?: boolean) => {
        if (type === METRIC_TYPE_PREVIEW_METRIC) {
            this.props.onMetric({
                ...data,
                type,
            });
        } else if (name) {
            this.logTimeMetric(type, data, name, isUnique);
        }
    };

    /**
     * Create an ISO Timestamp for right now.
     *
     * @returns {string}
     */
    getTimestamp(): string {
        return new Date().toISOString();
    }

    render() {
        const { children, ...rest } = this.props;

        return React.cloneElement(children, {
            ...rest,
            onMetric: this.handleMetric,
        });
    }
}

export { Logger as default, generateRandom, uuidv4 };
