import * as React from 'react';
import { PointerChevronRight } from '@box/blueprint-web-assets/icons/Fill';
import { Size3 } from '@box/blueprint-web-assets/tokens/tokens';
import type { Delimiter } from '../../../common/types/core';
import { DELIMITER_CARET, COLOR_999 } from '../../../constants';

export interface BreadcrumbDelimiterProps {
    delimiter?: Delimiter;
}

const BreadcrumbDelimiter = ({ delimiter }: BreadcrumbDelimiterProps) =>
    delimiter === DELIMITER_CARET ? (
        <PointerChevronRight
            className="be-breadcrumb-seperator"
            style={{ color: COLOR_999, width: Size3, height: Size3 }}
        />
    ) : (
        <span className="be-breadcrumb-seperator">/</span>
    );

export default BreadcrumbDelimiter;
