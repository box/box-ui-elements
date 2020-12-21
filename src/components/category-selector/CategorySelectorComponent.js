// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import PlainButton from '../plain-button/PlainButton';
import DropdownMenu, { MenuToggle } from '../dropdown-menu';
import { Menu, SelectMenuItem } from '../menu';
import messages from './messages';

import './CategorySelector.scss';

import type { Category } from './CategorySelector';

type Props = {
    categories: Array<Category>,
    categorySelectorProps: Object,
    className: string,
    currentCategory: string,
    maxLinks: number,
    measureRef: Function,
    moreRef: Function,
    onSelect: string => void,
};

const CategorySelectorComponent = ({
    measureRef,
    moreRef,
    className,
    categories,
    maxLinks,
    currentCategory,
    categorySelectorProps,
    onSelect,
}: Props) => {
    const linkCategories = categories.slice(0, maxLinks);
    const overflowCategories = categories.slice(maxLinks);

    const selectedOverflow = overflowCategories.find(({ value }) => currentCategory === value);

    const renderCategory = ({ value, displayText }: Category) => (
        <span
            key={value}
            className={classnames('category-pill', {
                selected: value === currentCategory,
            })}
            data-category={value}
            data-resin-target="selectcategory"
            data-resin-template_category={displayText}
            data-testid={`template-category-${value}`}
            onClick={() => onSelect(value)}
            onKeyPress={(event: SyntheticKeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(value);
            }}
            role="button"
            tabIndex="0"
            {...categorySelectorProps}
        >
            {displayText}
        </span>
    );

    return (
        <div ref={measureRef} className={classnames(className, 'category-selector')}>
            <div className="category-links">{linkCategories.map(renderCategory)}</div>
            <div
                ref={moreRef}
                className={classnames('category-more', {
                    hide: maxLinks >= categories.length,
                })}
            >
                <DropdownMenu className="dropdownWrapper" isRightAligned>
                    <PlainButton
                        className={classnames('category-more-label', {
                            selected: selectedOverflow,
                        })}
                    >
                        <MenuToggle>
                            {selectedOverflow ? selectedOverflow.displayText : <FormattedMessage {...messages.more} />}
                        </MenuToggle>
                    </PlainButton>
                    <Menu>
                        {overflowCategories.map(({ value, displayText }: Category) => (
                            <SelectMenuItem
                                key={value}
                                data-testid={`template-category-more-${value}`}
                                isSelected={value === currentCategory}
                                onClick={() => onSelect(value)}
                            >
                                {displayText}
                            </SelectMenuItem>
                        ))}
                    </Menu>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default CategorySelectorComponent;
