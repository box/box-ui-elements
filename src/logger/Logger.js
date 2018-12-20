type LoggerOptions = {
    onMetricLog?: Function,
};

type MetricData = {
    component: string,
    message: string,
    value?: string | number,
    timestamp: string,
    sessionId: string,
};

class Logger {
    /* Function callback to invoke with a metric object */
    onMetricLog: Function = console.log;

    /* A list of unique events that have occurred */
    uniqueEvents: Array<string> = [];

    constructor(options: LoggerOptions): Logger {
        this.onMetricLog = options.onMetricLog;
    }

    createComponentEventName(component: string, name: string) {
        return `${component}::${name}`;
    }

    hasLoggedEvent(component: string, name: string): boolean {
        return this.uniqueEvents.includes(this.createComponentEventName(component, name));
    }

    /**
     * Invokes the provided metric logging callback.
     *
     * @param {} component - the name of the component
     * @param {*} name  - the name of the event
     * @param {*} value - value associated with the event
     */
    logMetric(component: string, name: string, value?: string | number): void {
        const event = {
            component,
            name,
            value,
            timestamp: this.getTimestamp(),
            sessionId: SESSION_ID,
            type: 'metric',
        };

        this.onMetricLog(event);
    }

    /**
     * Logs a unique metric event. Prevents duplicate events from being logged in the session.
     *
     * @param {string} component - the name of the component
     * @param {string} name  - the name of the event
     * @param {*} value - value associated with the event
     */
    logUniqueMetric(component: string, name: string, value?: string | number): void {
        if (this.hasLoggedEvent(component, name)) {
            return;
        }
        this.loggMetric(component, name, value);
        this.uniqueEvents.push(this.createComponentEventName(component, name));
    }

    /**
     * Create an ISO Timestamp for right now.
     */
    getTimestamp(): string {
        return new Date().toISOString();
    }
}

export default Logger;
