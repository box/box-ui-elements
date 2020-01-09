// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import uuidv4 from 'uuid/v4';
import { isMarkSupported } from '../../../utils/performance';
import { EVENT_JS_READY } from './constants';
import { METRIC_TYPE_PREVIEW, METRIC_TYPE_ELEMENTS_LOAD_METRIC } from '../../../constants';
import type { ElementOrigin } from '../flowTypes';
import type { MetricType, ElementsLoadMetricData, LoggerProps } from '../../../common/types/logging';

type ElementsMetric = {
    component: ElementOrigin,
    name: string,
    sessionId: string,
    timestamp: string,
    type: MetricType,
} & ElementsLoadMetricData;

type Props = {
    children: React.Element<any>,
    fileId?: string,
    onMetric: (data: Object) => void,
    source: ElementOrigin,
    startMarkName?: string,
};

const SESSION_ID = uuidv4();
const uniqueEvents: Set<string> = new Set();

class Logger extends React.Component<Props> {
    static defaultProps = {
        onMetric: noop,
    };

    constructor(props: Props) {
        super(props);
        this.loggerProps = {
            onPreviewMetric: this.handlePreviewMetric,
            onReadyMetric: this.handleReadyMetric,
        };
    }

    loggerProps: LoggerProps;

    get uniqueEvents(): Set<string> {
        return uniqueEvents;
    }

    get sessionId(): string {
        return SESSION_ID;
    }

    /**
     * Creates an event name meant for use with an event which is unique and meant to be logged only once
     *
     * @param {string} name - The event name
     * @returns {string} A string containing the component and event name
     */
    createEventName(name: string): string {
        const { source } = this.props;
        return `${source}::${name}`;
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
     * @param {string} name - the name of the event
     * @param {Object} data  - the event data
     */
    logMetric(type: MetricType, name: string, data: Object): void {
        const { onMetric, source } = this.props;
        const metric: ElementsMetric = {
            ...data,
            component: source,
            name,
            timestamp: this.getTimestamp(),
            sessionId: this.sessionId,
            type,
        };

        onMetric(metric);
    }

    /**
     * Logs a unique metric event. Prevents duplicate events from being logged in the session.
     *
     * @param {string} type - the type of the event
     * @param {string} name - the name of the event
     * @param {Object} data  - the event data
     */
    logUniqueMetric(type: MetricType, name: string, data: Object): void {
        const eventName = this.createEventName(name);
        if (this.hasLoggedEvent(eventName)) {
            return;
        }

        this.logMetric(type, name, data);
        this.uniqueEvents.add(eventName);
    }

    /**
     * Preview metric handler
     *
     * @param {Object} data - the metric data
     * @returns {void}
     */
    handlePreviewMetric = (data: Object) => {
        const { onMetric } = this.props;
        onMetric({
            ...data,
            type: METRIC_TYPE_PREVIEW,
        });
    };

    /**
     * JS ready metric handler
     *
     * @param {Object} data - the metric data
     * @returns {void}
     */
    handleReadyMetric = (data: ElementsLoadMetricData) => {
        if (!isMarkSupported) {
            return;
        }

        const { startMarkName } = this.props;
        const metricData = {
            ...data,
            startMarkName,
        };
        this.logUniqueMetric(METRIC_TYPE_ELEMENTS_LOAD_METRIC, EVENT_JS_READY, metricData);
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
        const { children, onMetric, startMarkName, ...rest } = this.props;

        return React.cloneElement(children, {
            ...rest,
            logger: this.loggerProps,
        });
    }
}

export default Logger;
