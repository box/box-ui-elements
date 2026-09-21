import * as React from 'react';

export interface CarouselHeaderProps {
    /** Title displayed above the carousel */
    title: string;
}

const CarouselHeader = ({ title }: CarouselHeaderProps) => (
    <div className="slide-carousel-header">
        <h3 className="slide-carousel-title">{title}</h3>
    </div>
);

export default CarouselHeader;
