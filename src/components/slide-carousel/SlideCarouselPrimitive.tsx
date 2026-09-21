import classNames from 'classnames';
import * as React from 'react';
import noop from 'lodash/noop';

import CarouselHeader from './CarouselHeader';
import SlideNavigator from './SlideNavigator';
import SlidePanels from './SlidePanels';

export interface SlideCarouselPrimitiveProps {
    /** Slides displayed by the carousel */
    children?: React.ReactNode;
    /** Custom class name for the carousel */
    className?: string;
    /** The constant value to use for the content area's style height property */
    contentHeight?: string;
    /** Prefix used to create unique button and panel IDs */
    idPrefix?: string;
    /** Handler invoked with the index of the selected slide */
    onSelection: (index: number) => void;
    /** Index of the selected slide */
    selectedIndex: number;
    /** Title displayed above the carousel */
    title?: string;
}

const SlideCarouselPrimitive = ({
    children,
    className = '',
    contentHeight,
    idPrefix = '',
    onSelection = noop,
    selectedIndex,
    title,
}: SlideCarouselPrimitiveProps) => {
    const buttonIdGenerator = (value: number) => `${idPrefix && `${idPrefix}-`}selector-${value}`;
    const panelIdGenerator = (value: number) => `${idPrefix && `${idPrefix}-`}slide-panel-${value}`;
    return (
        <div className={classNames('slide-carousel', className)}>
            {title && <CarouselHeader title={title} />}
            <SlidePanels
                getPanelIdFromValue={panelIdGenerator}
                onSelection={onSelection}
                selectedIndex={selectedIndex}
                style={{ height: contentHeight }}
            >
                {children}
            </SlidePanels>
            <SlideNavigator
                getButtonIdFromValue={buttonIdGenerator}
                getPanelIdFromValue={panelIdGenerator}
                numOptions={React.Children.count(children)}
                onSelection={onSelection}
                selectedIndex={selectedIndex}
            />
        </div>
    );
};

SlideCarouselPrimitive.displayName = 'SlideCarouselPrimitive';

export default SlideCarouselPrimitive;
