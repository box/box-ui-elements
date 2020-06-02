import * as React from 'react';

import './VisualTooltipContent.scss';

export type VisualTooltipContentProps = {
    /** A string to be used in the tooltip's paragraph content */
    content: string;
    /** The string source of the image used in the visual tooltip */
    imageSrc: string;
    /** A string to be used in the tooltip's title heading */
    title: string;
};

const VisualTooltipContent = ({ content, imageSrc, title }: VisualTooltipContentProps) => (
    <div className="bdl-VisualTooltipContent">
        <div className="bdl-VisualTooltipContent-imageWrapper">
            <img src={imageSrc} alt={title} className="bdl-VisualTooltipContent-image" />
        </div>
        <div className="bdl-VisualTooltipContent-contentWrapper">
            <h4 className="bdl-VisualTooltipContent-title">{title}</h4>
            <p className="bdl-VisualTooltipContent-content">{content}</p>
        </div>
    </div>
);

export default VisualTooltipContent;
