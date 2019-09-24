/**
 * @flow
 * @file Progress Bar component
 * @author Box
 */

import React, { PureComponent } from 'react';
import './ProgressBar.scss';

type Props = {
    percent: number,
};

type State = {
    percent: number,
};

class ProgressBar extends PureComponent<Props, State> {
    props: Props;

    state: State;

    timeout: TimeoutID;

    interval: IntervalID;

    static defaultProps = { percent: 0 };

    /**
     * [constructor]
     *
     * @return {ProgressBar}
     */
    constructor(props: Props) {
        super(props);
        const { percent }: State = props;
        this.state = { percent };
    }

    /**
     * Clears any timeouts and intervals
     *
     * @return {void}
     */
    clearTimeoutAndInterval() {
        clearInterval(this.interval);
        clearTimeout(this.timeout);
    }

    /**
     * Starts progress on mount
     */

    componentDidMount() {
        this.startProgress();
    }

    /**
     * Updates state from new props
     *
     * @return {void}
     */
    componentDidUpdate(prevProps: Props): void {
        const { percent }: Props = this.props;

        if (prevProps.percent !== percent) {
            this.clearTimeoutAndInterval();
            this.setState({ percent }, this.startProgress);
        }
    }

    /**
     * Clears time out
     *
     * @return {void}
     */
    componentWillUnmount() {
        this.clearTimeoutAndInterval();
    }

    /**
     * Increaments the progress or resets it
     * depending upon the edge conditions.
     *
     * @return {void}
     */
    startProgress = () => {
        const { percent }: State = this.state;
        if (percent === 0) {
            this.interval = setInterval(this.incrementProgress, 100);
        } else if (percent === 100) {
            // Timeout helps transition of hiding the bar to finish
            this.timeout = setTimeout(this.resetProgress, 600);
        }
    };

    /**
     * Increaments the progress very slowly
     *
     * @return {void}
     */
    incrementProgress = () => {
        const { percent } = this.state;
        this.setState({
            percent: percent + 2 / (percent || 1),
        });
    };

    /**
     * Resets the progress to 0
     *
     * @return {void}
     */
    resetProgress = () => {
        this.setState(ProgressBar.defaultProps);
    };

    /**
     * Renders the progress bar
     *
     * @return {void}
     */
    render() {
        const { percent }: State = this.state;
        const containerStyle = {
            opacity: percent > 0 && percent < 100 ? 1 : 0,
            transitionDelay: percent > 0 && percent < 100 ? '0' : '0.4s',
        };
        return (
            <div className="be-progress-container" style={containerStyle}>
                <div className="be-progress" style={{ width: `${percent}%` }} />
            </div>
        );
    }
}

export default ProgressBar;
