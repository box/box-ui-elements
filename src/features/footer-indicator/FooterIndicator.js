// @flow
import * as React from 'react';
import classNames from 'classnames';

import Tooltip from '../../components/tooltip';

import IconPuzzlePiece from '../../icons/general/IconPuzzlePiece';

import './FooterIndicator.scss';

type Props = {
    indicatorText: string,
};

type State = {
    isTextOverflowed: boolean,
};

class FooterIndicator extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isTextOverflowed: false,
        };
    }

    componentDidMount() {
        if (!this.indicatorTextElement) {
            return;
        }

        const { offsetWidth, scrollWidth } = this.indicatorTextElement;

        if (offsetWidth < scrollWidth) {
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({
                isTextOverflowed: true,
            });
        }
    }

    indicatorTextElement: ?HTMLElement;

    render() {
        const { indicatorText } = this.props;
        const { isTextOverflowed } = this.state;
        return (
            <div className="bdl-FooterIndicator">
                <Tooltip
                    className={classNames('bdl-FooterIndicator-tooltip', {
                        'bdl-is-visible': isTextOverflowed,
                    })}
                    position="middle-right"
                    text={indicatorText}
                >
                    <div className="bdl-FooterIndicator-content">
                        <IconPuzzlePiece className="bdl-FooterIndicator-icon" />
                        <span
                            ref={textElement => {
                                this.indicatorTextElement = textElement;
                            }}
                            className="bdl-FooterIndicator-text"
                        >
                            {indicatorText}
                        </span>
                    </div>
                </Tooltip>
            </div>
        );
    }
}

export default FooterIndicator;
