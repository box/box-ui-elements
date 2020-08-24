import * as React from 'react';
import classNames from 'classnames';

import './ImageTooltipContent.scss';

type OnImageLoad = () => void;

export type ImageTooltipContentProps = {
    /** A React component representing the image used in the visual tooltip */
    children: React.ReactElement;
    /** A string to be used in the tooltip's paragraph content */
    content: string;
    /** A callback triggered onLoad for the image element */
    onImageLoad: OnImageLoad;
    /** A string to be used in the tooltip's title heading */
    title: string;
};

function cloneTooltipImageChildWithProps(
    child: React.ReactElement,
    onImageLoad: OnImageLoad,
): React.ReactElement | null {
    if (child) {
        const {
            props: { className: existingClasses },
        } = child;
        const className = classNames(existingClasses, 'bdl-ImageTooltipContent-imageChild');

        const propsForElement = onImageLoad
            ? {
                  className,
                  onLoad: onImageLoad,
              }
            : {
                  className,
              };

        return React.cloneElement(child, propsForElement);
    }

    return null;
}

const ImageTooltipContent = ({ children, content, onImageLoad, title }: ImageTooltipContentProps) => (
    <div className="bdl-ImageTooltipContent">
        <div className="bdl-ImageTooltipContent-image">
            {React.Children.map(children, child => cloneTooltipImageChildWithProps(child, onImageLoad))}
        </div>
        <div className="bdl-ImageTooltipContent-contentWrapper">
            <h4 className="bdl-ImageTooltipContent-title">{title}</h4>
            <p className="bdl-ImageTooltipContent-content">{content}</p>
        </div>
    </div>
);

export default ImageTooltipContent;
