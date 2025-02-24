import * as React from 'react';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';
import type { Crumb, Delimiter } from '../../../common/types/core';
import { DELIMITER_CARET, DELIMITER_SLASH } from '../../../constants';
import BreadcrumbDelimiter from './BreadcrumbDelimiter';

export interface BreadcrumbDropdownProps {
    crumbs: Crumb[];
    delimiter?: Delimiter;
    onCrumbClick: (id: string) => void;
}

const BreadcrumbDropdown = ({ crumbs, delimiter, onCrumbClick }: BreadcrumbDropdownProps) => {
    const condensed = delimiter !== DELIMITER_CARET;
    return (
        <span className="be-breadcrumb-more">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <IconButton
                        aria-label="More breadcrumb items"
                        className={condensed ? 'be-breadcrumbs-condensed' : ''}
                        icon={Ellipsis}
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {crumbs.map(({ id, name }) => (
                        <DropdownMenu.Item key={id} onClick={() => onCrumbClick(id)}>
                            {name}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            <BreadcrumbDelimiter delimiter={condensed ? DELIMITER_SLASH : DELIMITER_CARET} />
        </span>
    );
};

export default BreadcrumbDropdown;
