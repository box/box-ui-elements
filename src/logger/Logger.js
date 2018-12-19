type LoggerOptions = {
    onMetricLog?: Function
};

type MetricData = {
    component: string,
    message: string,
    value?: string | number,
    timestamp: string,
    session_id: string,
};

class Logger {
    /* Function callback to invoke with a metric object */
    onMetricLog: Function = console.log;

    constructor(options: LoggerOptions): Logger {
        this.onMetricLog = options.onMetricLog;
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
            session_id: SESSION_ID,
            type: 'metric',
        };

        this.onMetricLog(event);
    }

    /**
     * Create an ISO Timestamp for right now.
     */
    getTimestamp(): string {
        return new Date().toISOString();
    }
}

export default Logger;