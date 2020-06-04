import * as React from 'react';
import classNames from 'classnames';

import './ImageTooltipContent.scss';

export type ImageTooltipContentProps = {
    /** A React component representing the image used in the visual tooltip */
    children: React.ReactElement;
    /** A string to be used in the tooltip's paragraph content */
    content: string;
    /** A string to be used in the tooltip's title heading */
    title: string;
};

function appendTooltipImageChildClass(child: React.ReactElement): React.ReactElement | null {
    if (child) {
        const {
            props: { className: existingClasses },
        } = child;
        const className = classNames(existingClasses, 'bdl-ImageTooltipContent-imageChild');

        return React.cloneElement(child, {
            className,
        });
    }

    return null;
}

const ImageTooltipContent = ({ children, content, title }: ImageTooltipContentProps) => (
    <div className="bdl-ImageTooltipContent">
        <div className="bdl-ImageTooltipContent-image">
            {React.Children.map(children, child => appendTooltipImageChildClass(child))}
        </div>
        <div className="bdl-ImageTooltipContent-contentWrapper">
            <h4 className="bdl-ImageTooltipContent-title">{title}</h4>
            <p className="bdl-ImageTooltipContent-content">{content}</p>
        </div>
    </div>
);

export default ImageTooltipContent;
