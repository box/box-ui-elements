import * as React from 'react';
import Measure from 'react-measure';
import forEach from 'lodash/forEach';

import CategorySelectorComponent from './CategorySelectorComponent';

import './CategorySelector.scss';

export interface Category {
    displayText: string;
    value: string;
}

export interface CategorySelectorProps {
    /** Array of categories that will display in the selector, each category is an object with a string value and a string displayText */
    categories: Category[];
    /** Optional props that can be passed to each category in category selector component */
    categoryProps?: Record<string, unknown>;
    /** Optional className that can be passed to category selector component */
    className?: string;
    /** Optional value of initial selected category */
    currentCategory?: string;
    /** Parent component can use this on select handler to update state for selected category */
    onSelect: (value: string) => void;
}

const CategorySelector = ({
    categories,
    categoryProps = {},
    className = '',
    currentCategory = '',
    onSelect,
}: CategorySelectorProps) => {
    const linksRef = React.useRef<HTMLDivElement>(null);
    const moreRef = React.useRef<HTMLDivElement>(null);

    const [maxLinks, setMaxLinks] = React.useState(categories.length);
    const defaultLinkWidths: { [index: string]: number } = {};
    const [linkWidths, setLinkWidths] = React.useState(defaultLinkWidths);
    const [moreWidth, setMoreWidth] = React.useState(0);

    const outerWidth = (element: HTMLElement) => {
        const style = getComputedStyle(element);
        return element.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight) + 1;
    };

    const checkLinks = React.useCallback(
        contentRect => {
            const { width } = contentRect.client;

            if (!linksRef.current) return;

            // Pull in some common widths we'll need
            const containerWidth = width - moreWidth;

            // Get all the links
            const elements = linksRef.current.querySelectorAll<HTMLSpanElement>('[data-category]');

            // First, calculate the total width of all links in the main section
            let linksWidth = 0;
            forEach(elements, (element: HTMLSpanElement) => {
                linksWidth += outerWidth(element);
            });

            if (linksWidth > containerWidth) {
                // The links exceed the container's width. Figure out how many need to be removed
                const linksToRemove: { [index: string]: number } = {};
                let counter = 1;

                while (linksWidth > containerWidth && counter < elements.length) {
                    const element: HTMLSpanElement = elements[elements.length - counter];

                    const elementWidth = outerWidth(element);
                    linksWidth -= elementWidth;
                    const category: string = element.dataset.category ?? '';
                    // Save the width of the link being removed for use later
                    linksToRemove[category] = elementWidth;
                    counter += 1;
                }

                // Ensure the maxLinks does not become negative
                const max =
                    maxLinks - Object.keys(linksToRemove).length < 0 ? 0 : maxLinks - Object.keys(linksToRemove).length;

                // Update the state
                setMaxLinks(max);
                setLinkWidths({
                    ...linkWidths,
                    ...linksToRemove,
                });
            } else {
                // There is more room, see if any links can be brought back in
                let linksToAdd = 0;

                while (maxLinks + linksToAdd < categories.length && linksWidth < containerWidth) {
                    const category: string = categories[maxLinks + linksToAdd].value;
                    const elementWidth = linkWidths[category];

                    // If there is only one link in the More menu, calculate against the total container width,
                    // otherwise calculate against the container less the width of the more button
                    const targetWidth = maxLinks + linksToAdd + 1 >= categories.length ? width : containerWidth;

                    // If the addition of a link is too large, stop checking
                    if (linksWidth + elementWidth >= targetWidth) {
                        break;
                    }
                    linksToAdd += 1;
                    linksWidth += elementWidth; // always add
                }

                if (linksToAdd > 0) {
                    // Update the state
                    setMaxLinks(maxLinks + linksToAdd);
                }
            }
        },
        [categories, linkWidths, linksRef, maxLinks, moreWidth],
    );

    React.useLayoutEffect(() => {
        if (!moreRef.current) return;

        setMoreWidth(outerWidth(moreRef.current));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moreRef.current, currentCategory]);

    // This effect must be defined after the checkLinks function
    // If the currently selected category changes or the more link width changes, be sure to check for any links to hide or show
    React.useEffect(() => {
        if (!linksRef.current) return;

        const { clientWidth } = linksRef.current;

        checkLinks({ client: { width: clientWidth } });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moreRef.current, moreWidth, currentCategory]);

    return (
        <Measure client innerRef={linksRef} onResize={checkLinks}>
            {({ measureRef }) => (
                <CategorySelectorComponent
                    measureRef={measureRef}
                    moreRef={moreRef}
                    className={className}
                    categories={categories}
                    maxLinks={maxLinks}
                    currentCategory={currentCategory}
                    onSelect={onSelect}
                    categoryProps={categoryProps}
                />
            )}
        </Measure>
    );
};

export default CategorySelector;
