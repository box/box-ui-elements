import * as React from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
    className?: string;
    container: HTMLElement | null | undefined;
    style?: { [arg: string]: string | number };
}

class Portal extends React.PureComponent<PortalProps> {
    static defaultProps = {
        container: document.body,
    };

    constructor(props: PortalProps) {
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

    layer: HTMLDivElement | null | undefined;

    container: HTMLElement | null | undefined;

    render(): null | React.ReactPortal {
        const { ...elementProps }: PortalProps = this.props;
        if (!this.layer) {
            return null;
        }

        return createPortal(<div {...elementProps} />, this.layer);
    }
}

export default Portal;
