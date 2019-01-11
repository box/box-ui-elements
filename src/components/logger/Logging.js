// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import {
    METRIC_TYPE_ELEMENTS_LOAD_METRIC,
    METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC,
    METRIC_TYPE_PREVIEW_METRIC,
} from '../../constants';

type Props = {
    fileId?: string,
    onMetric: (data: Object) => void,
    children: React.ChildrenArray<React.Element<any>>,
    source: MetricSources,
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

// Unique ID of this session.
const SESSION_ID = uuidv4();
const uniqueEvents: Set<string> = new Set();

class Logging extends React.Component<Props> {
    static defaultProps = {
        onMetric: noop,
    };

    /**
     * Composes a component and event name together to make a semi-unique tag.
     *
     * @param {string} component - The component name
     * @param {string} name - The event namne
     * @returns {string} A string containing the component and event name
     */
    createComponentEventName(name: string): string {
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
        return uniqueEvents.has(name);
    }

    /**
     * Invokes the provided metric logging callback.
     *
     * @param {string} component - the name of the component
     * @param {string} name  - the name of the event
     * @param {Object} [data] - Additional data to apply to the event
     */
    logMetric(type: MetricTypes, name: string, data?: Object = {}): void {
        const metric = {
            ...data,
            component: this.props.source,
            name,
            timestamp: this.getTimestamp(),
            sessionId: SESSION_ID,
            type,
        };

        this.props.onMetric(metric);
    }

    /**
     * Logs a unique metric event. Prevents duplicate events from being logged in the session.
     *
     * @param {string} component - the name of the component
     * @param {string} name  - the name of the event
     * @param {Object} [data] - Additional data to apply to the event
     */
    logUniqueMetric(type: MetricTypes, name: string, data?: Object): void {
        let eventName = this.createComponentEventName(name);
        if (type !== METRIC_TYPE_ELEMENTS_LOAD_METRIC) {
            const fileId = this.props.fileId || '';
            eventName = `${fileId}::${eventName}`;
        }

        if (this.hasLoggedEvent(eventName)) {
            return;
        }

        this.logMetric(type, name, data);
        uniqueEvents.add(eventName);
    }

    /**
     * Log a timing related metric.
     *
     * @param {string} name - the event name
     * @param {string} start - Performance API mark for the start of the timer
     * @param {string} end - Performance API mark for the end of the timer
     * @param {boolean} [isUnique] - If true, guarantees a unique event firing
     * @returns {void}
     */
    logTimeMetric(type: MetricTypes, data: Object, name?: string, isUnique?: boolean): void {
        if (!name) {
            return;
        }

        if (isUnique) {
            this.logUniqueMetric(type, name, data);
        } else {
            this.logMetric(type, name, data);
        }
    }

    handleMetric = (type: MetricTypes, data: Object, name?: string, isUnique?: boolean) => {
        switch (type) {
            case METRIC_TYPE_ELEMENTS_LOAD_METRIC:
                return this.logTimeMetric(type, data, name, isUnique);
            case METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC:
                return this.logTimeMetric(type, data, name, isUnique);
            case METRIC_TYPE_PREVIEW_METRIC:
                return this.props.onMetric({
                    ...data,
                    type,
                });
            default:
                break;
        }

        return undefined;
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

export default Logging;
