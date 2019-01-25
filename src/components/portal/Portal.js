// @flow
import React from 'react';
import { createPortal } from 'react-dom';

type Props = {
    container: ?HTMLElement,
};

class Portal extends React.PureComponent<Props> {
    static defaultProps = {
        container: document.body,
    };

    constructor(props: Props) {
        super(props);
        this.container = this.props.container;
        this.layer = document.createElement('div');
        this.layer.setAttribute('data-portal', '');
        if (this.container && this.layer) {
            this.container.appendChild(this.layer);
        }
    }

    componentWillUnmount() {
        if (this.container && this.layer) {
            this.container.removeChild(this.layer);
        }
        this.layer = null;
    }

    layer: ?HTMLDivElement;

    container: ?HTMLElement;

    render() {
        const { container, ...elementProps }: Props = this.props;
        if (!this.layer) {
            return null;
        }

        return createPortal(<div {...elementProps} />, this.layer);
    }
}

export default Portal;
