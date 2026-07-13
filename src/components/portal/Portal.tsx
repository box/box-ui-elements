import * as React from 'react';
import { createPortal } from 'react-dom';
import PortalContainerContext from '../../common/PortalContainerContext';

export interface PortalProps {
    children?: React.ReactNode;
    className?: string;
    container?: HTMLElement | null | undefined;
    style?: { [arg: string]: string | number };
}

class Portal extends React.PureComponent<PortalProps> {
    static contextType = PortalContainerContext;

    context!: React.ContextType<typeof PortalContainerContext>;

    constructor(props: PortalProps, context: React.ContextType<typeof PortalContainerContext>) {
        super(props, context);
        // Explicit prop wins, then the context container, then document.body.
        this.container = props.container ?? context ?? document.body;
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
        // Exclude container from the props spread onto the rendered div.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { container, ...elementProps }: PortalProps = this.props;
        if (!this.layer) {
            return null;
        }

        return createPortal(<div {...elementProps} />, this.layer);
    }
}

export default Portal;
