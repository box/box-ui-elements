import React, { Component } from 'react';

import Button from '../../src/components/button';
import ProgressBar from '../../src/components/progress-bar';

class ProgressBarExamples extends Component {
    constructor(props) {
        super(props);

        this.intervalId = null;
        this.state = {
            progress: 0,
        };
    }

    setWidth = progress => () => this.setState({ progress });

    startProgress = () => {
        if (this.intervalId) {
            return;
        }

        this.intervalId = setInterval(() => {
            const increment = Math.random() * 10;
            this.setState({
                progress: this.state.progress + increment,
            });

            if (this.state.progress >= 100) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }, 750);
    };

    stopProgress = () => {
        if (!this.intervalId) {
            return;
        }

        clearInterval(this.intervalId);
        this.intervalId = null;
    };

    render() {
        const { progress } = this.state;
        return (
            <div>
                <ProgressBar progress={progress} />
                <Button onClick={this.startProgress}>Start</Button>
                <Button onClick={this.stopProgress}>Stop</Button>
                <Button onClick={this.setWidth(100)}>Complete</Button>
                <Button onClick={this.setWidth(progress + 10)}>Increment by 10%</Button>
                <Button onClick={this.setWidth(0)}>Reset</Button>
            </div>
        );
    }
}

ProgressBarExamples.displayName = 'ProgressBarExamples';

export default ProgressBarExamples;
