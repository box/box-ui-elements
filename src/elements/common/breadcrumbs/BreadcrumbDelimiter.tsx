import * as React from 'react';
import { PointerChevronRight } from '@box/blueprint-web-assets/icons/Fill';
import { Gray50, Size3 } from '@box/blueprint-web-assets/tokens/tokens';
import type { Delimiter } from '../../../common/types/core';
import { DELIMITER_CARET } from '../../../constants';

export interface BreadcrumbDelimiterProps {
    delimiter?: Delimiter;
}

const BreadcrumbDelimiter = ({ delimiter }: BreadcrumbDelimiterProps) =>
    delimiter === DELIMITER_CARET ? (
        <PointerChevronRight
            className="be-breadcrumb-seperator"
            color={Gray50}
            height={Size3}
            role="presentation"
            width={Size3}
        />
    ) : (
        <span className="be-breadcrumb-seperator">/</span>
    );

export default BreadcrumbDelimiter;
