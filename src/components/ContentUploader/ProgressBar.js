/**
 * @flow
 * @file Component for a progress bar
 */

import React, { PureComponent } from 'react';
import './ProgressBar.scss';

type Props = {
    percent: number
};

type State = {
    percent: number
};

type DefaultProps = {|
    percent: number
|};

class ProgressBar extends PureComponent<DefaultProps, Props, State> {
    props: Props;
    state: State;

    static defaultProps: DefaultProps = {
        percent: 0
    };

    /**
     * [constructor]
     *
     * @return {ProgressBar}
     */
    constructor(props: Props) {
        super(props);
        const { percent } = props;
        this.state = { percent };
    }

    /**
     * Updates state from new props
     *
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props) {
        const { percent } = nextProps;
        this.setState({ percent });
    }

    /**
     * Renders the progress bar
     *
     * @return {void}
     */
    render() {
        const { percent } = this.state;
        const containerStyle = {
            transitionDelay: percent > 0 && percent < 100 ? '0' : '0.4s'
        };
        return (
            <div className='bcu-progress-container' style={containerStyle}>
                <div className='bcu-progress' style={{ width: `${percent}%` }} />
            </div>
        );
    }
}

export default ProgressBar;
