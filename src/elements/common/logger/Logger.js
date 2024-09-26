// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { v4 as uuidv4 } from 'uuid';
import { isMarkSupported } from '../../../utils/performance';
import { EVENT_DATA_READY, EVENT_JS_READY } from './constants';
import {
    METRIC_TYPE_PREVIEW,
    METRIC_TYPE_ELEMENTS_LOAD_METRIC,
    METRIC_TYPE_UAA_PARITY_METRIC,
} from '../../../constants';
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
            onDataReadyMetric: this.handleDataReadyMetric,
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
     * @param {string} [uniqueId] - an optional unique id
     * @returns {string} A string containing the component and event name and optional unique id
     */
    createEventName(name: string, uniqueId?: string): string {
        const { source } = this.props;
        const eventName = `${source}::${name}`;
        return uniqueId ? `${eventName}::${uniqueId}` : eventName;
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
     * @param {string} [uniqueId] - an optional unique id
     * @returns {void}
     */
    logUniqueMetric(type: MetricType, name: string, data: Object, uniqueId?: string): void {
        const eventName = this.createEventName(name, uniqueId);
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

        if (data.type === METRIC_TYPE_UAA_PARITY_METRIC) {
            onMetric({
                ...data,
                type: METRIC_TYPE_UAA_PARITY_METRIC,
            });
        } else {
            onMetric({
                ...data,
                type: METRIC_TYPE_PREVIEW,
            });
        }
    };

    /**
     * Data ready metric handler
     *
     * @param {Object} data - the metric data
     * @returns {void}
     */
    handleDataReadyMetric = (data: ElementsLoadMetricData, uniqueId?: string) => {
        if (!isMarkSupported) {
            return;
        }

        this.logUniqueMetric(METRIC_TYPE_ELEMENTS_LOAD_METRIC, EVENT_DATA_READY, data, uniqueId);
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
