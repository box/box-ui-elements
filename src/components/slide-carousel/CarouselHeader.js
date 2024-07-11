// @flow
import * as React from 'react';

type Props = {
    title: string,
};

const CarouselHeader = ({ title }: Props) => (
    <div className="slide-carousel-header">
        <h3 className="slide-carousel-title">{title}</h3>
    </div>
);

export default CarouselHeader;
