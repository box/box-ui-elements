import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import PlainButton from '../plain-button/PlainButton';
// @ts-ignore flow import
import DropdownMenu, { MenuToggle } from '../dropdown-menu';
import { Menu, SelectMenuItem } from '../menu';
import messages from './messages';

import './CategorySelector.scss';

import { Category } from './CategorySelector';

interface CategorySelectorComponentProps {
    categories: Category[];
    categoryProps: Record<string, unknown>;
    className: string;
    currentCategory: string;
    maxLinks: number;
    measureRef: (ref: Element | null) => void;
    moreRef: React.RefObject<HTMLDivElement>;
    onSelect: (value: string) => void;
}

const CategorySelectorComponent = ({
    measureRef,
    moreRef,
    className,
    categories,
    maxLinks,
    currentCategory,
    categoryProps,
    onSelect,
}: CategorySelectorComponentProps) => {
    const linkCategories = categories.slice(0, maxLinks);
    const overflowCategories = categories.slice(maxLinks);

    const selectedOverflow = overflowCategories.find(({ value }) => currentCategory === value);

    const renderCategory = ({ value, displayText }: Category) => (
        <span
            key={value}
            className={classnames('bdl-CategorySelector-pill', {
                'is-selected': value === currentCategory,
            })}
            data-category={value}
            data-resin-target="selectcategory"
            data-resin-template_category={displayText}
            data-testid={`template-category-${value}`}
            onClick={() => onSelect(value)}
            onKeyPress={(event: React.KeyboardEvent<HTMLSpanElement>) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(value);
            }}
            role="button"
            tabIndex={0}
            {...categoryProps}
        >
            {displayText}
        </span>
    );

    return (
        <div ref={measureRef} className={classnames(className, 'bdl-CategorySelector')}>
            <div className="bdl-CategorySelector-links">{linkCategories.map(renderCategory)}</div>
            <div
                ref={moreRef}
                className={classnames('bdl-CategorySelector-more', {
                    hide: maxLinks >= categories.length,
                })}
            >
                <DropdownMenu className="dropdownWrapper" isRightAligned>
                    <PlainButton
                        className={classnames('bdl-CategorySelector-more-label', {
                            'is-selected': selectedOverflow,
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
