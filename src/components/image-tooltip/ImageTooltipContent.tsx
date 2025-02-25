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

function cloneTooltipChildWithNewProps(child: React.ReactElement, onImageLoad: OnImageLoad): React.ReactElement {
    const existingClasses = (child.props as { className?: string }).className;
    const className = classNames(existingClasses, 'bdl-ImageTooltipContent-imageChild');

    return React.cloneElement(child, {
        className,
        onLoad: onImageLoad,
    } as React.HTMLAttributes<HTMLImageElement>);
}

const ImageTooltipContent = ({ children, content, onImageLoad, title }: ImageTooltipContentProps) => (
    <div className="bdl-ImageTooltipContent">
        <div className="bdl-ImageTooltipContent-image">{cloneTooltipChildWithNewProps(children, onImageLoad)}</div>
        <div className="bdl-ImageTooltipContent-contentWrapper">
            <h4 className="bdl-ImageTooltipContent-title">{title}</h4>
            <p className="bdl-ImageTooltipContent-content">{content}</p>
        </div>
    </div>
);

export default ImageTooltipContent;
