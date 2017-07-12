/**
 * @flow
 * @file Progress Bar component
 * @author Box
 */

import React, { PureComponent } from 'react';
import './ProgressBar.scss';

type Props = {
    percent: number
};

type DefaultProps = {|
    percent: number
|};

type State = {
    percent: number
};

class ProgressBar extends PureComponent<DefaultProps, Props, State> {
    props: Props;
    state: State;
    timeout: number;

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
     * Updates state from new props
     *
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props) {
        clearInterval(this.timeout);
        clearTimeout(this.timeout);
        const { percent }: Props = nextProps;
        this.setState({ percent }, this.startProgress);
    }

    /**
     * Clears time out
     *
     * @return {void}
     */
    componentWillUnmount() {
        clearInterval(this.timeout);
        clearTimeout(this.timeout);
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
            this.timeout = setInterval(this.incrementProgress, 100);
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
            percent: percent + 2 / (percent || 1)
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
            transitionDelay: percent > 0 && percent < 100 ? '0' : '0.4s'
        };
        return (
            <div className='buik-progress-container' style={containerStyle}>
                <div className='buik-progress' style={{ width: `${percent}%` }} />
            </div>
        );
    }
}

export default ProgressBar;
