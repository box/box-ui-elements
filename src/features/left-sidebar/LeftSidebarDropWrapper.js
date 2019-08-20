// @flow
import * as React from 'react';
import classNames from 'classnames';

import './styles/LeftSidebarDropWrapper.scss';

type Props = {
    children: React.Node,
    className?: string,
    dropTargetRef?: { current: null | HTMLDivElement },
    isDragging?: boolean,
    message?: string,
    showDropZoneOnHover?: boolean,
};

type State = {
    dropZoneHover: boolean,
};

class LeftSidebarDropWrapper extends React.Component<Props, State> {
    state = {
        dropZoneHover: false,
    };

    componentDidUpdate(prevProps: Props) {
        const { showDropZoneOnHover, isDragging } = this.props;

        // Reset drop zone hover state if dragging has stopped without firing a mouseleave event.
        if (showDropZoneOnHover && !isDragging && prevProps.isDragging) {
            this.setState({ dropZoneHover: false });
        }
    }

    handleDropZoneHover = () => this.setState({ dropZoneHover: true });

    handleDropZoneHoverLeave = () => this.setState({ dropZoneHover: false });

    render() {
        const {
            children,
            className = '',
            isDragging = false,
            showDropZoneOnHover = false,
            message = '',
            dropTargetRef,
            ...rest
        } = this.props;
        const { dropZoneHover } = this.state;
        const shouldShowVeil = isDragging && (showDropZoneOnHover ? dropZoneHover : true);
        const hoverEventHandlers =
            isDragging && showDropZoneOnHover
                ? {
                      onMouseEnter: this.handleDropZoneHover,
                      onMouseLeave: this.handleDropZoneHoverLeave,
                  }
                : {};
        const classes = classNames('left-sidebar-drop-wrapper', className);

        return (
            <div ref={dropTargetRef} className={classes} {...hoverEventHandlers} {...rest}>
                {shouldShowVeil ? (
                    <div className="left-sidebar-drop-veil">
                        <span className="left-sidebar-drop-wrapper-text">{message}</span>
                    </div>
                ) : null}
                {children}
            </div>
        );
    }
}

export default LeftSidebarDropWrapper;
