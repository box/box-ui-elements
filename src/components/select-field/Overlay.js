// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import classNames from 'classnames';
import { getDimensions, getViewportIntersections, type ElementDimensions } from '../../utils/dom';
import { VIEWPORT_BORDERS } from '../../constants';

import './Overlay.scss';

type Props = {
    children: React.Node,
    className?: string,
    isOpen?: boolean,
};

type Translations = {
    x?: number,
    y?: number,
};
class Overlay extends React.Component<Props, State> {
    overlayRef: ?HTMLDivElement;

    buttonRef: ?HTMLButtonElement;

    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.overlayRef = React.createRef();
    }

    getOverlayContentDimensions = (): ElementDimensions => {
        const node = this.overlayRef.current;
        const content = node && node.firstChild;

        const dimensions = getDimensions(content);

        return dimensions;
    };

    getOverlayIntersections = (): Array<string> => {
        const { isOpen } = this.props;

        if (!isOpen) {
            return [];
        }

        const dimensions = this.getOverlayContentDimensions();
        const node = this.overlayRef.current;
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

        // If there are more than 2 intersections then it is likely that the overlay will extend beyond
        // the viewport in at least one direction, therefore, there is no need to reposition the overlay
        if (intersections.length > 2) {
            return translations;
        }

        intersections.forEach(edge => {
            switch (edge) {
                case VIEWPORT_BORDERS.bottom:
                    translations.y = -(buttonHeight + overlayHeight);
                    break;
                case VIEWPORT_BORDERS.right:
                    translations.x = -Math.floor(overlayWidth - buttonWidth);
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
        const overlayContentExistingClassnames = getProp(overlayContent, 'props.className');

        const intersections = this.getOverlayIntersections();
        const translations = intersections.length ? this.getOverlayTranslations(intersections) : null;
        const inlineStyle = translations ? { top: `${translations.y}px`, left: `${translations.x}px` } : null;
        const overlayContentClassnames = classNames('bdl-Overlay-content', overlayContentExistingClassnames, {
            'bdl-Overlay-content--visible': isOpen,
        });

        return (
            <>
                {React.cloneElement(button, { ref: this.buttonRef })}
                <div ref={this.overlayRef} className={classNames(className, 'bdl-Overlay')}>
                    {React.cloneElement(overlayContent, { className: overlayContentClassnames, style: inlineStyle })}
                </div>
            </>
        );
    }
}

export default Overlay;
