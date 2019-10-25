// @flow
import * as React from 'react';
import classNames from 'classnames';
import { getDimensions, getViewportIntersections } from '../../utils/dom';
import { OVERLAY_WRAPPER_CLASS, VIEWPORT_BORDERS } from '../../constants';

type Props = {
    children: React.Node,
    className?: string,
    isOpen?: boolean,
};

type Dimensions = {
    height?: number,
    width?: number,
};

type Translations = {
    x?: number,
    y?: number,
};

function getDimensionsWhileHidden(element: HTMLElement): Dimensions {
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

    getOverlayContentDimensions = (): Dimensions => {
        const node = this.overlayRef.current;
        const content = node && node.firstChild;

        const dimensions = content.clientHeight ? getDimensions(content) : getDimensionsWhileHidden(content);

        return dimensions;
    };

    getOverlayIntersections = (): Array<string> => {
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

        return getViewportIntersections(bounding);
    };

    getOverlayTranslations = (intersections: Array<string>): Translations => {
        const { height: overlayHeight, width: overlayWidth } = this.getOverlayContentDimensions();
        const { height: buttonHeight, width: buttonWidth } = this.buttonRef.current.getBoundingClientRect();
        const translations = { x: 0, y: 0 };

        if (intersections.length >= 3) {
            return translations;
        }

        intersections.forEach(edge => {
            switch (edge) {
                case VIEWPORT_BORDERS.bottom:
                    translations.y = -(buttonHeight + overlayHeight);
                    break;
                case VIEWPORT_BORDERS.right:
                    translations.x = -(overlayWidth - buttonWidth);
                    break;
                default:
            }
        });

        return translations;
    };

    render() {
        const { children, className, isOpen } = this.props;
        const elements = React.Children.toArray(children);

        if (elements.length !== 2) {
            throw new Error('Overlay must have exactly two children: A button component and the overlay content');
        }

        const button = elements[0];
        const overlayContent = elements[1];

        const intersections = this.getOverlayIntersections();
        const translations = intersections.length ? this.getOverlayTranslations(intersections) : null;
        const inlineStyle = translations && { top: `${translations.y}px`, left: `${translations.x}px` };

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
