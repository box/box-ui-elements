// @flow
import * as React from 'react';
import classNames from 'classnames';
import { getDimensions, isInViewport } from '../../utils/dom';
import { OVERLAY_WRAPPER_CLASS } from '../../constants';

type Props = {
    children: React.Node,
    className?: string,
    isOpen?: boolean,
};

function getDimensionsWhileHidden(element) {
    if (!element) {
        return {};
    }

    element.classList.add('offscreen');
    const dimensions = getDimensions(element);
    element.classList.remove('offscreen');
    return dimensions;
}

class Overlay extends React.Component<Props, State> {
    overlayRef: ?HTMLDivElement;

    buttonRef: ?HTMLButtonElement;

    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.overlayRef = React.createRef();
    }

    getOverlayContentDimensions = () => {
        const node = this.overlayRef.current;
        const content = node && node.firstChild;

        const dimensions = content.clientHeight ? getDimensions(content) : getDimensionsWhileHidden(content);

        return dimensions;
    };

    doesOverlayNeedRepositioning = () => {
        const { isOpen } = this.props;
        const node = this.overlayRef.current;

        if (!isOpen) {
            return false;
        }

        const dimensions = this.getOverlayContentDimensions();
        const boundingClientRect = node && node.getBoundingClientRect();
        const bounding = {
            top: boundingClientRect.top,
            left: boundingClientRect.left,
            bottom: boundingClientRect.top + dimensions.height,
            right: boundingClientRect.left + dimensions.width,
        };

        return !isInViewport(bounding);
    };

    getOverlayTranslations = () => {
        const { height: overlayHeight } = this.getOverlayContentDimensions();
        const { height: buttonHeight } = this.buttonRef.current.getBoundingClientRect();

        return { x: 0, y: buttonHeight + overlayHeight };
    };

    render() {
        const { children, className, isOpen } = this.props;
        const elements = React.Children.toArray(children);

        if (elements.length !== 2) {
            throw new Error('Overlay must have exactly two children: A button component and the overlay content');
        }

        const button = elements[0];
        const overlayContent = elements[1];

        const needsRepositioning = this.doesOverlayNeedRepositioning();
        const translations = needsRepositioning ? this.getOverlayTranslations() : null;
        const inlineStyle = translations && { top: `-${translations.y}px` };

        return (
            <>
                {React.cloneElement(button, { ref: this.buttonRef })}
                <div
                    ref={this.overlayRef}
                    className={classNames(className, OVERLAY_WRAPPER_CLASS, { 'is-visible': isOpen })}
                >
                    {React.cloneElement(overlayContent, { style: inlineStyle })}
                </div>
            </>
        );
    }
}

export default Overlay;
