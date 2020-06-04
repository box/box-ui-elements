import * as React from 'react';

import './ImageTooltipContent.scss';

export type ImageTooltipContentProps = {
    /** A string to be used in the tooltip's paragraph content */
    content: string;
    /** A React component representing the image used in the visual tooltip */
    image: React.ReactNode;
    /** A string to be used in the tooltip's title heading */
    title: string;
};

const ImageTooltipContent = ({ content, image, title }: ImageTooltipContentProps) => (
    <div className="bdl-ImageTooltipContent">
        <div className="bdl-ImageTooltipContent-image">{image}</div>
        <div className="bdl-ImageTooltipContent-contentWrapper">
            <h4 className="bdl-ImageTooltipContent-title">{title}</h4>
            <p className="bdl-ImageTooltipContent-content">{content}</p>
        </div>
    </div>
);

export default ImageTooltipContent;
